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
  IconButton,
  Box,
  Stack,
  TableFooter,
  TablePagination,
  useMediaQuery,
  Chip,
} from '@mui/material';

import BlankCard from '../shared/BlankCard';

import { useTranslation } from 'react-i18next';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useDispatch } from 'src/store/Store';
import SpinnerSubmit from 'src/views/spinnerSubmit/Spinner';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import moment from 'moment';
import { IconEdit } from '@tabler/icons';
import CustomFormLabel from '../forms/theme-elements/CustomFormLabel';
import CustomTextField from '../forms/theme-elements/CustomTextField';
import { updateVenteRecouvrement } from 'src/store/apps/vente/venteSlice';

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
  name: string;
  description: string;
  price: string;
  stock: number;
  admin: string;
}

interface IAchat {
  _id: string;
  reference: string;
  articles: {
    produit: IProduit;
    quantite: string;
  }[];
  total_general: string;
  statut: string;
  echeance: string;
  tva: number;
  totalHTV: number;
  modepaiement: string;
  admin: string;
  avance: number;
  reste: number;
  numero: string;
  banque: string;
}

const TableDepnose = ({
  rows,
  setData,
  data,
}: {
  rows: IAchat[];
  setData: any;
  data: IAchat[] | undefined;
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  console.log(data, dispatch);
  const [openAlert, setOpenAlerte] = React.useState(false);
  const [id, setId] = React.useState<string>('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [loading, setLoading] = React.useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const validationSchema = Yup.object({
    banque: Yup.string().optional(),
    echeance: Yup.string().optional(),
    numero: Yup.string().optional(),
    total_general: Yup.number()
      .typeError(t('priceMustBeNumber') || 'Price must be a number') // Custom message for type errors
      .optional()
      .min(0, t('priceMustBePositive') || 'Price must be a non-negative number'),
    reste: Yup.number()
      .typeError(t('priceMustBeNumber') || 'Price must be a number') // Custom message for type errors
      .optional()
      .min(0, t('priceMustBePositive') || 'Price must be a non-negative number'),
    avance: Yup.number()
      .typeError(t('priceMustBeNumber') || 'Price must be a number') // Custom message for type errors
      .optional()
      .min(0, t('priceMustBePositive') || 'Price must be a non-negative number'),
  });
  const formik = useFormik({
    initialValues: {
      banque: '',
      echeance: '',
      numero: '',
      total_general: '',
      reste: '',
      avance: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await dispatch(updateVenteRecouvrement(values, id)).then((secc: any) =>
          setData(() => {
            const newData = data?.map((item: IAchat) => {
              if (item?._id === id) {
                console.log({ secc });

                return {
                  ...item,
                  banque: values.banque,
                  echeance: values.echeance,
                  numero: values.numero,
                  total_general: values.total_general,
                  reste: values.reste,
                  avance: values.avance,
                };
              } else {
                return item;
              }
            });

            return newData;
          }),
        );
        setLoading(false);
        handleCloseModal();
      } catch (error) {
        console.error(error);
      }
    },
  });

  const handleCloseModal = () => {
    setOpenAlerte(false);
    setLoading(false);
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
              <TableCell>
                <Typography variant="h6">{t('Reference')}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('echeance')}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">statut</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('modepaiement')} </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('numero')}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('banque')}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('montantTotal')}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('avance')}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('reste')}</Typography>
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
              <>
                <TableRow key={row._id}>
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
                          {moment(row.echeance).format('DD/MM/YYYY')}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell scope="row">
                    <Typography variant="subtitle1" color="textSecondary">
                      {row.statut === 'paid' && (
                        <Chip label={t(row.statut)} color="success" size="small" />
                      )}
                      {row.statut === 'cancelled' && (
                        <Chip label={t(row.statut)} color="error" size="small" />
                      )}
                      {(row.statut === 'pending' || row.statut === 'semi-paid') && (
                        <Chip label={t(row.statut)} color="warning" size="small" />
                      )}
                      {row.statut === 'pendingecheance' && (
                        <Chip label={t(row.statut)} color="warning" size="small" />
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" color="textSecondary">
                      {t(row.modepaiement)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" color="textSecondary">
                      {row.numero || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" color="textSecondary">
                      {row.banque || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" color="textSecondary">
                      {formatNumber(Number(row.total_general))}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" color="textSecondary">
                      {row.avance ? formatNumber(Number(row.avance)) : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" color="textSecondary">
                      {row.reste ? formatNumber(Number(row.reste)) : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button
                      className="flex gap-4 p-4"
                      onClick={() => {
                        setOpenAlerte(true);
                        setId(row._id);
                        formik.setValues({
                          banque: row.banque,
                          echeance: moment(new Date(row?.echeance)).format('YYYY-MM-DD'),
                          numero: row.numero,
                          total_general: row.total_general ? String(row.total_general) : '',
                          reste: row.reste ? String(row.reste) : '',
                          avance: row.avance ? String(row.avance) : '',
                        });
                      }}
                    >
                      <IconEdit />
                      <span>update</span>
                    </Button>
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
      {/* dialog edit status */}
      <Dialog
        fullScreen={fullScreen}
        open={openAlert}
        fullWidth
        onClose={handleCloseModal}
        aria-labelledby="responsive-dialog-title"
      >
        <form onSubmit={formik.handleSubmit} className="w-full">
          <DialogTitle id="responsive-dialog-title">{t('deponse')}</DialogTitle>
          <DialogContent>
            <Box className="w-full">
              <CustomFormLabel htmlFor="echeance">{t('echeance')}</CustomFormLabel>
              <CustomTextField
                id="echeance"
                name="echeance"
                variant="outlined"
                fullWidth
                value={formik.values.echeance}
                type="date"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.echeance && Boolean(formik.errors.echeance)}
                helperText={formik.touched.echeance && formik.errors.echeance}
              />
            </Box>
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
              <CustomFormLabel htmlFor="numero">{t('numero')}</CustomFormLabel>
              <CustomTextField
                id="numero"
                name="numero"
                variant="outlined"
                fullWidth
                value={formik.values.numero}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.numero && Boolean(formik.errors.numero)}
                helperText={formik.touched.numero && formik.errors.numero}
              />
            </Box>
            <Box>
              <CustomFormLabel htmlFor="total_general">{t('montantTotal')}</CustomFormLabel>
              <CustomTextField
                id="total_general"
                name="total_general"
                variant="outlined"
                fullWidth
                value={formik.values.total_general}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.total_general && Boolean(formik.errors.total_general)}
                helperText={formik.touched.total_general && formik.errors.total_general}
              />
            </Box>
            <Box>
              <CustomFormLabel htmlFor="avance">{t('avance')}</CustomFormLabel>
              <CustomTextField
                id="avance"
                name="avance"
                variant="outlined"
                fullWidth
                value={formik.values.avance}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.avance && Boolean(formik.errors.avance)}
                helperText={formik.touched.avance && formik.errors.avance}
              />
            </Box>
            <Box>
              <CustomFormLabel htmlFor="reste">{t('reste')}</CustomFormLabel>
              <CustomTextField
                id="reste"
                name="reste"
                variant="outlined"
                fullWidth
                value={formik.values.reste}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.reste && Boolean(formik.errors.reste)}
                helperText={formik.touched.reste && formik.errors.reste}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={handleCloseModal}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={loading} className="flex gap-10">
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

export default TableDepnose;
