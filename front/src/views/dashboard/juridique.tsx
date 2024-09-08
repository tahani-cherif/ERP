import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Grid, TextField } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import { useSelector } from 'react-redux';
import { useDispatch } from 'src/store/Store';
import { useTranslation } from 'react-i18next';
import { fetchVentes } from 'src/store/apps/vente/venteSlice';
import TableJuridique from 'src/components/tables/juridiqueTab';
import { useReactToPrint } from 'react-to-print';
import { IconPrinter } from '@tabler/icons';

interface Iclient {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  matriculeFiscale: string;
  admin: string;
}

interface IVente {
  _id: string;
  client: Iclient;
  total_general: string;
  numeroDossier: string;
  datejugement: string;
  huissierjustice: string;
  admin: string;
  montantimpaye: number;
  statut: string;
}

const Juridique = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const ventes = useSelector((state: any) => state.venteReducer.ventes);
  const [data, setData] = useState<IVente[]>();
  const printableRef = useRef(null);
  const [filterReference, setFilterReference] = React.useState('');
  const [filterClient, setFilterClient] = React.useState('');
  const [filterNumeroDossier, setFilterNumeroDossier] = React.useState('');
  const [filterHuissier, setFilterHuissier] = React.useState('');
  const [filteredData, setFilteredData] = useState<IVente[]>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchVentes());
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    setData(ventes);
  }, [ventes]);
  useEffect(() => {
    if (data) {
      const filtered = data.filter((item) => {
        return (
          (!filterReference || item._id.includes(filterReference)) &&
          (!filterClient ||
            item.client?.fullName.toLowerCase().includes(filterClient.toLowerCase())) &&
          (!filterNumeroDossier || item?.numeroDossier?.includes(filterNumeroDossier)) &&
          (!filterHuissier ||
            item?.huissierjustice?.toLowerCase()?.includes(filterHuissier.toLowerCase())) &&
          item.statut === 'not-paid'
        );
      });
      setFilteredData(filtered);
    }
  }, [data, filterReference, filterClient, filterNumeroDossier, filterHuissier]);
  const handlePrint = useReactToPrint({
    content: () => printableRef.current,
  });

  return (
    <PageContainer title={t('juridique') || ''}>
      <Breadcrumb
        title={t('juridique') || ''}
        items={[{ to: '/', title: 'Home' }, { title: t('juridique') || '' }]}
      />
      <ParentCard title={t('juridique') || ''}>
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
            </div>
            <br />
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label={t('Reference')}
                value={filterReference}
                onChange={(e) => setFilterReference(e.target.value)}
                variant="outlined"
                fullWidth
              />
              <TextField
                label={t('nomClients')}
                value={filterClient}
                onChange={(e) => setFilterClient(e.target.value)}
                variant="outlined"
                fullWidth
              />
              <TextField
                label={t('numerodossier')}
                value={filterNumeroDossier}
                onChange={(e) => setFilterNumeroDossier(e.target.value)}
                variant="outlined"
                fullWidth
              />
              <TextField
                label={t('huissierjustice')}
                value={filterHuissier}
                onChange={(e) => setFilterHuissier(e.target.value)}
                variant="outlined"
                fullWidth
              />
            </Box>
            <Box className="mt-4" ref={printableRef}>
              <TableJuridique rows={filteredData || []} setData={setData} data={filteredData} />
            </Box>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
};

export default Juridique;
