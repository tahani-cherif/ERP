import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Grid, IconButton, MenuItem, TextField, useMediaQuery } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import { useSelector } from 'react-redux';
import { useDispatch } from 'src/store/Store';
import { IconCirclePlus, IconPrinter, IconTrash } from '@tabler/icons';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import * as Yup from 'yup';
import { FieldArray, Formik, FormikErrors } from 'formik';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';

import SpinnerSubmit from '../spinnerSubmit/Spinner';
import TableAchat from 'src/components/tables/achatTab';
import { addAchat, fetchAchats } from 'src/store/apps/achat/achatSlice';
import { fetchProduits } from 'src/store/apps/produit/produitSlice';
import { fetchFournisseurs } from 'src/store/apps/fournisseur/fournisseurSlice';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';
import { useReactToPrint } from 'react-to-print';
import moment from 'moment';

interface Ifournisseur {
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
  pricepurchase: string;
  montantbenefices: string;
  stock: number;
  admin: string;
}
interface IAchat {
  _id: string;
  reference: string;
  fournisseur: Ifournisseur;
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
  const BCrumb = [
    {
      to: '/',
      title: 'Home',
    },
    {
      title: t('achat') || '',
    },
  ];
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xl'));
  const achats = useSelector((state: any) => state.achatReducer.achats); // Adjust according to your state structure
  const produits = useSelector((state: any) => state.produitReducer.produits);
  const fournisseurs = useSelector((state: any) => state.fournisseurReducer.fournisseurs); // Adjust according to your state structure
  const [data, setData] = useState<IAchat[]>();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [filterNumero, setFilterNumero] = React.useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<IAchat[]>();
  const [filterEcheance, setFilterEcheance] = React.useState<string | null>(null);
  const [filterFournisseur, setFilterFournisseur] = React.useState<string | null>(null);
  const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user') || '');
  const printableRef = useRef(null);
  const validationSchema =
    user?.role === 'agence'
      ? Yup.object({
          reference: Yup.string().required(t('faildRequired') || ''),
          fournisseur: Yup.string().optional(),
          modepaiement: Yup.string().required(t('faildRequired') || ''),
          articles: Yup.array().of(
            Yup.object({
              produit: Yup.string().required(t('faildRequired') || ''),
              quantite: Yup.number()
                .typeError(t('quantiteMustBeNumber') || 'quantite must be a number')
                .required(t('faildRequired') || 'quantite is required')
                .min(1, t('quantiteMustBePositive') || 'quantite must be a non-negative number'),
            }),
          ),
          tva: Yup.number()
            .typeError(t('tvaMustBeNumber') || 'tva must be a number')
            .optional()
            .min(0, t('tvaMustBePositive') || 'tva must be a non-negative number'),
        })
      : Yup.object({
          reference: Yup.string().required(t('faildRequired') || ''),
          fournisseur: Yup.string().optional(),
          modepaiement: Yup.string().required(t('faildRequired') || ''),
          articles: Yup.array().of(
            Yup.object({
              produit: Yup.string().required(t('faildRequired') || ''),
              quantite: Yup.number()
                .typeError(t('quantiteMustBeNumber') || 'quantite must be a number')
                .required(t('faildRequired') || 'quantite is required')
                .min(1, t('quantiteMustBePositive') || 'quantite must be a non-negative number'),
              pricepurchase: Yup.number()
                .typeError(t('priceMustBeNumber') || 'Price must be a number')
                .required(t('faildRequired') || 'Price is required')
                .min(0, t('priceMustBePositive') || 'Price must be a non-negative number'),
            }),
          ),
          tva: Yup.number()
            .typeError(t('tvaMustBeNumber') || 'tva must be a number')
            .optional()
            .min(0, t('tvaMustBePositive') || 'tva must be a non-negative number'),
        });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchProduits());
        await dispatch(fetchFournisseurs());
        await dispatch(fetchAchats());
        setOpen(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [dispatch]);
  useEffect(() => {
    setData(achats);
  }, [achats]);
  const handleCloseModal = () => {
    setLoading(false);
    setOpen(false);
  };
  const handlePrint = useReactToPrint({
    content: () => printableRef.current,
  });
  useEffect(() => {
    if (data) {
      const filtered = data.filter((item: any) => {
        return (
          (!filterEcheance ||
            moment(item.date).format('DD-MM-YYYY') ===
              moment(filterEcheance).format('DD-MM-YYYY')) &&
          (!filterNumero || item?._id?.includes(filterNumero)) &&
          (!filterFournisseur || item?.fournisseur?.fullName?.includes(filterFournisseur))
        );
      });
      setFilteredData(filtered);
    }
  }, [data, filterEcheance, filterFournisseur, filterNumero]);

  return (
    <PageContainer title={t('achat') || ''}>
      {/* breadcrumb */}
      <Breadcrumb title={t('achat') || ''} items={BCrumb} />
      {/* end breadcrumb */}
      <ParentCard title={t('achat') || ''}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div className="flex justify-end gap-4">
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
                <span>{t('addAchat')}</span>
              </Button>
            </div>
            <br />
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <CustomTextField
                id="echeance"
                name="echeance"
                variant="outlined"
                fullWidth
                value={filterEcheance || ''}
                type="date"
                onChange={(e: any) => setFilterEcheance(e.target.value)}
                error={false}
                helperText=""
              />

              <TextField
                label={'N°'}
                value={filterNumero}
                onChange={(e) => setFilterNumero(e.target.value)}
                variant="outlined"
                fullWidth
              />
              <TextField
                label={t('nomFournisseur')}
                value={filterFournisseur}
                onChange={(e) => setFilterFournisseur(e.target.value)}
                variant="outlined"
                fullWidth
              />
            </Box>
            <Box className="mt-4" ref={printableRef}>
              <TableAchat rows={filteredData || []} setData={setData} data={data} />
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
            reference: '',
            fournisseur: '',
            modepaiement: '',
            tva: '',
            articles: [{ produit: '', quantite: '', pricepurchase: '' }],
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            setLoading(true);
            try {
              let total_generalhtva = 0;
              produits.map((p: IProduit) => {
                values.articles.map((article) => {
                  if (article.produit === p._id) {
                    total_generalhtva +=
                      Number(article.quantite) *
                      (user?.role === 'agence' ? Number(p.price) : Number(article.pricepurchase));
                  }
                });
              });
              await dispatch(
                addAchat({
                  fournisseur: values.fournisseur ? values.fournisseur : null,
                  date: new Date(),
                  modepaiement: values.modepaiement,
                  reference: values.reference,
                  total_general:
                    total_generalhtva +
                    1 +
                    (values.tva ? total_generalhtva * (Number(values.tva) / 100) : 0),
                  tva: Number(values.tva),
                  totalHTV: total_generalhtva,
                  articles: values.articles,
                  admin: JSON.parse(localStorage.getItem('user') || '')._id,
                }),
              ).then(async (secc: any) => {
                await dispatch(fetchAchats());
              });

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
              <DialogTitle id="responsive-dialog-title">{t('addAchat')}</DialogTitle>
              <DialogContent>
                <Box>
                  <CustomFormLabel htmlFor="reference">{t('facture')} N°</CustomFormLabel>
                  <CustomTextField
                    id="reference"
                    name="reference"
                    variant="outlined"
                    fullWidth
                    value={values.reference}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.reference && Boolean(errors.reference)}
                    helperText={touched.reference && errors.reference}
                  />
                </Box>
                <Box>
                  <CustomFormLabel htmlFor="fournisseur">{t('fournisseur')}</CustomFormLabel>
                  <CustomSelect
                    id="fournisseur"
                    name="fournisseur"
                    value={values.fournisseur}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.fournisseur && Boolean(errors.fournisseur)}
                    helperText={touched.fournisseur && errors.fournisseur}
                    fullWidth
                    variant="outlined"
                  >
                    {fournisseurs?.map((fournisseur: Ifournisseur) => (
                      <MenuItem key={fournisseur._id} value={fournisseur._id}>
                        {fournisseur.fullName}
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
                          | FormikErrors<{
                              produit: string;
                              quantite: string;
                              pricepurchase: string;
                            }>
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
                                {produits.map((produit: IProduit) => (
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
                            {user?.role !== 'agence' && (
                              <Box className="w-full">
                                <CustomFormLabel htmlFor={`articles[${index}].pricepurchase`}>
                                  {t('pricepurchase')}
                                </CustomFormLabel>
                                <CustomTextField
                                  id={`articles[${index}].pricepurchase`}
                                  name={`articles[${index}].pricepurchase`}
                                  value={values.articles?.[index].pricepurchase}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={Boolean(articleError?.pricepurchase)}
                                  helperText={articleError?.pricepurchase}
                                  fullWidth
                                  variant="outlined"
                                />
                              </Box>
                            )}

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
                        onClick={() => {
                          user?.role !== 'agence'
                            ? push({ produit: '', quantite: '', pricepurchase: '' })
                            : push({ produit: '', quantite: '' });
                        }}
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
