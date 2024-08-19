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
import { addFournisseur, fetchFournisseurs } from 'src/store/apps/fournisseur/fournisseurSlice';
import TableBanque from 'src/components/tables/banqueTab';

interface IBanque{
  _id: string;
  banque: string;
  rib: string;
  iban: string;
  swift: string;
  admin: string;}

  const phonetunis=/^[+0]{0,2}(91)?[0-9]{8}$/;
  const Fournisseur = () => {
  const {t}=useTranslation()
  const dispatch = useDispatch();
  const BCrumb = [
    {
      to: '/',
      title: 'Home',
    },
    {
      title: t("banque") || "",
    },
  ];
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xl'));
  const fournisseurs = useSelector((state: any) => state.fournisseurReducer.fournisseurs); // Adjust according to your state structure
  const [data,setData]=useState<IBanque[]>()
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const validationSchema = Yup.object({
    fullName: Yup.string().required(t('faildRequired') || ""),
    address: Yup.string().required(t('faildRequired') || ""),
    email: Yup.string().email(t('invalidEmail') || "").required(t('faildRequired') || ""),
    matriculeFiscale: Yup.string().required(t('faildRequired') || ""),
    phone: Yup.string().required(t('faildRequired') || "").matches(phonetunis, t("phoneerrors") || "")  ,
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
    onSubmit: async(values) => {
      setLoading(true);
      try {
      await dispatch(addFournisseur(values)).then((secc:any)=>setData(data ? [secc,...data ]:[secc]));
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
        await dispatch(fetchFournisseurs());
        setOpen(false)
      } catch (error) {
        console.error(error);
        }
        };

        fetchData();
    }, [dispatch])
    useEffect(() => {
    setData(fournisseurs);
    }, [fournisseurs]);
    const handleCloseModal = () => {
        formik.resetForm()
    setOpen(false)
    };

  return (
  <PageContainer title={t("banque") || ""} >
    {/* breadcrumb */}
    <Breadcrumb title={t("banque") || ""} items={BCrumb} />
    {/* end breadcrumb */}
    <ParentCard title={t("banque") || ""}>
      <Grid container spacing={3}>
        <Grid item xs={12} >
          <div className='flex justify-end'>
        <Button  className='flex gap-4 p-4' onClick={()=>setOpen(true)}>
          <IconCirclePlus />
          <span>{t("addBanque")}</span>
          </Button>
          </div>
          <Box className='mt-4'>
            <TableBanque  rows={data || []} setData={setData} data={data}/>
          </Box>
        </Grid>
      </Grid>
    </ParentCard>
    <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="responsive-dialog-title"
      > <form onSubmit={formik.handleSubmit} className='w-full'>
        <DialogTitle id="responsive-dialog-title">{t("addFournisseur")}</DialogTitle>
        <DialogContent>
           <div className='flex gap-4'>
        <Box >
          <CustomFormLabel htmlFor="fullName">{t("fullName")}</CustomFormLabel>
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
        <Box >
          <CustomFormLabel htmlFor="email">{t("email")}</CustomFormLabel>
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
           <div className='flex gap-4'>
        <Box >
          <CustomFormLabel htmlFor="address">{t("address")}</CustomFormLabel>
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
        <Box >
          <CustomFormLabel htmlFor="phone">{t("phone")}</CustomFormLabel>
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
        <Box >
          <CustomFormLabel htmlFor="matriculeFiscale">{t("matriculeFiscale")}</CustomFormLabel>
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

export default Fournisseur;