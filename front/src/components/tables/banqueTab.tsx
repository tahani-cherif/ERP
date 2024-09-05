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
import { deleteBanque, updateBanque } from 'src/store/apps/banque/banqueSlice';

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

const TableBanque = ({
  rows,
  setData,
  data,
}: {
  rows: IBanque[];
  setData: any;
  data: IBanque[] | undefined;
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
  const [selectedRow, setSelectedRow] = React.useState<IBanque>();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const validationSchema = Yup.object({
    banque: Yup.string().required(t('faildRequired') || ''),
    rib: Yup.string().required(t('faildRequired') || ''),
    iban: Yup.string().required(t('faildRequired') || ''),
    swift: Yup.string().required(t('faildRequired') || ''),
  });
  const formik = useFormik({
    initialValues: {
      banque: '',
      rib: '',
      iban: '',
      swift: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await dispatch(updateBanque(values, id)).then((secc: any) =>
          setData(() => {
            const newData = data?.map((item: IBanque) => {
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
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, row: IBanque) => {
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
                <Typography variant="h6">{t('banque')}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">RIB </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">IBAN </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Code SWIFT </Typography>
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
              <TableRow key={row.banque} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box>
                      <Typography variant="h6">{row.banque}</Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell scope="row">
                  <Typography variant="subtitle1" color="textSecondary">
                    {row.rib}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" color="textSecondary">
                    {row.iban}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" color="textSecondary">
                    {row.swift}
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
                          banque: selectedRow?.banque || '',
                          rib: selectedRow?.rib || '',
                          iban: selectedRow?.iban || '',
                          swift: selectedRow?.swift || '',
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
        <DialogTitle id="responsive-dialog-title">{t('deleteTitleBanque')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('deleteDescriptionBanque')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleCloseModal}>
            {t('cancel')}
          </Button>
          <Button
            onClick={async () => {
              setLoading(true);
              await dispatch(deleteBanque(id));
              setData(rows.filter((row: IBanque) => row._id !== id));
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
            <Box>
              <CustomFormLabel htmlFor="banque">{t('banque')}</CustomFormLabel>
              <CustomTextField
                id="banque"
                name="banque"
                variant="outlined"
                fullWidth
                value={formik.values.banque}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.banque && Boolean(formik.errors.banque)}
                helperText={formik.touched.banque && formik.errors.banque}
              />
            </Box>
            <Box>
              <CustomFormLabel htmlFor="rib">RIB</CustomFormLabel>
              <CustomTextField
                id="rib"
                name="rib"
                variant="outlined"
                fullWidth
                value={formik.values.rib}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.rib && Boolean(formik.errors.rib)}
                helperText={formik.touched.rib && formik.errors.rib}
              />
            </Box>
            <Box>
              <CustomFormLabel htmlFor="iban">IBAN</CustomFormLabel>
              <CustomTextField
                id="iban"
                name="iban"
                variant="outlined"
                fullWidth
                value={formik.values.iban}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.iban && Boolean(formik.errors.iban)}
                helperText={formik.touched.iban && formik.errors.iban}
              />
            </Box>
            <Box>
              <CustomFormLabel htmlFor="swift">Code SWIFT</CustomFormLabel>
              <CustomTextField
                id="swift"
                name="swift"
                variant="outlined"
                fullWidth
                value={formik.values.swift}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.swift && Boolean(formik.errors.swift)}
                helperText={formik.touched.swift && formik.errors.swift}
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

export default TableBanque;
