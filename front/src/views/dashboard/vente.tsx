import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, useMediaQuery } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import { useSelector } from 'react-redux';
import { useDispatch } from 'src/store/Store';
import { IconCirclePlus } from '@tabler/icons';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';

import SpinnerSubmit from '../spinnerSubmit/Spinner';
import TableVente from 'src/components/tables/venteTab';
import { fetchVentes } from 'src/store/apps/vente/venteSlice';

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

  const Vente = () => {
  const {t}=useTranslation()
  const dispatch = useDispatch();
  const BCrumb = [
    {
      to: '/',
      title: 'Home',
    },
    {
      title: t("vente") || "",
    },
  ];
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xl'));
  const ventes = useSelector((state: any) => state.venteReducer.ventes); // Adjust according to your state structure
  const [data,setData]=useState<IVente[]>()
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const validationSchema = Yup.object({
    name: Yup.string().required(t('faildRequired') || ""),
    description: Yup.string().required(t('faildRequired') || ""),
    price: Yup.string()
    .typeError(t('priceMustBeNumber') || "Price must be a number") // Custom message for type errors
    .required(t('faildRequired') || "Price is required")
    .min(0, t('priceMustBePositive') || "Price must be a non-negative number")
  });
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: "",
    },
    validationSchema,
    onSubmit: async(values) => {
      setLoading(true);
      try {
        console.log(values)
      // await dispatch(addProduit({...values,price:Number(values.price)})).then((secc:any)=>setData(data ? [secc,...data ]:[secc]));
        setLoading(false);
     
        handleCloseModal()
      } catch (error) {
        console.error(error);
      }
    },
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchVentes());
        setOpen(false)
      } catch (error) {
        console.error(error);
        }
        };

        fetchData();
    }, [dispatch])
    useEffect(() => {
    setData(ventes);
    }, [ventes]);
    const handleCloseModal = () => {
        formik.resetForm()
        setLoading(false);
    setOpen(false)
    };

  return (
  <PageContainer title={t("vente") || ""} >
    {/* breadcrumb */}
    <Breadcrumb title={t("vente") || ""} items={BCrumb} />
    {/* end breadcrumb */}
    <ParentCard title={t("vente") || ""}>
      <Grid container spacing={3}>
        <Grid item xs={12} >
          <div className='flex justify-end'>
        <Button  className='flex gap-4 p-4' onClick={()=>setOpen(true)}>
          <IconCirclePlus />
          <span>{t("addVente")}</span>
          </Button>
          </div>
          <Box className='mt-4'>
            <TableVente  rows={data || []} setData={setData} data={data}/>
          </Box>
        </Grid>
      </Grid>
    </ParentCard>
    <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="responsive-dialog-title"
      > <form onSubmit={formik.handleSubmit} className='w-96'>
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
  </PageContainer>
)};

export default Vente;