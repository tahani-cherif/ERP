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
  Chip
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
import CustomFormLabel from '../forms/theme-elements/CustomFormLabel';
import CustomTextField from '../forms/theme-elements/CustomTextField';
import moment from 'moment';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';


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
  const [openAlertEdit, setOpenAlerteEdit] = React.useState(false);
  const [id, setId] = React.useState<string>("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [loading, setLoading] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const validationSchema = Yup.object({
    name: Yup.string().required(t('faildRequired') || ""),
    description: Yup.string().required(t('faildRequired') || ""),
    price: Yup.number()
    .typeError(t('priceMustBeNumber') || "Price must be a number") // Custom message for type errors
    .required(t('faildRequired') || "Price is required")
    .min(0, t('priceMustBePositive') || "Price must be a non-negative number")
  });
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: '',
    },
    validationSchema,
    onSubmit: async(values) => {

      console.log(values)
        setLoading(true);
        // try {
        // await dispatch(updateProduit({...values,price:Number(values.price)},id)).then((secc:any)=>setData(()=>{
        //   const newData=data?.map((item:IVente)=>{
        //        if(item?._id===id)
        //        {
  
        //         return secc
        //        }else{
  
        //         return item
        //        }
        //   })
  
        //   return newData
        // }));
        //   setLoading(false);
        //   handleCloseModalEdit()
        // } catch (error) {
        //   console.error(error);
        // }
    },
  });

  const handleCloseModal = () => {
    setOpenAlerteDelete(false)
  };
  const handleCloseModalEdit = () => {
    setLoading(false);
    setOpenAlerteEdit(false)
    setId("")
    formik.resetForm()
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
{/* dialog delete */}
        <Dialog
        fullScreen={fullScreen}
        open={openAlertDelete}
        onClose={handleCloseModal}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{t("deleteTitleProduct")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
          {t("deleteDescriptionProduit")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleCloseModal}>
            {t("cancel")}
          </Button>
          <Button onClick={async()=>{
            setLoading(true)
            //  await dispatch(deleteProduit(id));
             setData(rows.filter((row :IVente)=> row._id!==id))
             setId("")
             setLoading(false)
            handleCloseModal()
          }} disabled={loading}  className='flex gap-10' >
              {loading && <div><SpinnerSubmit /></div> }
              <span>Submit</span></Button>

        </DialogActions>
      </Dialog>
      {/* dialog edit */}
      <Dialog
        fullScreen={fullScreen}
        open={openAlertEdit}
        onClose={handleCloseModalEdit}
        aria-labelledby="responsive-dialog-title"
      >  <form onSubmit={formik.handleSubmit} className='w-96'>
      <DialogTitle id="responsive-dialog-title">{t("produit")}</DialogTitle>
      <DialogContent>
      <Box >
        <CustomFormLabel htmlFor="fullName">{t("nom")}</CustomFormLabel>
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
      <Box >
        <CustomFormLabel htmlFor="address">{t("description")}</CustomFormLabel>
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
      <Box >
        <CustomFormLabel htmlFor="matriculeFiscale">{t("price")}</CustomFormLabel>
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
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={handleCloseModal}>
          {t("cancel")}
        </Button>
        <Button type="submit" className='flex gap-10'  disabled={loading}>
        {loading && <div><SpinnerSubmit /></div> }
          <span>Submit</span></Button>
      </DialogActions>
      </form>
      </Dialog>
    </BlankCard>
  );
};

export default TableVente;
