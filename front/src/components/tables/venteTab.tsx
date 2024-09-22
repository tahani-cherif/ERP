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
  Collapse,
  Chip,
  Menu,
  ListItemIcon,
  MenuItem,
} from '@mui/material';

import BlankCard from '../shared/BlankCard';

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
import moment from 'moment';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { IconDotsVertical, IconEdit } from '@tabler/icons';
import CustomSelect from '../forms/theme-elements/CustomSelect';
import { updateStatus } from 'src/store/apps/vente/venteSlice';
import { PDFViewer } from '@react-pdf/renderer';
import InvoicePDF from '../file/invoicePDF';
import DeliveryNotePDF from '../file/deliveryNotePDF';
import QuotePDF from '../file/quotePDF';

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

interface IProduit {
  _id: string;
  name: string;
  description: string;
  price: string;
  pricesales: string;
  stock: number;
  admin: string;
}

interface IVente {
  _id: string;
  reference: string;
  client: Iclient;
  articles: {
    produit: IProduit;
    quantite: string;
  }[];
  total_general: string;
  statut: string;
  date: string;
  tva: number;
  totalHTV: number;
  modepaiement: string;
  admin: string;
}

const TableVente = ({
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
  const [openAlertDelete, setOpenAlerteDelete] = React.useState(false);
  const [openArticle, setOpenArticle] = React.useState(false);
  const [openAttachment, setOpenAttachment] = React.useState(false);
  const [facture, setFacture] = React.useState<any>();
  const [id, setId] = React.useState<string>('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [etat, setEtat] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = React.useState<IVente>();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user') || '');
  const validationSchema = Yup.object({
    status: Yup.string().required(t('faildRequired') || ''),
  });
  const formik = useFormik({
    initialValues: {
      status: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        console.log(selectedRow);
        await dispatch(
          updateStatus(
            {
              status: values.status,
              montantimpaye: values.status === 'not-paid' ? Number(selectedRow?.total_general) : 0,
            },
            id,
          ),
        ).then((secc: any) =>
          setData(() => {
            const newData = data?.map((item: IVente) => {
              if (item?._id === id) {
                console.log(secc);

                return {
                  ...item,
                  statut: values.status,
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
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, row: IVente) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpenAlerteDelete(false);

    // setSelectedRow(undefined);
  };
  const handleCloseModal = () => {
    setOpenAlerteDelete(false);
  };
  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleCloseOpenAttachment = () => {
    setLoading(false);
    setOpenAttachment(false);
    setFacture({});
    setId('');
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
                <Typography variant="h6">{t('facture')} N°</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Date</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('nomClients')}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">statut</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('montantTotal')}</Typography>
              </TableCell>
              {user?.role === 'agence' && (
                <TableCell>
                  <Typography variant="h6">Marge HT</Typography>
                </TableCell>
              )}
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
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => setOpenArticle(!openArticle)}
                    >
                      {openArticle ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box>
                        <Typography variant="h6">{row?.reference}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box>
                        <Typography variant="subtitle1" color="textSecondary">
                          {moment(row.date).format('DD/MM/YYYY')}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box>
                        <Typography variant="subtitle1" color="textSecondary">
                          {row?.client?.fullName}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell scope="row">
                    <Typography variant="subtitle1" color="textSecondary">
                      {row.statut === 'paid' && (
                        <Chip label={t(row.statut)} color="success" size="small" />
                      )}
                      {(row.statut === 'pending' || row.statut === 'semi-paid') && (
                        <Chip label={t(row.statut)} color="warning" size="small" />
                      )}
                      {(row.statut === 'cancelled' || row.statut === 'not-paid') && (
                        <Chip label={t(row.statut)} color="error" size="small" />
                      )}
                      {row.statut === 'pendingecheance' && (
                        <Chip label={t(row.statut)} color="warning" size="small" />
                      )}
                      {(row.statut === 'pending' || row.statut === 'pendingecheance') && (
                        <IconButton
                          id="basic-button"
                          aria-controls={open ? 'basic-menu' : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? 'true' : undefined}
                          onClick={(event) => handleClick(event, row)}
                        >
                          <IconDotsVertical width={18} />
                        </IconButton>
                      )}
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
                            setOpenAlerteDelete(true);
                            setId(selectedRow?._id || '');
                            setEtat(selectedRow?.statut || '');
                          }}
                        >
                          <ListItemIcon>
                            <IconEdit width={18} />
                          </ListItemIcon>
                          Edit statut
                        </MenuItem>
                      </Menu>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" color="textSecondary">
                      {formatNumber(Number(row.total_general))}
                    </Typography>
                  </TableCell>
                  {user?.role === 'agence' && (
                    <TableCell>
                      <Typography variant="subtitle1" color="textSecondary">
                        {formatNumber(Number(row.total_general) - Number(row.totalHTV) - 1)}
                      </Typography>
                    </TableCell>
                  )}
                  <TableCell>
                    <Button
                      onClick={() => {
                        setOpenAttachment(true);

                        setFacture({
                          order: {
                            number: row?.reference,
                            date: moment(row.date).format('YYYY-MM-DD'),
                            supplier: { name: '', address: '' },
                            client: { name: row?.client?.fullName, address: row?.client?.address },
                            items: row?.articles?.map((item: any) => {
                              return {
                                description: item?.produit?.name,
                                quantity: item?.quantite,
                                unitPrice:
                                  user?.role === 'agence'
                                    ? formatNumber(Number(item?.produit?.price))
                                    : formatNumber(Number(item?.produit?.pricesales)),
                                montantbenefices: formatNumber(
                                  Number(item?.produit?.montantbenefices),
                                ),
                                total:
                                  (user?.role === 'agence'
                                    ? Number(item?.produit?.price)
                                    : Number(item?.produit?.pricesales)) +
                                  Number(item?.produit?.montantbenefices),
                              };
                            }),
                            totalHT: row.totalHTV,
                            taxRate: row.tva,
                            taxAmount:
                              user?.role === 'agence'
                                ? formatNumber(Number(row.total_general) - Number(row.totalHTV) - 1)
                                : row.tva
                                ? formatNumber(Number((row.totalHTV * row.tva) / 100))
                                : formatNumber(Number(row.totalHTV)),
                            totalTTC: formatNumber(Number(row.total_general)),
                            paymentTerms: row.modepaiement,
                          },
                          invoice: {
                            number: row?.reference,
                            date: moment(row.date).format('YYYY-MM-DD'),
                            client: { name: row?.client?.fullName, address: row?.client?.address },
                            type: 'vente',
                            items: row?.articles?.map((item: any) => {
                              return {
                                description: item?.produit?.name,
                                quantity: item?.quantite,
                                unitPrice:
                                  user?.role === 'agence'
                                    ? formatNumber(Number(item?.produit?.price))
                                    : formatNumber(Number(item?.produit?.pricesales)),
                                montantbenefices: formatNumber(
                                  Number(item?.produit?.montantbenefices),
                                ),
                                total: formatNumber(
                                  Number(item?.quantite) *
                                    ((user?.role === 'agence'
                                      ? Number(item?.produit?.price)
                                      : Number(item?.produit?.pricesales)) +
                                      Number(item?.produit?.montantbenefices)),
                                ),
                              };
                            }),
                            totalHT: formatNumber(Number(row.totalHTV)),
                            taxRate: row.tva,
                            taxAmount:
                              user?.role === 'agence'
                                ? formatNumber(Number(row.total_general) - Number(row.totalHTV) - 1)
                                : row.tva
                                ? formatNumber(Number((row.totalHTV * row.tva) / 100))
                                : formatNumber(Number(row.totalHTV)),
                            totalTTC: formatNumber(Number(row.total_general)),
                            paymentTerms: row.modepaiement,
                          },
                          deliveryNote: {
                            number: row?.reference,
                            date: moment(row.date).format('YYYY-MM-DD'),
                            client: { name: row?.client?.fullName, address: row?.client?.address },
                            items: row?.articles?.map((item: any) => {
                              return {
                                description: item?.produit?.name,
                                quantityDelivered: item?.quantite,
                                quantityOrdered: item?.quantite,
                              };
                            }),
                          },
                          quote: {
                            number: row?.reference,
                            date: moment(row.date).format('YYYY-MM-DD'),
                            client: { name: row?.client?.fullName, address: row?.client?.address },
                            items: row?.articles?.map((item: any) => {
                              return {
                                description: item?.produit?.name,
                                quantity: item?.quantite,
                                unitPrice:
                                  user?.role === 'agence'
                                    ? formatNumber(Number(item?.produit?.price))
                                    : formatNumber(Number(item?.produit?.pricesales)),
                                montantbenefices: formatNumber(
                                  Number(item?.produit?.montantbenefices),
                                ),
                                total: formatNumber(
                                  Number(item?.quantite) *
                                    ((user?.role === 'agence'
                                      ? Number(item?.produit?.price)
                                      : Number(item?.produit?.pricesales)) +
                                      Number(item?.produit?.montantbenefices)),
                                ),
                              };
                            }),
                            totalHT: formatNumber(Number(row.totalHTV)),
                            taxRate: row.tva,
                            taxAmount:
                              user?.role === 'agence'
                                ? formatNumber(Number(row.total_general) - Number(row.totalHTV) - 1)
                                : row.tva
                                ? formatNumber(Number((row.totalHTV * row.tva) / 100))
                                : formatNumber(Number(row.totalHTV)),
                            totalTTC: formatNumber(Number(row.total_general)),
                            paymentTerms: row.modepaiement,
                          },
                        });
                      }}
                    >
                      {t('attachment')}
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                    <Collapse in={openArticle} timeout="auto" unmountOnExit>
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
                          Article
                        </Typography>
                        <Table size="small" aria-label="purchases">
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                <Typography variant="h6">{t('Reference')}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="h6">{t('nom')}</Typography>
                              </TableCell>

                              <TableCell>
                                <Typography variant="h6">{t('Prix')}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="h6">{t('quantite')}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="h6">{t('montantTotal')}</Typography>
                              </TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {row.articles.map((article: any) => (
                              <TableRow key={article?._id}>
                                <TableCell>
                                  <Typography color="textSecondary" fontWeight="400">
                                    {article?.produit?._id}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography color="textSecondary" fontWeight="400">
                                    {article?.produit?.name}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography color="textSecondary" fontWeight="400">
                                    {user?.role === 'agence'
                                      ? formatNumber(Number(article?.produit?.price))
                                      : formatNumber(Number(article?.produit?.pricesales))}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography fontWeight="600">{article?.quantite}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography fontWeight="600">
                                    {formatNumber(
                                      Number(article?.quantite) *
                                        (user?.role === 'agence'
                                          ? Number(article?.produit?.price)
                                          : Number(article?.produit?.pricesales)),
                                    )}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ))}
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
      {/* dialog edit status */}
      <Dialog
        fullScreen={fullScreen}
        open={openAlertDelete}
        onClose={handleCloseModal}
        aria-labelledby="responsive-dialog-title"
      >
        <form onSubmit={formik.handleSubmit} className="w-full">
          <DialogTitle id="responsive-dialog-title">{t('titleUpdateStatus')}</DialogTitle>
          <DialogContent>
            <DialogContentText>{t('descriptionUpdateStatus')}</DialogContentText>
            <br />
            <CustomSelect
              id="status"
              name="status"
              value={formik.values.status}
              defaultValue={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.status && Boolean(formik.errors.status)}
              helperText={formik.touched.status && formik.errors.status}
              fullWidth
              variant="outlined"
            >
              <MenuItem value="paid">{t('paid')}</MenuItem>
              {etat !== 'pendingecheance' && <MenuItem value="semi-paid">{t('semipaid')}</MenuItem>}
              {etat !== 'pendingecheance' && (
                <MenuItem value="pendingecheance">{t('pendingecheance')}</MenuItem>
              )}
              <MenuItem value="not-paid">{t('not-paid')}</MenuItem>
              <MenuItem value="cancelled">{t('cancelled')}</MenuItem>
            </CustomSelect>
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
      {/* dialog attachement */}
      <Dialog
        fullScreen={fullScreen}
        open={openAttachment}
        onClose={handleCloseOpenAttachment}
        aria-labelledby="responsive-dialog-title"
        className="w-full"
        sx={{
          '& .MuiPaper-root': {
            maxWidth: '100%',
          },
        }}
      >
        <DialogTitle id="responsive-dialog-title">{t('attachment')}</DialogTitle>
        <DialogContent className="w-full">
          <DialogContentText>{t('attachementDescription')}</DialogContentText>
          <br />

          <div className="flex gap-10 w-full">
            <PDFViewer width="100%" height="500">
              <DeliveryNotePDF deliveryNote={facture?.deliveryNote} />
            </PDFViewer>
            <PDFViewer width="100%" height="500">
              <InvoicePDF invoice={facture?.invoice} />
            </PDFViewer>
            <PDFViewer width="100%" height="500">
              <QuotePDF quote={facture?.quote} />
            </PDFViewer>
          </div>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleCloseOpenAttachment}>
            {t('cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </BlankCard>
  );
};

export default TableVente;
