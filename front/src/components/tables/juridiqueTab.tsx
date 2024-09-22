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
import { IconEdit } from '@tabler/icons';
import CustomFormLabel from '../forms/theme-elements/CustomFormLabel';
import CustomTextField from '../forms/theme-elements/CustomTextField';
import { updateJuridique } from 'src/store/apps/vente/venteSlice';

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
interface Iclient {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  matriculeFiscale: string;
  admin: string;
}

interface IVente {
  _id: string;
  client: Iclient;
  total_general: string;
  numeroDossier: string;
  datejugement: string;
  huissierjustice: string;
  admin: string;
  montantimpaye: number;
  statut: string;
}

const TableJuridique = ({
  rows,
  setData,
  data,
}: {
  rows: IVente[];
  setData: any;
  data: IVente[] | undefined;
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
    datejugement: Yup.string().optional(),
    numeroDossier: Yup.string().optional(),
    huissierjustice: Yup.string().optional(),
    montantimpaye: Yup.number()
      .typeError(t('mustnumber') || 'must be a number')
      .required(t('faildRequired') || '')
      .min(0, t('mustnonnegative') || ' must be a non-negative number'),
  });
  const formik = useFormik({
    initialValues: {
      numeroDossier: '',
      datejugement: '',
      huissierjustice: '',
      montantimpaye: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      console.log(values);
      try {
        setData(data);
        await dispatch(
          updateJuridique({ ...values, montantimpaye: Number(values.montantimpaye) }, id),
        ).then((secc: any) =>
          setData(() => {
            const newData = data?.map((item: IVente) => {
              if (item?._id === id) {
                console.log({ secc });

                return {
                  ...item,
                  montantimpaye: values.montantimpaye,
                  datejugement: values.datejugement,
                  huissierjustice: values.huissierjustice,
                  numeroDossier: values.numeroDossier,
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
                <Typography variant="h6">{t('nomClients')}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('matriculeFiscale')}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('montantimpayee')}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('numerodossier')}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('datejugement')}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('huissierjustice')}</Typography>
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
                        <Typography variant="h6">{row._id}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box>
                        <Typography variant="subtitle1" color="textSecondary">
                          {row.client.fullName}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box>
                        <Typography variant="subtitle1" color="textSecondary">
                          {row.client.matriculeFiscale}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" color="textSecondary">
                      {formatNumber(Number(row.montantimpaye))}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" color="textSecondary">
                      {row.numeroDossier || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" color="textSecondary">
                      {row.datejugement || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" color="textSecondary">
                      {row.huissierjustice || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button
                      className="flex gap-4 p-4"
                      onClick={() => {
                        setOpenAlerte(true);
                        setId(row._id);
                        formik.setValues({
                          numeroDossier: row.numeroDossier,
                          datejugement: row.datejugement,
                          huissierjustice: row.huissierjustice,
                          montantimpaye: String(row.montantimpaye),
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
      {/* dialog edit  */}
      <Dialog
        fullScreen={fullScreen}
        open={openAlert}
        onClose={handleCloseModal}
        aria-labelledby="responsive-dialog-title"
      >
        <form onSubmit={formik.handleSubmit} className="w-full">
          <DialogTitle id="responsive-dialog-title">{t('juridique')}</DialogTitle>
          <DialogContent>
            <Box className="w-full">
              <CustomFormLabel htmlFor="montantimpaye">{t('montantimpaye')}</CustomFormLabel>
              <CustomTextField
                id="montantimpaye"
                name="montantimpaye"
                variant="outlined"
                fullWidth
                value={formik.values.montantimpaye}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.montantimpaye && Boolean(formik.errors.montantimpaye)}
                helperText={formik.touched.montantimpaye && formik.errors.montantimpaye}
              />
            </Box>
            <Box className="w-full">
              <CustomFormLabel htmlFor="datejugement">{t('datejugement')}</CustomFormLabel>
              <CustomTextField
                id="datejugement"
                name="datejugement"
                variant="outlined"
                fullWidth
                value={formik.values.datejugement}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.datejugement && Boolean(formik.errors.datejugement)}
                helperText={formik.touched.datejugement && formik.errors.datejugement}
              />
            </Box>
            <Box className="w-full">
              <CustomFormLabel htmlFor="huissierjustice">{t('huissierjustice')}</CustomFormLabel>
              <CustomTextField
                id="huissierjustice"
                name="huissierjustice"
                variant="outlined"
                fullWidth
                value={formik.values.huissierjustice}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.huissierjustice && Boolean(formik.errors.huissierjustice)}
                helperText={formik.touched.huissierjustice && formik.errors.huissierjustice}
              />
            </Box>
            <Box className="w-full">
              <CustomFormLabel htmlFor="numeroDossier">{t('numeroDossier')}</CustomFormLabel>
              <CustomTextField
                id="numeroDossier"
                name="numeroDossier"
                variant="outlined"
                fullWidth
                value={formik.values.numeroDossier}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.numeroDossier && Boolean(formik.errors.numeroDossier)}
                helperText={formik.touched.numeroDossier && formik.errors.numeroDossier}
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

export default TableJuridique;
