import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Grid, TextField, useMediaQuery } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import { useSelector } from 'react-redux';
import { addClient, fetchClients } from 'src/store/apps/client/clientSlice';
import { useDispatch } from 'src/store/Store';
import TableClient from 'src/components/tables/clientTab';
import { IconCirclePlus, IconPrinter } from '@tabler/icons';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';

import SpinnerSubmit from '../spinnerSubmit/Spinner';
import { useReactToPrint } from 'react-to-print';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Clients',
  },
];

interface Iclient {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  matriculeFiscale: string;
  admin: string;
}

const phonetunis = /^[+0]{0,2}(91)?[0-9]{8}$/;
const Client = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xl'));
  const clients = useSelector((state: any) => state.clientReducer.clients); // Adjust according to your state structure
  const [data, setData] = useState<Iclient[]>();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [filteredData, setFilteredData] = useState<Iclient[]>();
  const [filterName, setFilterName] = React.useState<string | null>(null);
  const printableRef = useRef(null);
  const validationSchema = Yup.object({
    fullName: Yup.string().required(t('faildRequired') || ''),
    address: Yup.string().optional(),
    email: Yup.string()
      .email(t('invalidEmail') || '')
      .optional(),
    matriculeFiscale: Yup.string().optional(),
    phone: Yup.string()
      .optional()
      .matches(phonetunis, t('phoneerrors') || ''),
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
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await dispatch(addClient(values)).then((secc: any) =>
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
        await dispatch(fetchClients());
        setOpen(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [dispatch]);
  useEffect(() => {
    setData(clients);
  }, [clients]);
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
        return !filterName || item?.fullName?.includes(filterName);
      });
      setFilteredData(filtered);
    }
  }, [data, filterName]);

  return (
    <PageContainer title="Clients">
      {/* breadcrumb */}
      <Breadcrumb title="Clients" items={BCrumb} />
      {/* end breadcrumb */}
      <ParentCard title="Clients">
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
                <span>{t('addClient')}</span>
              </Button>
            </div>
            <br />
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label={t('fullName')}
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                variant="outlined"
                fullWidth
              />
            </Box>
            <Box className="mt-4" ref={printableRef}>
              <TableClient rows={filteredData || []} setData={setData} data={data} />
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
          <DialogTitle id="responsive-dialog-title">{t('addClient')}</DialogTitle>
          <DialogContent>
            <div className="flex gap-4">
              <Box>
                <CustomFormLabel htmlFor="fullName">{t('fullName')}</CustomFormLabel>
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
              <Box>
                <CustomFormLabel htmlFor="email">{t('email')}</CustomFormLabel>
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
            <div className="flex gap-4">
              <Box>
                <CustomFormLabel htmlFor="address">{t('address')}</CustomFormLabel>
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
              <Box>
                <CustomFormLabel htmlFor="phone">{t('phone')}</CustomFormLabel>
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
            <Box>
              <CustomFormLabel htmlFor="matriculeFiscale">
                {t('matriculeFiscalepassport')}
              </CustomFormLabel>
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

export default Client;
