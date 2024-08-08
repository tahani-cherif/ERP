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
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import * as Yup from 'yup';
import { useFormik, FieldArray, FormikErrors } from 'formik';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import SpinnerSubmit from '../spinnerSubmit/Spinner';
import TableVente from 'src/components/tables/venteTab';
import { fetchVentes } from 'src/store/apps/vente/venteSlice';
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
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const validationSchema = Yup.object({
    client: Yup.string().required(t('faildRequired') || ""),
    modepaiement: Yup.string().required(t('faildRequired') || ""),
    articles: Yup.array().of(
      Yup.object({
        produit: Yup.string().required(t('faildRequired') || ""),
        quantite: Yup.string()
          .typeError(t('quantiteMustBeNumber') || "quantite must be a number")
          .required(t('faildRequired') || "quantite is required")
          .min(1, t('quantiteMustBePositive') || "quantite must be a non-negative number"),
      })
    ),
    tva: Yup.string()
      .typeError(t('tvaMustBeNumber') || "tva must be a number")
      .required(t('faildRequired') || "tva is required")
      .min(0, t('tvaMustBePositive') || "tva must be a non-negative number"),
  });

  const formik = useFormik({
    initialValues: {
      client: '',
      modepaiement: '',
      tva: "",
      articles: [{ produit: '', quantite: '' }],
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        console.log(values);
        // Handle submission
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
    formik.resetForm();
    setLoading(false);
    setOpen(false);
  };
console.log(`formik.values.articles?.[0]?.produit`)
  return (
    <PageContainer title={t("vente") || ""}>
      <Breadcrumb title={t("vente") || ""} items={[
        { to: '/', title: 'Home' },
        { title: t("vente") || "" },
      ]} />
      <ParentCard title={t("vente") || ""}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div className='flex justify-end'>
              <Button className='flex gap-4 p-4' onClick={() => setOpen(true)}>
                <IconCirclePlus />
                <span>{t("addVente")}</span>
              </Button>
            </div>
            <Box className='mt-4'>
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
        <form onSubmit={formik.handleSubmit} className='w-96'>
          <DialogTitle id="responsive-dialog-title">{t("addVente")}</DialogTitle>
          <DialogContent>
            <Box>
              <CustomFormLabel htmlFor="client">{t("client")}</CustomFormLabel>
              <CustomSelect
                id="client"
                name="client"
                value={formik.values.client}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.client && Boolean(formik.errors.client)}
                helperText={formik.touched.client && formik.errors.client}
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
                value={formik.values.tva}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.tva && Boolean(formik.errors.tva)}
                helperText={formik.touched.tva && formik.errors.tva}
                fullWidth
                variant="outlined"
              >
                <MenuItem value="7">7%</MenuItem>
                <MenuItem value="13">13%</MenuItem>
                <MenuItem value="19">19%</MenuItem>
              </CustomSelect>
            </Box>

            <Box>
              <CustomFormLabel htmlFor="modepaiement">{t("modepaiement")}</CustomFormLabel>
              <CustomSelect
                id="modepaiement"
                name="modepaiement"
                value={formik.values.modepaiement}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.modepaiement && Boolean(formik.errors.modepaiement)}
                helperText={formik.touched.modepaiement && formik.errors.modepaiement}
                fullWidth
                variant="outlined"
              >
                <MenuItem value="espece">{t("espece")}</MenuItem>
                <MenuItem value="cheque">{t("cheque")}</MenuItem>
                <MenuItem value="traite">{t("traite")}</MenuItem>
                <MenuItem value="virementBancaire">{t("virementBancaire")}</MenuItem>
              </CustomSelect>
            </Box>

            <FieldArray name="articles">
  {({ push, remove }) => (
    <>
      {formik.values.articles.map((article, index) => {
        const articleError = formik.errors.articles?.[index] as
          | FormikErrors<{ produit: string; quantite: string }>
          | undefined;

        return (
          <div key={index} className='flex gap-4'>
            <Box className='w-full'>
              <CustomFormLabel htmlFor={`articles[${index}].produit`}>
                {t("produit")}
              </CustomFormLabel>
              <CustomSelect
                id={`articles[${index}].produit`}
                name={`articles[${index}].produit`}
                value={article.produit}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(articleError?.produit)}
                helperText={articleError?.produit}
                fullWidth
                variant="outlined"
              >
                {produits
                  ?.filter(
                    (produit: IProduit) =>
                      produit.type === "vente" && produit.stock > 0
                  )
                  ?.map((produit: IProduit) => (
                    <MenuItem key={produit._id} value={produit._id}>
                      {produit.name}
                    </MenuItem>
                  ))}
              </CustomSelect>
            </Box>

            <Box className='w-full'>
              <CustomFormLabel htmlFor={`articles[${index}].quantite`}>
                {t("quantite")}
              </CustomFormLabel>
              <CustomTextField
                id={`articles[${index}].quantite`}
                name={`articles[${index}].quantite`}
                variant="outlined"
                fullWidth
                value={article.quantite}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(articleError?.quantite)}
                helperText={articleError?.quantite}
              />
            </Box>

            <IconButton color="error" onClick={() => remove(index)}>
              <IconTrash />
            </IconButton>
          </div>
        );
      })}

      <Button
        className='mt-4'
        variant="outlined"
        color="primary"
        onClick={() => push({ produit: '', quantite: '' })}
      >
        {t("addArticle")}
      </Button>
    </>
  )}
</FieldArray>


          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={handleCloseModal}>
              {t("cancel")}
            </Button>
            <Button type="submit" className='flex gap-10' disabled={loading}>
              {loading && <SpinnerSubmit />}
              <span>{t("submit")}</span>
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </PageContainer>
  );
};

export default Vente;
