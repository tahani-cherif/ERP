import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import { useSelector } from 'react-redux';
import { useDispatch } from 'src/store/Store';
import { useTranslation } from 'react-i18next';
import { fetchVentes } from 'src/store/apps/vente/venteSlice';
import TableJuridique from 'src/components/tables/juridiqueTab';

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

  return (
    <PageContainer title={t('juridique') || ''}>
      <Breadcrumb
        title={t('juridique') || ''}
        items={[{ to: '/', title: 'Home' }, { title: t('juridique') || '' }]}
      />
      <ParentCard title={t('juridique') || ''}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box className="mt-4">
              <TableJuridique
                rows={data?.filter((item: IVente) => item?.statut === 'not-paid') || []}
                setData={setData}
                data={data?.filter((item: IVente) => item?.statut === 'not-paid')}
              />
            </Box>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
};

export default Juridique;
