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
import { deleteFournisseur, updateFournisseur } from 'src/store/apps/fournisseur/fournisseurSlice';

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
interface IFournisseur {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  matriculeFiscale: string;
  admin: string;
}
const TableFournisseur = ({
  rows,
  setData,
  data,
}: {
  rows: IFournisseur[];
  setData: any;
  data: IFournisseur[] | undefined;
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
  const [selectedRow, setSelectedRow] = React.useState<IFournisseur>();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const phonetunis = /^[+0]{0,2}(91)?[0-9]{8}$/;
  const validationSchema = Yup.object({
    fullName: Yup.string().required(t('faildRequired') || ''),
    address: Yup.string().optional(),
    email: Yup.string()
      .email(t('invalidEmail') || '')
      .optional(),
    matriculeFiscale: Yup.string().optional(),
    phone: Yup.string()
      .optional()
      .matches(phonetunis, t('phoneerrors') || ''),
  });
  const formik = useFormik({
    initialValues: {
      fullName: '',
      address: '',
      email: '',
      matriculeFiscale: '',
      phone: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await dispatch(updateFournisseur(values, id)).then((secc: any) =>
          setData(() => {
            const newData = data?.map((item: IFournisseur) => {
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
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, row: IFournisseur) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpenAlerteDelete(false);
    setSelectedRow(undefined);
  };
  const handleCloseModal = () => {
    setOpenAlerteDelete(false);
  };
  const handleCloseModalEdit = () => {
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

  return (
    <BlankCard>
      <TableContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h6">{t('fullName')}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('address')}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('phone')}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('email')}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('matriculeFiscale')}</Typography>
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
              <TableRow
                key={row.fullName}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box>
                      <Typography variant="h6">{row.fullName}</Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell scope="row">
                  <Typography variant="subtitle1" color="textSecondary">
                    {row.address}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" color="textSecondary">
                    {row.phone}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" color="textSecondary">
                    {row.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" color="textSecondary">
                    {row.matriculeFiscale}
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
                          fullName: selectedRow?.fullName || '',
                          address: selectedRow?.address || '',
                          email: selectedRow?.email || '',
                          matriculeFiscale: selectedRow?.matriculeFiscale || '',
                          phone: selectedRow?.phone || '',
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
        <DialogTitle id="responsive-dialog-title">{t('deleteTitleFournisseur')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('deleteDescriptionFournisseur')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleCloseModal}>
            {t('cancel')}
          </Button>
          <Button
            onClick={async () => {
              setLoading(true);
              await dispatch(deleteFournisseur(id));
              setData(rows.filter((row: IFournisseur) => row._id !== id));
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
        <form onSubmit={formik.handleSubmit} className="w-full">
          <DialogTitle id="responsive-dialog-title">
            {t('updateFournisseur') + ' ' + formik.values.fullName}
          </DialogTitle>
          <DialogContent>
            <div className="flex gap-4">
              <Box>
                <CustomFormLabel htmlFor="fullName">{t('fullName')}</CustomFormLabel>
                <CustomTextField
                  id="fullName"
                  name="fullName"
                  variant="outlined"
                  fullWidth
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                  helperText={formik.touched.fullName && formik.errors.fullName}
                />
              </Box>
              <Box>
                <CustomFormLabel htmlFor="email">{t('email')}</CustomFormLabel>
                <CustomTextField
                  id="email"
                  name="email"
                  variant="outlined"
                  fullWidth
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Box>
            </div>
            <div className="flex gap-4">
              <Box>
                <CustomFormLabel htmlFor="address">{t('address')}</CustomFormLabel>
                <CustomTextField
                  id="address"
                  name="address"
                  variant="outlined"
                  fullWidth
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.address && Boolean(formik.errors.address)}
                  helperText={formik.touched.address && formik.errors.address}
                />
              </Box>
              <Box>
                <CustomFormLabel htmlFor="phone">{t('phone')}</CustomFormLabel>
                <CustomTextField
                  id="phone"
                  name="phone"
                  variant="outlined"
                  fullWidth
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                />
              </Box>
            </div>
            <Box>
              <CustomFormLabel htmlFor="matriculeFiscale">{t('matriculeFiscale')}</CustomFormLabel>
              <CustomTextField
                id="matriculeFiscale"
                name="matriculeFiscale"
                variant="outlined"
                fullWidth
                value={formik.values.matriculeFiscale}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.matriculeFiscale && Boolean(formik.errors.matriculeFiscale)}
                helperText={formik.touched.matriculeFiscale && formik.errors.matriculeFiscale}
              />
            </Box>
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

export default TableFournisseur;
