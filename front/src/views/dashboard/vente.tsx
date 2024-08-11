import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, MenuItem, IconButton } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import { useSelector } from 'react-redux';
import { useDispatch } from 'src/store/Store';
import { IconCirclePlus, IconTrash } from '@tabler/icons';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import * as Yup from 'yup';
import { Formik, FieldArray, FormikErrors } from 'formik';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import SpinnerSubmit from '../spinnerSubmit/Spinner';
import TableVente from 'src/components/tables/venteTab';
import { addVente, fetchVentes } from 'src/store/apps/vente/venteSlice';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';
import { fetchClients } from 'src/store/apps/client/clientSlice';
import { fetchProduits } from 'src/store/apps/produit/produitSlice';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';

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
  stock: number;
  type: string;
  admin: string;
}

interface IVente {
  _id: string;
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

const Vente = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xl'));
  const ventes = useSelector((state: any) => state.venteReducer.ventes);
  const clients = useSelector((state: any) => state.clientReducer.clients);
  const produits = useSelector((state: any) => state.produitReducer.produits);
  const [data, setData] = useState<IVente[]>();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    client: Yup.string().required(t('faildRequired') || ''),
    modepaiement: Yup.string().required(t('faildRequired') || ''),
    articles: Yup.array().of(
      Yup.object({
        produit: Yup.string().required(t('faildRequired') || ''),
        quantite: Yup.number()
          .typeError(t('quantiteMustBeNumber') || 'quantite must be a number')
          .required(t('faildRequired') || 'quantite is required')
          .min(1, t('quantiteMustBePositive') || 'quantite must be a non-negative number')
          .test(
            'less-than-stock',
            t('quantiteExceedsStock') || 'Quantité exceeds stock',
            function (value: any) {
              const { produit } = this.parent;
              const produitInfo = produits.find((p: IProduit) => p._id === produit);

              return produitInfo ? value <= produitInfo.stock : true;
            },
          ),
      }),
    ),
    tva: Yup.number()
      .typeError(t('tvaMustBeNumber') || 'tva must be a number')
      .required(t('faildRequired') || 'tva is required')
      .min(0, t('tvaMustBePositive') || 'tva must be a non-negative number'),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchClients());
        await dispatch(fetchProduits());
        await dispatch(fetchVentes());
        setOpen(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    setData(ventes);
  }, [ventes]);

  const handleCloseModal = () => {
    setLoading(false);
    setOpen(false);
  };

  return (
    <PageContainer title={t('vente') || ''}>
      <Breadcrumb
        title={t('vente') || ''}
        items={[{ to: '/', title: 'Home' }, { title: t('vente') || '' }]}
      />
      <ParentCard title={t('vente') || ''}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div className="flex justify-end">
              <Button className="flex gap-4 p-4" onClick={() => setOpen(true)}>
                <IconCirclePlus />
                <span>{t('addVente')}</span>
              </Button>
            </div>
            <Box className="mt-4">
              <TableVente rows={data || []} setData={setData} data={data} />
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
        <Formik
          initialValues={{
            client: '',
            modepaiement: '',
            tva: '',
            articles: [{ produit: '', quantite: '' }],
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            setLoading(true);
            try {
              // Validate stock quantities before submitting
              const invalidArticle = values.articles.find((article) => {
                const produitInfo = produits.find((p: IProduit) => p._id === article.produit);

                return produitInfo ? parseInt(article.quantite) > produitInfo.stock : false;
              });
              if (invalidArticle) {
                // You can set a custom error message here
                console.error(t('quantiteExceedsStock'));
                setLoading(false);

                return;
              }
              let total_generalhtva = 0;
              produits.map((p: IProduit) => {
                values.articles.map((article) => {
                  console.log(article.produit === p._id);
                  if (article.produit === p._id) {
                    total_generalhtva += Number(article.quantite) * Number(p.price);
                  }
                });
              });

              // Dispatch the action to add a client

              await dispatch(
                addVente({
                  client: values.client,
                  date: new Date(),
                  modepaiement: values.modepaiement,
                  total_general: total_generalhtva + total_generalhtva * (Number(values.tva) / 100),
                  tva: Number(values.tva),
                  totalHTV: total_generalhtva,
                  articles: values.articles,
                  admin: JSON.parse(localStorage.getItem('user') || '')._id,
                }),
              ).then((secc: any) => setData(data ? [secc, ...data] : [secc]));

              console.log(values);
              setLoading(false);
              handleCloseModal();
              resetForm();
            } catch (error) {
              console.error(error);
              setLoading(false); // Ensure loading is turned off in case of an error
            }
          }}
        >
          {({ values, handleChange, handleBlur, handleSubmit, touched, errors }) => (
            <form onSubmit={handleSubmit}>
              <DialogTitle id="responsive-dialog-title">{t('addVente')}</DialogTitle>
              <DialogContent>
                <Box>
                  <CustomFormLabel htmlFor="client">{t('client')}</CustomFormLabel>
                  <CustomSelect
                    id="client"
                    name="client"
                    value={values.client}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.client && Boolean(errors.client)}
                    helperText={touched.client && errors.client}
                    fullWidth
                    variant="outlined"
                  >
                    {clients?.map((client: Iclient) => (
                      <MenuItem key={client._id} value={client._id}>
                        {client.fullName}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </Box>

                <Box>
                  <CustomFormLabel htmlFor="tva">TVA</CustomFormLabel>
                  <CustomSelect
                    id="tva"
                    name="tva"
                    value={values.tva}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.tva && Boolean(errors.tva)}
                    helperText={touched.tva && errors.tva}
                    fullWidth
                    variant="outlined"
                  >
                    <MenuItem value="7">7%</MenuItem>
                    <MenuItem value="13">13%</MenuItem>
                    <MenuItem value="19">19%</MenuItem>
                  </CustomSelect>
                </Box>

                <Box>
                  <CustomFormLabel htmlFor="modepaiement">{t('modepaiement')}</CustomFormLabel>
                  <CustomSelect
                    id="modepaiement"
                    name="modepaiement"
                    value={values.modepaiement}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.modepaiement && Boolean(errors.modepaiement)}
                    helperText={touched.modepaiement && errors.modepaiement}
                    fullWidth
                    variant="outlined"
                  >
                    <MenuItem value="espece">{t('espece')}</MenuItem>
                    <MenuItem value="cheque">{t('cheque')}</MenuItem>
                    <MenuItem value="traite">{t('traite')}</MenuItem>
                    <MenuItem value="virementBancaire">{t('virementBancaire')}</MenuItem>
                  </CustomSelect>
                </Box>

                <FieldArray name="articles">
                  {({ push, remove }) => (
                    <div className=" flex flex-col gap-2">
                      {values.articles.map((article, index) => {
                        const articleError = errors.articles?.[index] as
                          | FormikErrors<{ produit: string; quantite: string }>
                          | undefined;
                        const selectedProduits = values.articles.map((a) => a.produit);

                        return (
                          <div key={index} className="flex gap-4 ">
                            <Box className="w-full">
                              <CustomFormLabel htmlFor={`articles[${index}].produit`}>
                                {t('produit')}
                              </CustomFormLabel>
                              <CustomSelect
                                id={`articles[${index}].produit`}
                                name={`articles[${index}].produit`}
                                value={values.articles[index]?.produit || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={Boolean(articleError?.produit)}
                                helperText={articleError?.produit}
                                fullWidth
                                variant="outlined"
                              >
                                {produits
                                  .filter((produit: IProduit) => produit?.stock > 0)
                                  .map((produit: IProduit) => (
                                    <MenuItem
                                      key={produit._id}
                                      value={produit._id}
                                      disabled={
                                        selectedProduits.includes(produit._id) &&
                                        values.articles[index]?.produit !== produit._id
                                      }
                                    >
                                      {produit.name}
                                    </MenuItem>
                                  ))}
                              </CustomSelect>
                            </Box>

                            <Box className="w-full">
                              <CustomFormLabel htmlFor={`articles[${index}].quantite`}>
                                {t('quantite')}
                              </CustomFormLabel>
                              <CustomTextField
                                id={`articles[${index}].quantite`}
                                name={`articles[${index}].quantite`}
                                value={values.articles?.[index].quantite}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={Boolean(articleError?.quantite)}
                                helperText={articleError?.quantite}
                                fullWidth
                                variant="outlined"
                              />
                            </Box>

                            <Box className="items-end mt-auto">
                              {index > 0 && (
                                <IconButton
                                  aria-label="delete"
                                  size="large"
                                  onClick={() => remove(index)}
                                >
                                  <IconTrash />
                                </IconButton>
                              )}
                            </Box>
                          </div>
                        );
                      })}
                      <Button
                        className="mt-4 items-end"
                        variant="outlined"
                        color="primary"
                        type="button"
                        onClick={() => push({ produit: '', quantite: '' })}
                        disabled={
                          values.articles.length >=
                          produits.filter((produit: IProduit) => produit?.stock > 0)?.length
                        }
                      >
                        {t('addArticle')}
                      </Button>
                    </div>
                  )}
                </FieldArray>
              </DialogContent>
              <DialogActions>
                <Button autoFocus color="error" onClick={handleCloseModal}>
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
          )}
        </Formik>
      </Dialog>
    </PageContainer>
  );
};

export default Vente;
