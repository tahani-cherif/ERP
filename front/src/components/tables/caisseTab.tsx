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
import { deleteCaisse, updateCaisse } from 'src/store/apps/caisse/caisseSlice';

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

interface ICaisse {
  _id: string;
  designation: string;
  encaissement: number;
  decaissement: number;
  date: Date;
  admin: string;
}

const TableCaisse = ({
  rows,
  setData,
  data,
  setTotalDecaissement,
  setTotalEncaissement,
}: {
  rows: ICaisse[];
  setData: any;
  data: ICaisse[] | undefined;
  setTotalDecaissement: any;
  setTotalEncaissement: any;
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
    designation: Yup.string().required(t('faildRequired') || ''),
    encaissement: Yup.number()
      .typeError(t('mustnumber') || 'must be a number')
      .required(t('faildRequired') || '')
      .min(0, t('mustnonnegative') || ' must be a non-negative number'),
    decaissement: Yup.number()
      .typeError(t('mustnumber') || 'must be a number')
      .required(t('faildRequired') || '')
      .min(0, t('mustnonnegative') || ' must be a non-negative number'),
    date: Yup.string().required(t('faildRequired') || ''),
  });
  const formik = useFormik({
    initialValues: {
      designation: '',
      encaissement: '',
      decaissement: '',
      date: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await dispatch(
          updateCaisse(
            {
              date: new Date(values.date),
              encaissement: Number(values.encaissement),
              designation: values.designation,
              decaissement: Number(values.decaissement),
            },
            id,
          ),
        ).then((secc: any) =>
          setData(() => {
            const newData = data?.map((item: ICaisse) => {
              if (item?._id === id) {
                return secc;
              } else {
                return item;
              }
            });

            return newData;
          }),
        );
        let totalenc = 0;
        let totaldec = 0;
        data?.map((item: ICaisse) => {
          totalenc += Number(item.encaissement);
          totaldec += Number(item.decaissement);
        });
        setTotalEncaissement(totalenc);
        setTotalDecaissement(totaldec);
        setId('');
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
            <TableRow className="w-ful">
              <TableCell>
                <Typography variant="h6">Date</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('designation')} </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('encaissement')} </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('decaissement')} </Typography>
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
              <TableRow
                key={row._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                className="w-full"
              >
                <TableCell>
                  <Typography variant="subtitle1" color="textSecondary" className="w-full">
                    {moment(row.date).format('YYYY-MM-DD')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" color="textSecondary">
                    {row.designation}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" color="textSecondary">
                    {row.encaissement}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" color="textSecondary">
                    {row.decaissement}
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
                        setId(row?._id);
                        console.log(row);
                        formik.setValues({
                          designation: row.designation,
                          encaissement: String(row.encaissement),
                          decaissement: String(row.decaissement),
                          date: moment(row.date).format('YYYY-MM-DD'),
                        });
                        setOpenAlerteEdit(true);
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
        <DialogTitle id="responsive-dialog-title">{t('deleteTitleCaisse')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('deleteDescriptionCaisse')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleCloseModal}>
            {t('cancel')}
          </Button>
          <Button
            onClick={async () => {
              setLoading(true);
              await dispatch(deleteCaisse(id));
              setData(rows.filter((row: ICaisse) => row._id !== id));
              let totalenc = 0;
              let totaldec = 0;
              data?.map((item: ICaisse) => {
                totalenc += Number(item.encaissement);
                totaldec += Number(item.decaissement);
              });
              setTotalEncaissement(totalenc);
              setTotalDecaissement(totaldec);
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
          <DialogTitle id="responsive-dialog-title">{t('caisse')}</DialogTitle>
          <DialogContent>
            <Box className="w-full">
              <CustomFormLabel htmlFor="date">date</CustomFormLabel>
              <CustomTextField
                id="date"
                name="date"
                variant="outlined"
                fullWidth
                value={formik.values.date}
                type="date"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.date && Boolean(formik.errors.date)}
                helperText={formik.touched.date && formik.errors.date}
              />
            </Box>
            <Box className="w-full">
              <CustomFormLabel htmlFor="designation">{t('designation')}</CustomFormLabel>
              <CustomTextField
                id="designation"
                name="designation"
                variant="outlined"
                fullWidth
                value={formik.values.designation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.designation && Boolean(formik.errors.designation)}
                helperText={formik.touched.designation && formik.errors.designation}
              />
            </Box>
            <Box className="w-full">
              <CustomFormLabel htmlFor="encaissement">{t('encaissement')}</CustomFormLabel>
              <CustomTextField
                id="encaissement"
                name="encaissement"
                variant="outlined"
                fullWidth
                value={formik.values.encaissement}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.encaissement && Boolean(formik.errors.encaissement)}
                helperText={formik.touched.encaissement && formik.errors.encaissement}
              />
            </Box>
            <Box className="w-full">
              <CustomFormLabel htmlFor="decaissement">{t('decaissement')}</CustomFormLabel>
              <CustomTextField
                id="decaissement"
                name="decaissement"
                variant="outlined"
                fullWidth
                value={formik.values.decaissement}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.decaissement && Boolean(formik.errors.decaissement)}
                helperText={formik.touched.decaissement && formik.errors.decaissement}
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

export default TableCaisse;
