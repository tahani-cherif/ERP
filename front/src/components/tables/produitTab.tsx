import React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  Box,
  Stack,
  TableFooter,
  TablePagination,
  useMediaQuery,
  Collapse,
} from '@mui/material';
import BlankCard from '../shared/BlankCard';
import { IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons';
import { useTranslation } from 'react-i18next';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { useDispatch } from 'src/store/Store';
import SpinnerSubmit from 'src/views/spinnerSubmit/Spinner';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import CustomFormLabel from '../forms/theme-elements/CustomFormLabel';
import CustomTextField from '../forms/theme-elements/CustomTextField';
import { deleteProduit, updateProduit } from 'src/store/apps/produit/produitSlice';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import moment from 'moment';

//pagination
interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event: any) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: any) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: any) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: any) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

// page
interface IProduit {
  _id: string;
  reference: string;
  name: string;
  description: string;
  pricepurchase: string;
  pricesales: string;
  price: string;
  montantbenefices: string;
  stock: number;
  admin: string;
  type: string;
  historique?: {
    type: string;
    date: Date;
    quantite: number;
  }[];
}
const TableProduit = ({
  rows,
  setData,
  data,
}: {
  rows: IProduit[];
  setData: any;
  data: IProduit[] | undefined;
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [openAlertDelete, setOpenAlerteDelete] = React.useState(false);
  const [openAlertEdit, setOpenAlerteEdit] = React.useState(false);
  const [id, setId] = React.useState<string>('');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [loading, setLoading] = React.useState(false);
  const [openHistorique, setOpenHistorique] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<IProduit>();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user') || '');
  const validationSchema =
    user?.role === 'agence'
      ? Yup.object({
          reference: Yup.string().required(t('faildRequired') || ''),
          name: Yup.string().required(t('faildRequired') || ''),
          description: Yup.string().optional(),
          price: Yup.number()
            .typeError(t('priceMustBeNumber') || 'Price must be a number') // Custom message for type errors
            .required(t('faildRequired') || 'Price is required')
            .min(0, t('priceMustBePositive') || 'Price must be a non-negative number'),
          montantbenefices: Yup.number()
            .typeError(t('priceMustBeNumber') || 'Price must be a number') // Custom message for type errors
            .required(t('faildRequired') || 'Price is required')
            .min(0, t('priceMustBePositive') || 'Price must be a non-negative number'),
          stock: Yup.number()
            .typeError(t('mustnumber') || 'must be a number')
            .required(t('faildRequired') || 'Price is required')
            .min(0, t('mustnonnegative') || ' must be a non-negative number'),

          // type: Yup.string().required(t('faildRequired') || ''),
        })
      : Yup.object({
          reference: Yup.string().required(t('faildRequired') || ''),
          name: Yup.string().required(t('faildRequired') || ''),
          description: Yup.string().optional(),
          pricepurchase: Yup.number()
            .typeError(t('priceMustBeNumber') || 'Price must be a number') // Custom message for type errors
            .required(t('faildRequired') || 'Price is required')
            .min(0, t('priceMustBePositive') || 'Price must be a non-negative number'),
          pricesales: Yup.number()
            .typeError(t('priceMustBeNumber') || 'Price must be a number') // Custom message for type errors
            .required(t('faildRequired') || 'Price is required')
            .min(0, t('priceMustBePositive') || 'Price must be a non-negative number'),
          stock: Yup.number()
            .typeError(t('mustnumber') || 'must be a number')
            .required(t('faildRequired') || 'Price is required')
            .min(0, t('mustnonnegative') || ' must be a non-negative number'),

          // type: Yup.string().required(t('faildRequired') || ''),
        });
  const formik = useFormik({
    initialValues: {
      reference: '',
      name: '',
      description: '',
      pricesales: '',
      pricepurchase: '',
      price: '',
      stock: '',
      montantbenefices: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await dispatch(
          updateProduit(
            {
              ...values,
              montantbenefices: user?.role === 'agence' ? Number(values.montantbenefices) : 0,
              price: user?.role === 'agence' ? Number(values.price) : 0,
              pricesales: Number(values.pricesales),
              pricepurchase: Number(values.pricepurchase),
              stock: Number(values.stock),
            },
            id,
          ),
        ).then((secc: any) =>
          setData(() => {
            const newData = data?.map((item: IProduit) => {
              if (item?._id === id) {
                return secc;
              } else {
                return item;
              }
            });

            return newData;
          }),
        );
        setLoading(false);
        handleCloseModalEdit();
      } catch (error) {
        console.error(error);
      }
    },
  });
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, row: IProduit) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpenAlerteDelete(false);
    setLoading(false);
    setSelectedRow(undefined);
  };
  const handleCloseModal = () => {
    setOpenAlerteDelete(false);
  };
  const handleCloseModalEdit = () => {
    setLoading(false);
    setOpenAlerteEdit(false);
    setId('');
    formik.resetForm();
  };
  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  function formatNumber(number: number) {
    const roundedNumber = number.toFixed(3);
    return roundedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  return (
    <BlankCard>
      <TableContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>
                <Typography variant="h6">{t('Reference')}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('nom')}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('description')}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('pricesales')}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('pricepurchase')}</Typography>
              </TableCell>

              <TableCell>
                <Typography variant="h6">{t('quantite')}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Action</Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
            ).map((row) => (
              <>
                <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => setOpenHistorique(!openHistorique)}
                    >
                      {openHistorique ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box>
                        <Typography variant="h6">{row.reference}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box>
                        <Typography variant="subtitle1" color="textSecondary">
                          {row.name}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box>
                        <Typography variant="subtitle1" color="textSecondary">
                          {row.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell scope="row">
                    <Typography variant="subtitle1" color="textSecondary">
                      {user?.role === 'agence'
                        ? formatNumber(Number(row.price) + Number(row.montantbenefices))
                        : formatNumber(Number(row.pricesales))}
                    </Typography>
                  </TableCell>
                  <TableCell scope="row">
                    <Typography variant="subtitle1" color="textSecondary">
                      {user?.role === 'agence'
                        ? formatNumber(Number(row.price))
                        : formatNumber(Number(row.pricepurchase))}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" color="textSecondary">
                      {row.stock}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <IconButton
                      id="basic-button"
                      aria-controls={open ? 'basic-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                      onClick={(event) => handleClick(event, row)}
                    >
                      <IconDotsVertical width={18} />
                    </IconButton>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button',
                      }}
                    >
                      <MenuItem
                        onClick={() => {
                          handleClose();
                          setOpenAlerteEdit(true);
                          setId(selectedRow?._id || '');
                          formik.setValues({
                            reference: selectedRow?.reference || '',
                            name: selectedRow?.name || '',
                            description: selectedRow?.description || '',
                            price: String(selectedRow?.pricesales || ''),
                            pricesales: String(selectedRow?.pricesales || ''),
                            pricepurchase: String(selectedRow?.pricepurchase || ''),
                            stock: String(selectedRow?.stock || ''),
                            montantbenefices: String(selectedRow?.montantbenefices || ''),
                          });
                        }}
                      >
                        <ListItemIcon>
                          <IconEdit width={18} />
                        </ListItemIcon>
                        Edit
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleClose();
                          setOpenAlerteDelete(true);
                          setId(selectedRow?._id || '');
                        }}
                      >
                        <ListItemIcon>
                          <IconTrash width={18} />
                        </ListItemIcon>
                        Delete
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                    <Collapse in={openHistorique} timeout="auto" unmountOnExit>
                      <Box margin={1}>
                        <Typography
                          gutterBottom
                          variant="h5"
                          sx={{
                            mt: 2,
                            backgroundColor: (theme) => theme.palette.grey.A200,
                            p: '5px 15px',
                            color: (theme) =>
                              `${
                                theme.palette.mode === 'dark'
                                  ? theme.palette.grey.A200
                                  : 'rgba(0, 0, 0, 0.87)'
                              }`,
                          }}
                        >
                          Historique stock
                        </Typography>
                        <Table size="small" aria-label="purchases">
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                <Typography variant="h6">Date</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="h6">{t('entre')}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="h6">{t('sorte')}</Typography>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {row?.historique?.map(
                              (article: { type: string; date: Date; quantite: number }) => (
                                <TableRow key={article.type}>
                                  <TableCell>
                                    <Typography color="textSecondary" fontWeight="400">
                                      {moment(article.date).format('MM/DD/YYYY')}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography color="textSecondary" fontWeight="400">
                                      {article.type === 'entre' ? article.quantite : '-'}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography color="textSecondary" fontWeight="400">
                                      {article.type === 'sorte' ? article.quantite : '-'}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              ),
                            )}
                            {row?.historique?.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={12} className="w-full flex justify-center">
                                  <span className="text-center m-auto">{t('notFound')}</span>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="w-full flex justify-center">
                  <span className="text-center m-auto">{t('notFound')}</span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={6}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      {/* dialog delete */}
      <Dialog
        fullScreen={fullScreen}
        open={openAlertDelete}
        onClose={handleCloseModal}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{t('deleteTitleProduct')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('deleteDescriptionProduit')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleCloseModal}>
            {t('cancel')}
          </Button>
          <Button
            onClick={async () => {
              setLoading(true);
              await dispatch(deleteProduit(id));
              setData(rows.filter((row: IProduit) => row._id !== id));
              setId('');
              setLoading(false);
              handleCloseModal();
            }}
            disabled={loading}
            className="flex gap-10"
          >
            {loading && (
              <div>
                <SpinnerSubmit />
              </div>
            )}
            <span>Submit</span>
          </Button>
        </DialogActions>
      </Dialog>
      {/* dialog edit */}
      <Dialog
        fullScreen={fullScreen}
        open={openAlertEdit}
        onClose={handleCloseModalEdit}
        aria-labelledby="responsive-dialog-title"
      >
        {' '}
        <form onSubmit={formik.handleSubmit} className="w-96">
          <DialogTitle id="responsive-dialog-title">{t('produit')}</DialogTitle>
          <DialogContent>
            <Box>
              <CustomFormLabel htmlFor="reference">{t('reference')}</CustomFormLabel>
              <CustomTextField
                id="reference"
                name="reference"
                variant="outlined"
                fullWidth
                value={formik.values.reference}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.reference && Boolean(formik.errors.reference)}
                helperText={formik.touched.reference && formik.errors.reference}
              />
            </Box>
            <Box>
              <CustomFormLabel htmlFor="fullName">{t('nom')}</CustomFormLabel>
              <CustomTextField
                id="name"
                name="name"
                variant="outlined"
                fullWidth
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Box>
            <Box>
              <CustomFormLabel htmlFor="address">{t('description')}</CustomFormLabel>
              <CustomTextField
                id="description"
                name="description"
                variant="outlined"
                fullWidth
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Box>
            <Box>
              <CustomFormLabel htmlFor="stock">{t('stock')}</CustomFormLabel>
              <CustomTextField
                id="stock"
                name="stock"
                variant="outlined"
                fullWidth
                value={formik.values.stock}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.stock && Boolean(formik.errors.stock)}
                helperText={formik.touched.stock && formik.errors.stock}
              />
            </Box>
            {user?.role === 'agence' ? (
              <>
                <Box>
                  <CustomFormLabel htmlFor="price">{t('price')}</CustomFormLabel>
                  <CustomTextField
                    id="price"
                    name="price"
                    variant="outlined"
                    fullWidth
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.price && Boolean(formik.errors.price)}
                    helperText={formik.touched.price && formik.errors.price}
                  />
                </Box>
                <Box>
                  <CustomFormLabel htmlFor="montantbenefices">
                    {t('montantbenefices')}
                  </CustomFormLabel>
                  <CustomTextField
                    id="montantbenefices"
                    name="montantbenefices"
                    variant="outlined"
                    fullWidth
                    value={formik.values.montantbenefices}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.montantbenefices && Boolean(formik.errors.montantbenefices)
                    }
                    helperText={formik.touched.montantbenefices && formik.errors.montantbenefices}
                  />
                </Box>
              </>
            ) : (
              <>
                <Box>
                  <CustomFormLabel htmlFor="pricepurchase">{t('pricepurchase')}</CustomFormLabel>
                  <CustomTextField
                    id="pricepurchase"
                    name="pricepurchase"
                    variant="outlined"
                    fullWidth
                    value={formik.values.pricepurchase}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.pricepurchase && Boolean(formik.errors.pricepurchase)}
                    helperText={formik.touched.pricepurchase && formik.errors.pricepurchase}
                  />
                </Box>
                <Box>
                  <CustomFormLabel htmlFor="pricesales">{t('pricesales')}</CustomFormLabel>
                  <CustomTextField
                    id="pricesales"
                    name="pricesales"
                    variant="outlined"
                    fullWidth
                    value={formik.values.pricesales}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.pricesales && Boolean(formik.errors.pricesales)}
                    helperText={formik.touched.pricesales && formik.errors.pricesales}
                  />
                </Box>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={handleCloseModalEdit}>
              {t('cancel')}
            </Button>
            <Button type="submit" className="flex gap-10" disabled={loading}>
              {loading && (
                <div>
                  <SpinnerSubmit />
                </div>
              )}
              <span>Submit</span>
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </BlankCard>
  );
};

export default TableProduit;
