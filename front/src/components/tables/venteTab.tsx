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
  MenuItem
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
  interface Iclient{
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    matriculeFiscale: string;
    admin: string;}
  
    
  interface IProduit{
    _id: string;
    name: string;
    description: string;
    price: string;
    stock:number;
    admin: string;}

  interface IVente{
      _id: string,
      client: Iclient,
      articles: 
          {
              produit: IProduit,
              quantite:string ,
          }[]
      ,
      total_general: string,
      statut:string,
      date: string,
    admin: string;}
    
const TableVente = ({rows,setData,data}:{rows:IVente[],setData:any,data:IVente[] | undefined}) => {
  const {t}=useTranslation()
  const dispatch = useDispatch();
  console.log(data, dispatch)
  const [openAlertDelete, setOpenAlerteDelete] = React.useState(false);
  const [openArticle, setOpenArticle] = React.useState(false);
  const [id, setId] = React.useState<string>("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [loading, setLoading] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const validationSchema = Yup.object({
    status: Yup.string().required(t('faildRequired') || ""),
  });
  const formik = useFormik({
    initialValues: {
      status: '',
    },
    validationSchema,
    onSubmit: async(values) => {
        setLoading(true);
        try {
        await dispatch(updateStatus( {  status: values.status},id)).then((secc:any)=>setData(()=>{
          const newData=data?.map((item:IVente)=>{
               if(item?._id===id)
               { console.log({secc})
  
                return {
                  ...item,
                  statut:values.status
                }
               }else{
  
                return item
               }
          })
  
          return newData
        }));
        setLoading(false);
        handleCloseModal()
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
    setOpenAlerteDelete(false)
  };
  const handleCloseModal = () => {
    setOpenAlerteDelete(false)
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
          
        </TableCell>
              <TableCell>
                <Typography variant="h6">{t("Reference")}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Date</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t("nomClients")}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">statut</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t("montantTotal")}</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
                  ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : rows
                ).map((row) => (<>
              <TableRow key={row._id} >
            <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpenArticle(!openArticle)}>
            {openArticle ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
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
                      <Typography  variant="subtitle1" color="textSecondary">{moment(row.date).format("DD/MM/YYYY")}</Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box>
                      <Typography  variant="subtitle1" color="textSecondary">{row.client.fullName}</Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell scope="row">
                  <Typography  variant="subtitle1" color="textSecondary">
                    {row.statut==="paid" && <Chip label={t(row.statut)} color="success" size="small" />}
                    {row.statut==="pending" && <Chip label={t(row.statut)} color="warning" size="small" />}
                    {row.statut==="cancelled" && <Chip label={t(row.statut)} color="error" size="small" />}
                  { row.statut==="pending" &&  <IconButton
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                  >
                    <IconDotsVertical width={18} />
                  </IconButton>}
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    <MenuItem onClick={()=>{handleClose()
                      setOpenAlerteDelete(true)
                      setId(row?._id)
                   
                       }}>
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
                    {row.total_general}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
        <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
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
                <Typography variant="h6">{t("Reference")}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t("nom")}</Typography>
              </TableCell>
        
              <TableCell>
                <Typography variant="h6">{t("Prix")}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t("quantite")}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t("montantTotal")}</Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
                </TableHead>
                <TableBody>
                  {row.articles.map((article: any) => (
                    <TableRow key={article._id}>
                      <TableCell>
                        <Typography color="textSecondary" fontWeight="400">
                          {article.produit._id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color="textSecondary" fontWeight="400">
                          {article.produit.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color="textSecondary" fontWeight="400">
                          {article.produit.price}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight="600">
                          {article.quantite}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight="600">
                          {Number(article.quantite)*Number(article.produit.price)}
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
              </>))}
              {rows.length===0&& (
                  <TableRow >
                    <TableCell colSpan={6} className='w-full flex justify-center'>
                        <span  className='text-center m-auto'>{t("notFound")}</span>
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
        <form onSubmit={formik.handleSubmit} className='w-full'>
        <DialogTitle id="responsive-dialog-title">{t("titleUpdateStatus")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
          {t("descriptionUpdateStatus")}
          </DialogContentText>
          <br/>
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
                <MenuItem value="paid">
                  {t("paid")}
                </MenuItem>
                <MenuItem value="cancelled">
                  {t("cancelled")}
                </MenuItem>
            </CustomSelect>
         
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleCloseModal}>
            {t("cancel")}
          </Button>
          <Button type="submit"disabled={loading}  className='flex gap-10' >
              {loading && <div><SpinnerSubmit /></div> }
              <span>Submit</span></Button>

        </DialogActions>
        </form>
      </Dialog>
    </BlankCard>
  );
};

export default TableVente;
