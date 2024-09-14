import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Grid, TextField, useMediaQuery } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import { useSelector } from 'react-redux';
import { useDispatch } from 'src/store/Store';
import { IconCirclePlus, IconPrinter } from '@tabler/icons';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';

import SpinnerSubmit from '../spinnerSubmit/Spinner';
import TableProduit from 'src/components/tables/produitTab';
import { addProduit, fetchProduits } from 'src/store/apps/produit/produitSlice';
import { useReactToPrint } from 'react-to-print';

interface IProduit {
  _id: string;
  reference: string;
  name: string;
  description: string;
  pricepurchase: string;
  pricesales: string;
  price: string;
  montantbenefices: string;
  stock: number;
  admin: string;
  type: string;
  historique?: {
    type: string;
    date: Date;
    quantite: number;
  }[];
}
const Produit = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const BCrumb = [
    {
      to: '/',
      title: 'Home',
    },
    {
      title: t('produit') || '',
    },
  ];
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xl'));
  const produits = useSelector((state: any) => state.produitReducer.produits); // Adjust according to your state structure
  const [data, setData] = useState<IProduit[]>();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // const [etat, setEtat] = React.useState('vente');
  const [filteredData, setFilteredData] = useState<IProduit[]>();
  const [filterName, setFilterName] = React.useState<string | null>(null);
  const printableRef = useRef(null);
  const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user') || '');
  const validationSchema =
    user?.role === 'agence'
      ? Yup.object({
          reference: Yup.string().required(t('faildRequired') || ''),
          name: Yup.string().required(t('faildRequired') || ''),
          description: Yup.string().optional(),
          price: Yup.string()
            .typeError(t('priceMustBeNumber') || 'Price must be a number') // Custom message for type errors
            .required(t('faildRequired') || 'Price is required')
            .min(0, t('priceMustBePositive') || 'Price must be a non-negative number'),
          montantbenefices: Yup.string()
            .typeError(t('priceMustBeNumber') || 'Price must be a number') // Custom message for type errors
            .required(t('faildRequired') || 'Price is required')
            .min(0, t('priceMustBePositive') || 'Price must be a non-negative number'),

          // type: Yup.string().required(t('faildRequired') || ''),
        })
      : Yup.object({
          reference: Yup.string().required(t('faildRequired') || ''),
          name: Yup.string().required(t('faildRequired') || ''),
          description: Yup.string().optional(),
          pricepurchase: Yup.number()
            .typeError(t('priceMustBeNumber') || 'Price must be a number') // Custom message for type errors
            .required(t('faildRequired') || 'Price is required')
            .min(0, t('priceMustBePositive') || 'Price must be a non-negative number'),
          pricesales: Yup.number()
            .typeError(t('priceMustBeNumber') || 'Price must be a number') // Custom message for type errors
            .required(t('faildRequired') || 'Price is required')
            .min(0, t('priceMustBePositive') || 'Price must be a non-negative number'),
          stock: Yup.number()
            .typeError(t('mustnumber') || 'must be a number')
            .required(t('faildRequired') || 'Price is required')
            .min(0, t('mustnonnegative') || ' must be a non-negative number'),

          // type: Yup.string().required(t('faildRequired') || ''),
        });
  const formik = useFormik({
    initialValues: {
      reference: '',
      name: '',
      description: '',
      pricesales: '',
      pricepurchase: '',
      price: '',
      stock: '',
      montantbenefices: '',

      // type: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await dispatch(
          addProduit({
            ...values,
            montantbenefices: user?.role === 'agence' ? Number(values.montantbenefices) : 0,
            price: user?.role === 'agence' ? Number(values.price) : 0,
            pricesales: Number(values.pricesales),
            pricepurchase: Number(values.pricepurchase),
            stock: Number(values.stock),
          }),
        ).then((secc: any) => setData(data ? [secc, ...data] : [secc]));
        setLoading(false);

        handleCloseModal();
      } catch (error) {
        console.error(error);
      }
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchProduits());
        setOpen(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [dispatch]);
  useEffect(() => {
    setData(produits);
  }, [produits]);
  const handleCloseModal = () => {
    formik.resetForm();
    setLoading(false);
    setOpen(false);
  };

  // const handleChange = (event: any) => {
  //   setEtat(event.target.value);
  // };
  const handlePrint = useReactToPrint({
    content: () => printableRef.current,
  });
  useEffect(() => {
    if (data) {
      const filtered = data.filter((item: IProduit) => {
        return !filterName || item?.name?.includes(filterName);

        //  && (!etat || item?.type === etat);
      });
      setFilteredData(filtered);
    }
  }, [data, filterName]);

  return (
    <PageContainer title={t('produit') || ''}>
      {/* breadcrumb */}
      <Breadcrumb title={t('produit') || ''} items={BCrumb} />
      {/* end breadcrumb */}
      <ParentCard title={t('produit') || ''}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div className="flex justify-end">
              {/* <RadioGroup
                row
                aria-label="position"
                name="position"
                defaultValue={etat}
                value={etat}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="vente"
                  control={<CustomRadio />}
                  label={t('stockProduction')}
                  labelPlacement="start"
                />
                <FormControlLabel
                  value="achat"
                  control={<CustomRadio />}
                  label={t('stockAchat')}
                  labelPlacement="start"
                />
              </RadioGroup> */}
              <div className="flex flex-row gap-4">
                <Button
                  className="flex gap-4 p-4"
                  color="primary"
                  variant="contained"
                  onClick={() => handlePrint()}
                >
                  <IconPrinter />
                  <span>{t('imprimer')}</span>
                </Button>
                <Button className="flex gap-4 p-4" onClick={() => setOpen(true)}>
                  <IconCirclePlus />
                  <span>{t('addProduit')}</span>
                </Button>
              </div>
            </div>
            <br />
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label={t('nom')}
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                variant="outlined"
                fullWidth
              />
            </Box>
            <Box className="mt-4" ref={printableRef}>
              <TableProduit rows={filteredData || []} setData={setData} data={data} />
            </Box>
          </Grid>
        </Grid>
      </ParentCard>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="responsive-dialog-title"
      >
        {' '}
        <form onSubmit={formik.handleSubmit} className="w-96">
          <DialogTitle id="responsive-dialog-title">{t('addProduit')}</DialogTitle>
          <DialogContent>
            <Box>
              <CustomFormLabel htmlFor="reference">{t('reference')}</CustomFormLabel>
              <CustomTextField
                id="reference"
                name="reference"
                variant="outlined"
                fullWidth
                value={formik.values.reference}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.reference && Boolean(formik.errors.reference)}
                helperText={formik.touched.reference && formik.errors.reference}
              />
            </Box>
            <Box>
              <CustomFormLabel htmlFor="name">{t('nom')}</CustomFormLabel>
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
            <Box>
              <CustomFormLabel htmlFor="description">{t('description')}</CustomFormLabel>
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
            <Box>
              <CustomFormLabel htmlFor="stock">{t('stock')}</CustomFormLabel>
              <CustomTextField
                id="stock"
                name="stock"
                variant="outlined"
                fullWidth
                value={formik.values.stock}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.stock && Boolean(formik.errors.stock)}
                helperText={formik.touched.stock && formik.errors.stock}
              />
            </Box>
            {user?.role === 'agence' ? (
              <>
                <Box>
                  <CustomFormLabel htmlFor="price">{t('price')}</CustomFormLabel>
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
                <Box>
                  <CustomFormLabel htmlFor="montantbenefices">
                    {t('montantbenefices')}
                  </CustomFormLabel>
                  <CustomTextField
                    id="montantbenefices"
                    name="montantbenefices"
                    variant="outlined"
                    fullWidth
                    value={formik.values.montantbenefices}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.montantbenefices && Boolean(formik.errors.montantbenefices)
                    }
                    helperText={formik.touched.montantbenefices && formik.errors.montantbenefices}
                  />
                </Box>
              </>
            ) : (
              <>
                <Box>
                  <CustomFormLabel htmlFor="pricepurchase">{t('pricepurchase')}</CustomFormLabel>
                  <CustomTextField
                    id="pricepurchase"
                    name="pricepurchase"
                    variant="outlined"
                    fullWidth
                    value={formik.values.pricepurchase}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.pricepurchase && Boolean(formik.errors.pricepurchase)}
                    helperText={formik.touched.pricepurchase && formik.errors.pricepurchase}
                  />
                </Box>
                <Box>
                  <CustomFormLabel htmlFor="pricesales">{t('pricesales')}</CustomFormLabel>
                  <CustomTextField
                    id="pricesales"
                    name="pricesales"
                    variant="outlined"
                    fullWidth
                    value={formik.values.pricesales}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.pricesales && Boolean(formik.errors.pricesales)}
                    helperText={formik.touched.pricesales && formik.errors.pricesales}
                  />
                </Box>
              </>
            )}

            {/* <Box>
              <CustomFormLabel htmlFor="typeProduit">{t('typeProduit')}</CustomFormLabel>
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
                <MenuItem value="vente">{t('stockProduction')}</MenuItem>
                <MenuItem value="achat">{t('stockAchat')}</MenuItem>
              </CustomSelect>
            </Box> */}
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={handleCloseModal}>
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
    </PageContainer>
  );
};

export default Produit;
