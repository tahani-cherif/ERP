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
import TableBanque from 'src/components/tables/banqueTab';
import { addBanque, fetchBanques } from 'src/store/apps/banque/banqueSlice';
import { useReactToPrint } from 'react-to-print';

interface IBanque {
  _id: string;
  banque: string;
  rib: string;
  iban: string;
  swift: string;
  admin: string;
}

const Banque = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const printableRef = useRef(null);
  const BCrumb = [
    {
      to: '/',
      title: 'Home',
    },
    {
      title: t('banque') || '',
    },
  ];
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xl'));
  const banques = useSelector((state: any) => state.banqueReducer.banques); // Adjust according to your state structure
  const [data, setData] = useState<IBanque[]>();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [filteredData, setFilteredData] = useState<IBanque[]>();
  const [filterBanque, setFilterBanque] = React.useState<string | null>(null);
  const validationSchema = Yup.object({
    banque: Yup.string().required(t('faildRequired') || ''),
    rib: Yup.string().required(t('faildRequired') || ''),
    iban: Yup.string().required(t('faildRequired') || ''),
    swift: Yup.string().required(t('faildRequired') || ''),
  });
  const formik = useFormik({
    initialValues: {
      banque: '',
      rib: '',
      iban: '',
      swift: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await dispatch(addBanque(values)).then((secc: any) =>
          setData(data ? [secc, ...data] : [secc]),
        );
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
        await dispatch(fetchBanques());
        setOpen(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [dispatch]);
  useEffect(() => {
    setData(banques);
  }, [banques]);
  const handleCloseModal = () => {
    formik.resetForm();
    setOpen(false);
  };
  const handlePrint = useReactToPrint({
    content: () => printableRef.current,
  });
  useEffect(() => {
    if (data) {
      const filtered = data.filter((item: any) => {
        return !filterBanque || item?.banque?.includes(filterBanque);
      });
      setFilteredData(filtered);
    }
  }, [data, filterBanque]);

  return (
    <PageContainer title={t('banque') || ''}>
      {/* breadcrumb */}
      <Breadcrumb title={t('banque') || ''} items={BCrumb} />
      {/* end breadcrumb */}
      <ParentCard title={t('banque') || ''}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div className="flex justify-end gap-4">
              <Button
                className="flex gap-4 p-4 "
                color="primary"
                variant="contained"
                onClick={() => handlePrint()}
              >
                <IconPrinter />
                <span>{t('imprimer')}</span>
              </Button>
              <Button className="flex gap-4 p-4" onClick={() => setOpen(true)}>
                <IconCirclePlus />
                <span>{t('addBanque')}</span>
              </Button>
            </div>
            <br />
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label={t('banque')}
                value={filterBanque}
                onChange={(e) => setFilterBanque(e.target.value)}
                variant="outlined"
                fullWidth
              />
            </Box>
            <Box className="mt-4" ref={printableRef}>
              <TableBanque rows={filteredData || []} setData={setData} data={data} />
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
        <form onSubmit={formik.handleSubmit} className="w-full">
          <DialogTitle id="responsive-dialog-title">{t('addBanque')}</DialogTitle>
          <DialogContent>
            <Box>
              <CustomFormLabel htmlFor="banque">{t('banque')}</CustomFormLabel>
              <CustomTextField
                id="banque"
                name="banque"
                variant="outlined"
                fullWidth
                value={formik.values.banque}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.banque && Boolean(formik.errors.banque)}
                helperText={formik.touched.banque && formik.errors.banque}
              />
            </Box>
            <Box>
              <CustomFormLabel htmlFor="rib">RIB</CustomFormLabel>
              <CustomTextField
                id="rib"
                name="rib"
                variant="outlined"
                fullWidth
                value={formik.values.rib}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.rib && Boolean(formik.errors.rib)}
                helperText={formik.touched.rib && formik.errors.rib}
              />
            </Box>
            <Box>
              <CustomFormLabel htmlFor="iban">IBAN</CustomFormLabel>
              <CustomTextField
                id="iban"
                name="iban"
                variant="outlined"
                fullWidth
                value={formik.values.iban}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.iban && Boolean(formik.errors.iban)}
                helperText={formik.touched.iban && formik.errors.iban}
              />
            </Box>
            <Box>
              <CustomFormLabel htmlFor="swift">Code SWIFT</CustomFormLabel>
              <CustomTextField
                id="swift"
                name="swift"
                variant="outlined"
                fullWidth
                value={formik.values.swift}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.swift && Boolean(formik.errors.swift)}
                helperText={formik.touched.swift && formik.errors.swift}
              />
            </Box>
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

export default Banque;
