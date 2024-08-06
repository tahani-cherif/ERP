import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, FormControlLabel, Grid, MenuItem, RadioGroup, useMediaQuery } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import { useSelector } from 'react-redux';
import { useDispatch } from 'src/store/Store';
import { IconCirclePlus, IconPrinter } from '@tabler/icons';
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
import TableProduit from 'src/components/tables/produitTab';
import { addProduit, fetchProduits } from 'src/store/apps/produit/produitSlice';
import CustomRadio from 'src/components/forms/theme-elements/CustomRadio';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';
import { useReactToPrint } from 'react-to-print';

interface IProduit{
  _id: string;
  name: string;
  description: string;
  price: string;
  stock:number;
  admin: string;
  type: string;
  historique?:{
    type: string
    date:Date,
    quantite: number
  }[]}
  const Produit = () => {
  const {t}=useTranslation()
  const dispatch = useDispatch();
  const BCrumb = [
    {
      to: '/',
      title: 'Home',
    },
    {
      title: t("produit") || "",
    },
  ];
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xl'));
  const produits = useSelector((state: any) => state.produitReducer.produits); // Adjust according to your state structure
  const [data,setData]=useState<IProduit[]>()
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [etat, setEtat] = React.useState("vente");
  const printableRef = useRef(null);
  const validationSchema = Yup.object({
    name: Yup.string().required(t('faildRequired') || ""),
    description: Yup.string().required(t('faildRequired') || ""),
    price: Yup.string()
    .typeError(t('priceMustBeNumber') || "Price must be a number") // Custom message for type errors
    .required(t('faildRequired') || "Price is required")
    .min(0, t('priceMustBePositive') || "Price must be a non-negative number"),
    type: Yup.string().required(t('faildRequired') || ""),
  });
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: "",
      type:""
    },
    validationSchema,
    onSubmit: async(values) => {
      setLoading(true);
      try {
      await dispatch(addProduit({...values,price:Number(values.price)})).then((secc:any)=>setData(data ? [secc,...data ]:[secc]));
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
        await dispatch(fetchProduits());
        setOpen(false)
      } catch (error) {
        console.error(error);
        }
        };

        fetchData();
    }, [dispatch])
    useEffect(() => {
    setData(produits);
    }, [produits]);
    const handleCloseModal = () => {
        formik.resetForm()
        setLoading(false);
    setOpen(false)
    };
    const handleChange = (event:any) => {
      setEtat(event.target.value);
    };
    const handlePrint = useReactToPrint({
      content: () => printableRef.current,
    });

  return (
  <PageContainer title={t("produit") || ""} >
    {/* breadcrumb */}
    <Breadcrumb title={t("produit") || ""} items={BCrumb} />
    {/* end breadcrumb */}
    <ParentCard title={t("produit") || ""}>
      <Grid container spacing={3}>
        <Grid item xs={12} >
          <div className='flex justify-between'>
          <RadioGroup row aria-label="position" name="position" defaultValue={etat} value={etat}   onChange={handleChange}>
                <FormControlLabel
                  value="vente"
                  control={<CustomRadio />}
                  label= {t("stockProduction")}
                  labelPlacement="start"
                />
                <FormControlLabel
                  value="achat"
                  control={<CustomRadio />}
                  label= {t("stockAchat")}
                  labelPlacement="start"
                />
              </RadioGroup>
              <div className='flex flex-row gap-4'>
        <Button  className='flex gap-4 p-4' color="primary"
          variant="contained" onClick={()=>handlePrint()} >
          <IconPrinter />
          <span>{t("imprimer")}</span>
          </Button>
        <Button  className='flex gap-4 p-4' onClick={()=>setOpen(true)}>
          <IconCirclePlus />
          <span>{t("addProduit")}</span>
          </Button>
          </div>
          </div>
          <Box className='mt-4' ref={printableRef}>
            <TableProduit  rows={data?.filter((item:IProduit)=>item?.type===etat) || []} setData={setData} data={data}/>
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
        <DialogTitle id="responsive-dialog-title">{t("addProduit")}</DialogTitle>
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
        <Box >
          <CustomFormLabel htmlFor="typeProduit">{t("typeProduit")}</CustomFormLabel>
          <CustomSelect
              id="type"
               name="type"
              value={formik.values.type}
              defaultValue={formik.values.type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.type && Boolean(formik.errors.type)}
              helperText={formik.touched.type && formik.errors.type}
              fullWidth
              variant="outlined"
            >
                <MenuItem value="vente">
                  {t("stockProduction")}
                </MenuItem>
                <MenuItem value="achat">
                  {t("stockAchat")}
                </MenuItem>
            </CustomSelect>
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

export default Produit;