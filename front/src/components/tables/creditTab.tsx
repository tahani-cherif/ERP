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
  TableFooter,
  TablePagination,
  useMediaQuery,
  Chip,
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
import moment from 'moment';
import { deleteCredit, updateCredit } from 'src/store/apps/credit/creditSlice';
import CustomSelect from '../forms/theme-elements/CustomSelect';

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

interface IBanque {
  _id: string;
  banque: string;
  rib: string;
  iban: string;
  swift: string;
  admin: string;
}

interface ICredit {
  _id: string;
  banque: IBanque;
  type: string;
  echeance: string;
  principal: number;
  interet: number;
  total: number;
  montantemprunt: number;
  encours: number;
  etat: string;
  admin: string;
}

const TableCredits = ({
  rows,
  setData,
  data,
  banques,
}: {
  rows: ICredit[];
  setData: any;
  data: ICredit[] | undefined;
  banques: IBanque[] | undefined;
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
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const validationSchema = Yup.object({
    banque: Yup.string().required(t('faildRequired') || ''),
    etat: Yup.string().required(t('faildRequired') || ''),
    montantemprunt: Yup.number()
      .typeError(t('mustnumber') || 'must be a number')
      .required(t('faildRequired') || '')
      .min(0, t('mustnonnegative') || ' must be a non-negative number'),
    type: Yup.string().required(t('faildRequired') || ''),
    echeance: Yup.string().required(t('faildRequired') || ''),
    principal: Yup.number()
      .typeError(t('mustnumber') || 'must be a number')
      .required(t('faildRequired') || '')
      .min(0, t('mustnonnegative') || ' must be a non-negative number'),
    interet: Yup.number()
      .typeError(t('mustnumber') || 'must be a number')
      .required(t('faildRequired') || '')
      .min(0, t('mustnonnegative') || ' must be a non-negative number'),
    total: Yup.number()
      .typeError(t('mustnumber') || 'must be a number')
      .required(t('faildRequired') || '')
      .min(0, t('mustnonnegative') || ' must be a non-negative number'),
    encours: Yup.number()
      .typeError(t('mustnumber') || 'must be a number')
      .required(t('faildRequired') || '')
      .min(0, t('mustnonnegative') || ' must be a non-negative number'),
  });
  const formik = useFormik({
    initialValues: {
      banque: '',
      montantemprunt: '',
      type: '',
      echeance: '',
      principal: '',
      interet: '',
      total: '',
      encours: '',
      etat: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await dispatch(updateCredit(values, id)).then((secc: any) =>
          setData(() => {
            const newData = data?.map((item: ICredit) => {
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
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpenAlerteDelete(false);
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
                <Typography variant="h6">N°</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('echeance')} </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('banque')} </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('typeCredit')} </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('montantEmprunt')} </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('principal')}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('interet')}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('total')}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('encours')}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('etat')}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Action</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
            ).map((row) => (
              <TableRow key={row._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell scope="row">
                  <Typography variant="subtitle1" color="textSecondary">
                    {row._id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" color="textSecondary" className="w-full">
                    {moment(row.echeance).format('YYYY-MM-DD')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" color="textSecondary">
                    {row.banque.banque}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" color="textSecondary">
                    {row.type}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" color="textSecondary">
                    {row.montantemprunt}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" color="textSecondary">
                    {row.principal}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" color="textSecondary">
                    {row.interet}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" color="textSecondary">
                    {row.total}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" color="textSecondary">
                    {row.encours}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" color="textSecondary">
                    {row.etat === 'paid' && (
                      <Chip label={t(row.etat)} color="success" size="small" />
                    )}
                    {row.etat === 'pending' && (
                      <Chip label={t(row.etat)} color="warning" size="small" />
                    )}
                  </Typography>
                </TableCell>

                <TableCell>
                  <IconButton
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
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
                        setId(row?._id);

                        formik.setValues({
                          banque: row?.banque?._id,
                          montantemprunt: String(row.montantemprunt),
                          type: row.type,
                          echeance: moment(new Date(row.echeance)).format('YYYY-MM-DD'),
                          principal: String(row.principal),
                          interet: String(row.interet),
                          total: String(row.total),
                          encours: String(row.encours),
                          etat: row.etat,
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
                        setId(row?._id);
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
        <DialogTitle id="responsive-dialog-title">{t('deleteTitleCredit')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('deleteDescriptionCredit')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleCloseModal}>
            {t('cancel')}
          </Button>
          <Button
            onClick={async () => {
              setLoading(true);
              await dispatch(deleteCredit(id));
              setData(rows.filter((row: ICredit) => row._id !== id));
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
            {t('updateClient') + ' ' + formik.values.banque}
          </DialogTitle>
          <DialogContent>
            <div className="flex gap-4">
              <Box className="w-full">
                <CustomFormLabel htmlFor="banque">{t('banque')}</CustomFormLabel>
                <CustomSelect
                  id="banque"
                  name="banque"
                  value={formik.values.banque}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.banque && Boolean(formik.errors.banque)}
                  helperText={formik.touched.banque && formik.errors.banque}
                  fullWidth
                  variant="outlined"
                >
                  {banques?.map((banque: IBanque) => (
                    <MenuItem key={banque._id} value={banque._id}>
                      {banque.banque}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </Box>
              <Box className="w-full">
                <CustomFormLabel htmlFor="echeance">{t('echeance')}</CustomFormLabel>
                <CustomTextField
                  id="echeance"
                  name="echeance"
                  variant="outlined"
                  fullWidth
                  value={formik.values.echeance || ''}
                  type="date"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.echeance && Boolean(formik.errors.echeance)}
                  helperText={formik.touched.echeance && formik.errors.echeance}
                />
              </Box>
            </div>
            <div className="flex gap-4">
              <Box className="w-full">
                <CustomFormLabel htmlFor="montantemprunt">{t('montantemprunt')}</CustomFormLabel>
                <CustomTextField
                  id="montantemprunt"
                  name="montantemprunt"
                  variant="outlined"
                  fullWidth
                  value={formik.values.montantemprunt}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.montantemprunt && Boolean(formik.errors.montantemprunt)}
                  helperText={formik.touched.montantemprunt && formik.errors.montantemprunt}
                />
              </Box>
              <Box className="w-full">
                <CustomFormLabel htmlFor="principal">{t('principal')}</CustomFormLabel>
                <CustomTextField
                  id="principal"
                  name="principal"
                  variant="outlined"
                  fullWidth
                  value={formik.values.principal}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.principal && Boolean(formik.errors.principal)}
                  helperText={formik.touched.principal && formik.errors.principal}
                />
              </Box>
            </div>
            <div className="flex gap-4">
              <Box className="w-full">
                <CustomFormLabel htmlFor="interet">{t('interet')}</CustomFormLabel>
                <CustomTextField
                  id="interet"
                  name="interet"
                  variant="outlined"
                  fullWidth
                  value={formik.values.interet}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.interet && Boolean(formik.errors.interet)}
                  helperText={formik.touched.interet && formik.errors.interet}
                />
              </Box>
              <Box className="w-full">
                <CustomFormLabel htmlFor="total">{t('total')}</CustomFormLabel>
                <CustomTextField
                  id="total"
                  name="total"
                  variant="outlined"
                  fullWidth
                  value={formik.values.total}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.total && Boolean(formik.errors.total)}
                  helperText={formik.touched.total && formik.errors.total}
                />
              </Box>
            </div>
            <div className="flex gap-4">
              <Box className="w-full">
                <CustomFormLabel htmlFor="encours">{t('encours')}</CustomFormLabel>
                <CustomTextField
                  id="encours"
                  name="encours"
                  variant="outlined"
                  fullWidth
                  value={formik.values.encours}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.encours && Boolean(formik.errors.encours)}
                  helperText={formik.touched.encours && formik.errors.encours}
                />
              </Box>
              <Box className="w-full">
                <CustomFormLabel htmlFor="type">{t('type')}</CustomFormLabel>
                <CustomTextField
                  id="type"
                  name="type"
                  variant="outlined"
                  fullWidth
                  value={formik.values.type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.type && Boolean(formik.errors.type)}
                  helperText={formik.touched.type && formik.errors.type}
                />
              </Box>
            </div>
            <Box className="w-full">
              <CustomFormLabel htmlFor="etat">{t('etat')}</CustomFormLabel>
              <CustomSelect
                id="etat"
                name="etat"
                value={formik.values.etat}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.etat && Boolean(formik.errors.etat)}
                helperText={formik.touched.etat && formik.errors.etat}
                fullWidth
                variant="outlined"
              >
                <MenuItem value="paid">{t('paid')}</MenuItem>
                <MenuItem value="pending">{t('pending')}</MenuItem>
              </CustomSelect>
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

export default TableCredits;
