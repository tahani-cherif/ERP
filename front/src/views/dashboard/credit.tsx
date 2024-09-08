import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Grid, MenuItem, TextField, useMediaQuery } from '@mui/material';
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
import { Formik } from 'formik';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';

import SpinnerSubmit from '../spinnerSubmit/Spinner';
import TableCredits from 'src/components/tables/creditTab';
import { addCredit, fetchCredits } from 'src/store/apps/credit/creditSlice';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';
import { fetchBanques } from 'src/store/apps/banque/banqueSlice';
import { useReactToPrint } from 'react-to-print';

interface IBanque {
  _id: string;
  banque: string;
  rib: string;
  iban: string;
  swift: string;
  admin: string;
}
interface ICredit {
  _id: string;
  banque: IBanque;
  type: string;
  echeance: string;
  principal: number;
  interet: number;
  total: number;
  montantemprunt: number;
  encours: number;
  etat: string;
  admin: string;
}

const Credit = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const BCrumb = [
    {
      to: '/',
      title: 'Home',
    },
    {
      title: t('credit') || '',
    },
  ];
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xl'));
  const credits = useSelector((state: any) => state.creditReducer.credits); // Adjust according to your state structure
  const banques = useSelector((state: any) => state.banqueReducer.banques); // Adjust according to your state structure
  const [data, setData] = useState<ICredit[]>();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const printableRef = useRef(null);
  const [filterNumero, setFilterNumero] = React.useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<ICredit[]>();
  const [filterBanque, setFilterBanque] = React.useState<string | null>(null);
  const validationSchema = Yup.object({
    banque: Yup.string().required(t('faildRequired') || ''),
    montantemprunt: Yup.number()
      .typeError(t('mustnumber') || 'must be a number')
      .required(t('faildRequired') || '')
      .min(0, t('mustnonnegative') || ' must be a non-negative number'),
    type: Yup.string().required(t('faildRequired') || ''),
    echeance: Yup.string().required(t('faildRequired') || ''),
    principal: Yup.number()
      .typeError(t('mustnumber') || 'must be a number')
      .required(t('faildRequired') || '')
      .min(0, t('mustnonnegative') || ' must be a non-negative number'),
    interet: Yup.number()
      .typeError(t('mustnumber') || 'must be a number')
      .required(t('faildRequired') || '')
      .min(0, t('mustnonnegative') || ' must be a non-negative number'),
    total: Yup.number()
      .typeError(t('mustnumber') || 'must be a number')
      .required(t('faildRequired') || '')
      .min(0, t('mustnonnegative') || ' must be a non-negative number'),
    encours: Yup.number()
      .typeError(t('mustnumber') || 'must be a number')
      .required(t('faildRequired') || '')
      .min(0, t('mustnonnegative') || ' must be a non-negative number'),
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchCredits());
        await dispatch(fetchBanques());
        setOpen(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [dispatch]);
  useEffect(() => {
    setData(credits);
  }, [credits]);
  const handleCloseModal = () => {
    setOpen(false);
  };
  const handlePrint = useReactToPrint({
    content: () => printableRef.current,
  });
  useEffect(() => {
    if (data) {
      const filtered = data.filter((item: any) => {
        return (
          (!filterBanque || item?.banque?.banque?.includes(filterBanque)) &&
          (!filterNumero || item?._id?.includes(filterNumero))
        );
      });
      setFilteredData(filtered);
    }
  }, [data, filterNumero, filterBanque]);

  return (
    <PageContainer title={t('credit') || ''}>
      {/* breadcrumb */}
      <Breadcrumb title={t('credit') || ''} items={BCrumb} />
      {/* end breadcrumb */}
      <ParentCard title={t('credit') || ''}>
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
                <span>{t('addCredit')}</span>
              </Button>
            </div>
            <br />
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label={'N°'}
                value={filterNumero}
                onChange={(e) => setFilterNumero(e.target.value)}
                variant="outlined"
                fullWidth
              />
              <TextField
                label={t('banque')}
                value={filterBanque}
                onChange={(e) => setFilterBanque(e.target.value)}
                variant="outlined"
                fullWidth
              />
            </Box>
            <Box className="mt-4" ref={printableRef}>
              <TableCredits
                rows={filteredData || []}
                setData={setData}
                data={data}
                banques={banques}
              />
            </Box>
          </Grid>
        </Grid>
      </ParentCard>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="responsive-dialog-title"
        className="w-full"
        sx={{
          '& .MuiPaper-root': {
            maxWidth: '100%',
          },
        }}
      >
        <Formik
          initialValues={{
            banque: '',
            montantemprunt: null,
            type: '',
            echeance: '',
            principal: '',
            interet: '',
            total: '',
            encours: '',
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            setLoading(true);
            console.log(values);

            try {
              await dispatch(
                addCredit({
                  banque: values.banque,
                  montantemprunt: Number(values.montantemprunt),
                  type: values.type,
                  echeance: values.echeance,
                  principal: Number(values.principal),
                  interet: Number(values.interet),
                  total: Number(values.total),
                  encours: Number(values.encours),
                }),
              ).then((secc: any) => setData(data ? [secc, ...data] : [secc]));
              setLoading(false);
              resetForm();
              handleCloseModal();
            } catch (error) {
              console.error(error);
            }
          }}
        >
          {({ values, handleChange, handleBlur, handleSubmit, touched, errors }) => (
            <form onSubmit={handleSubmit}>
              <DialogTitle id="responsive-dialog-title">{t('addCredit')}</DialogTitle>
              <DialogContent>
                <div className="flex gap-4">
                  <Box className="w-full">
                    <CustomFormLabel htmlFor="banque">{t('banque')}</CustomFormLabel>
                    <CustomSelect
                      id="banque"
                      name="banque"
                      value={values.banque}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.banque && Boolean(errors.banque)}
                      helperText={touched.banque && errors.banque}
                      fullWidth
                      variant="outlined"
                    >
                      {banques?.map((banque: IBanque) => (
                        <MenuItem key={banque._id} value={banque._id}>
                          {banque.banque}
                        </MenuItem>
                      ))}
                    </CustomSelect>
                  </Box>
                  <Box className="w-full">
                    <CustomFormLabel htmlFor="echeance">{t('echeance')}</CustomFormLabel>
                    <CustomTextField
                      id="echeance"
                      name="echeance"
                      variant="outlined"
                      fullWidth
                      value={values.echeance}
                      type="date"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.echeance && Boolean(errors.echeance)}
                      helperText={touched.echeance && errors.echeance}
                    />
                  </Box>
                </div>
                <div className="flex gap-4">
                  <Box className="w-full">
                    <CustomFormLabel htmlFor="montantemprunt">
                      {t('montantemprunt')}
                    </CustomFormLabel>
                    <CustomTextField
                      id="montantemprunt"
                      name="montantemprunt"
                      variant="outlined"
                      fullWidth
                      value={values.montantemprunt}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.montantemprunt && Boolean(errors.montantemprunt)}
                      helperText={touched.montantemprunt && errors.montantemprunt}
                    />
                  </Box>
                  <Box className="w-full">
                    <CustomFormLabel htmlFor="principal">{t('principal')}</CustomFormLabel>
                    <CustomTextField
                      id="principal"
                      name="principal"
                      variant="outlined"
                      fullWidth
                      value={values.principal}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.principal && Boolean(errors.principal)}
                      helperText={touched.principal && errors.principal}
                    />
                  </Box>
                </div>
                <div className="flex gap-4">
                  <Box className="w-full">
                    <CustomFormLabel htmlFor="interet">{t('interet')}</CustomFormLabel>
                    <CustomTextField
                      id="interet"
                      name="interet"
                      variant="outlined"
                      fullWidth
                      value={values.interet}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.interet && Boolean(errors.interet)}
                      helperText={touched.interet && errors.interet}
                    />
                  </Box>
                  <Box className="w-full">
                    <CustomFormLabel htmlFor="total">{t('total')}</CustomFormLabel>
                    <CustomTextField
                      id="total"
                      name="total"
                      variant="outlined"
                      fullWidth
                      value={values.total}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.total && Boolean(errors.total)}
                      helperText={touched.total && errors.total}
                    />
                  </Box>
                </div>
                <div className="flex gap-4">
                  <Box className="w-full">
                    <CustomFormLabel htmlFor="encours">{t('encours')}</CustomFormLabel>
                    <CustomTextField
                      id="encours"
                      name="encours"
                      variant="outlined"
                      fullWidth
                      value={values.encours}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.encours && Boolean(errors.encours)}
                      helperText={touched.encours && errors.encours}
                    />
                  </Box>
                  <Box className="w-full">
                    <CustomFormLabel htmlFor="type">{t('type')}</CustomFormLabel>
                    <CustomTextField
                      id="type"
                      name="type"
                      variant="outlined"
                      fullWidth
                      value={values.type}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.type && Boolean(errors.type)}
                      helperText={touched.type && errors.type}
                    />
                  </Box>
                </div>
              </DialogContent>
              <DialogActions>
                <Button
                  color="error"
                  onClick={() => {
                    handleCloseModal();
                  }}
                >
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

export default Credit;
