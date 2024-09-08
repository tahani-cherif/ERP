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
import { Formik } from 'formik';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';

import SpinnerSubmit from '../spinnerSubmit/Spinner';
import TableCaisse from 'src/components/tables/caisseTab';
import { addCaisse, fetchCaisses } from 'src/store/apps/caisse/caisseSlice';
import { useReactToPrint } from 'react-to-print';
import moment from 'moment';

interface ICaisse {
  _id: string;
  designation: string;
  encaissement: number;
  decaissement: number;
  date: Date;
  admin: string;
}

const Caisse = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const printableRef = useRef(null);
  const BCrumb = [
    {
      to: '/',
      title: 'Home',
    },
    {
      title: t('caisse') || '',
    },
  ];
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xl'));
  const caisses = useSelector((state: any) => state.caisseReducer.caisses); // Adjust according to your state structure
  const [data, setData] = useState<ICaisse[]>();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [totalEncaissement, setTotalEncaissement] = React.useState(0);
  const [totalDecaissement, setTotalDecaissement] = React.useState(0);
  const [filterDesignation, setFilterDesignation] = React.useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<ICaisse[]>();
  const [filterEcheance, setFilterEcheance] = React.useState<string | null>(null);
  const validationSchema = Yup.object({
    designation: Yup.string().optional(),
    encaissement: Yup.number()
      .typeError(t('mustnumber') || 'must be a number')
      .optional()
      .min(0, t('mustnonnegative') || ' must be a non-negative number'),
    decaissement: Yup.number()
      .typeError(t('mustnumber') || 'must be a number')
      .optional()
      .min(0, t('mustnonnegative') || ' must be a non-negative number'),
    date: Yup.string().required(t('faildRequired') || ''),
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchCaisses());
        setOpen(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [dispatch]);
  useEffect(() => {
    setData(caisses);
    let totalenc = 0;
    let totaldec = 0;
    caisses?.map((item: ICaisse) => {
      totalenc += Number(item.encaissement);
      totaldec += Number(item.decaissement);
    });
    setTotalEncaissement(totalenc);
    setTotalDecaissement(totaldec);
  }, [caisses]);
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
          (!filterEcheance ||
            moment(item.date).format('DD-MM-YYYY') ===
              moment(filterEcheance).format('DD-MM-YYYY')) &&
          (!filterDesignation || item?.numero?.includes(filterDesignation))
        );
      });
      setFilteredData(filtered);
    }
  }, [data, filterEcheance, filterDesignation]);

  return (
    <PageContainer title={t('caisse') || ''}>
      {/* breadcrumb */}
      <Breadcrumb title={t('caisse') || ''} items={BCrumb} />
      {/* end breadcrumb */}
      <ParentCard title={t('caisse') || ''}>
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
                <span>{t('addCaisse')}</span>
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
                label={t('designation')}
                value={filterDesignation}
                onChange={(e) => setFilterDesignation(e.target.value)}
                variant="outlined"
                fullWidth
              />
            </Box>
            <Box className="mt-4" ref={printableRef}>
              <TableCaisse
                rows={filteredData || []}
                setData={setData}
                data={data}
                setTotalEncaissement={setTotalEncaissement}
                setTotalDecaissement={setTotalDecaissement}
              />
            </Box>
            <p className="pt-4 ml-auto w-fit ">
              <b>TOTAL :</b>
              {totalEncaissement - totalDecaissement}
            </p>
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
            designation: '',
            encaissement: '',
            decaissement: '',
            date: '',
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            setLoading(true);
            try {
              await dispatch(
                addCaisse({
                  date: new Date(values.date),
                  encaissement: Number(values.encaissement),
                  designation: values.designation,
                  decaissement: Number(values.decaissement),
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
              <DialogTitle id="responsive-dialog-title">{t('addCaisse')}</DialogTitle>
              <DialogContent>
                <Box className="w-full">
                  <CustomFormLabel htmlFor="date">date</CustomFormLabel>
                  <CustomTextField
                    id="date"
                    name="date"
                    variant="outlined"
                    fullWidth
                    value={values.date}
                    type="date"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.date && Boolean(errors.date)}
                    helperText={touched.date && errors.date}
                  />
                </Box>
                <Box className="w-full">
                  <CustomFormLabel htmlFor="designation">{t('designation')}</CustomFormLabel>
                  <CustomTextField
                    id="designation"
                    name="designation"
                    variant="outlined"
                    fullWidth
                    value={values.designation}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.designation && Boolean(errors.designation)}
                    helperText={touched.designation && errors.designation}
                  />
                </Box>
                <Box className="w-full">
                  <CustomFormLabel htmlFor="encaissement">{t('encaissement')}</CustomFormLabel>
                  <CustomTextField
                    id="encaissement"
                    name="encaissement"
                    variant="outlined"
                    fullWidth
                    value={values.encaissement}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.encaissement && Boolean(errors.encaissement)}
                    helperText={touched.encaissement && errors.encaissement}
                  />
                </Box>
                <Box className="w-full">
                  <CustomFormLabel htmlFor="decaissement">{t('decaissement')}</CustomFormLabel>
                  <CustomTextField
                    id="decaissement"
                    name="decaissement"
                    variant="outlined"
                    fullWidth
                    value={values.decaissement}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.decaissement && Boolean(errors.decaissement)}
                    helperText={touched.decaissement && errors.decaissement}
                  />
                </Box>
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

export default Caisse;
