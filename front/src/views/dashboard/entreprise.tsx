import React from 'react';
import { Box, Button, Grid } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import SpinnerSubmit from '../spinnerSubmit/Spinner';
import api from 'src/utils/axios';

const Entreprise = () => {
  const { t } = useTranslation();
  const BCrumb = [
    {
      to: '/',
      title: 'Home',
    },
    {
      title: t('entreprise') || '',
    },
  ];
  const [loading, setLoading] = React.useState(false);
  const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user') || '');
  const validationSchema = Yup.object({
    nomEntreprise: Yup.string().required(t('faildRequired') || ''),
    addressEntreprise: Yup.string().required(t('faildRequired') || ''),
    phoneEntreprise: Yup.string().required(t('faildRequired') || ''),
    matriculefiscaleEntreprise: Yup.string().required(t('faildRequired') || ''),
  });
  const formik = useFormik({
    initialValues: {
      nomEntreprise: user?.nomEntreprise || '',
      addressEntreprise: user?.addressEntreprise || '',
      phoneEntreprise: user?.phoneEntreprise || '',
      matriculefiscaleEntreprise: user?.matriculefiscaleEntreprise || '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const userupdate = await api.put('/users/' + user?._id, values);
        localStorage.setItem('user', JSON.stringify(userupdate?.data));
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <PageContainer title={t('entreprise') || ''}>
      {/* breadcrumb */}
      <Breadcrumb title={t('entreprise') || ''} items={BCrumb} />
      {/* end breadcrumb */}
      <ParentCard title={t('entreprise') || ''}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <form onSubmit={formik.handleSubmit} className="w-full flex flex-col gap-4">
              <Box>
                <CustomFormLabel htmlFor="nomEntreprise">{t('nomEntreprise')}</CustomFormLabel>
                <CustomTextField
                  id="nomEntreprise"
                  name="nomEntreprise"
                  variant="outlined"
                  fullWidth
                  value={formik.values.nomEntreprise}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.nomEntreprise && Boolean(formik.errors.nomEntreprise)}
                  helperText={formik.touched.nomEntreprise && formik.errors.nomEntreprise}
                />
              </Box>
              <Box>
                <CustomFormLabel htmlFor="addressEntreprise">
                  {t('addressEntreprise')}
                </CustomFormLabel>
                <CustomTextField
                  id="addressEntreprise"
                  name="addressEntreprise"
                  variant="outlined"
                  fullWidth
                  value={formik.values.addressEntreprise}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.addressEntreprise && Boolean(formik.errors.addressEntreprise)
                  }
                  helperText={formik.touched.addressEntreprise && formik.errors.addressEntreprise}
                />
              </Box>
              <Box>
                <CustomFormLabel htmlFor="phoneEntreprise">{t('phoneEntreprise')}</CustomFormLabel>
                <CustomTextField
                  id="phoneEntreprise"
                  name="phoneEntreprise"
                  variant="outlined"
                  fullWidth
                  value={formik.values.phoneEntreprise}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phoneEntreprise && Boolean(formik.errors.phoneEntreprise)}
                  helperText={formik.touched.phoneEntreprise && formik.errors.phoneEntreprise}
                />
              </Box>
              <Box>
                <CustomFormLabel htmlFor="matriculefiscaleEntreprise">
                  {t('matriculefiscaleEntreprise')}
                </CustomFormLabel>
                <CustomTextField
                  id="matriculefiscaleEntreprise"
                  name="matriculefiscaleEntreprise"
                  variant="outlined"
                  fullWidth
                  value={formik.values.matriculefiscaleEntreprise}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.matriculefiscaleEntreprise &&
                    Boolean(formik.errors.matriculefiscaleEntreprise)
                  }
                  helperText={
                    formik.touched.matriculefiscaleEntreprise &&
                    formik.errors.matriculefiscaleEntreprise
                  }
                />
              </Box>
              <div className="flex gap-4 ml-auto">
                <Button color="error">{t('cancel')}</Button>
                <Button type="submit" className="flex gap-10" disabled={loading}>
                  {loading && (
                    <div>
                      <SpinnerSubmit />
                    </div>
                  )}
                  <span>Submit</span>
                </Button>
              </div>
            </form>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
};

export default Entreprise;
