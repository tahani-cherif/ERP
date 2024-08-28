import React, { useEffect, useState } from 'react';
import { Box, FormControlLabel, Grid, RadioGroup } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import { useSelector } from 'react-redux';
import { useDispatch } from 'src/store/Store';
import { useTranslation } from 'react-i18next';
import { fetchVentes } from 'src/store/apps/vente/venteSlice';
import { fetchClients } from 'src/store/apps/client/clientSlice';
import { fetchProduits } from 'src/store/apps/produit/produitSlice';
import TableRecouverement from 'src/components/tables/recouverementTab';
import CustomRadio from 'src/components/forms/theme-elements/CustomRadio';

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
interface IBanque {
  _id: string;
  banque: string;
  rib: string;
  iban: string;
  swift: string;
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
  avance: number;
  reste: number;
  numero: string;
  banque: IBanque;
}

const Recouverement = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const ventes = useSelector((state: any) => state.venteReducer.ventes);
  const [data, setData] = useState<IVente[]>();
  const [etat, setEtat] = React.useState('paid');

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchClients());
        await dispatch(fetchProduits());
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
  const handleChange = (event: any) => {
    setEtat(event.target.value);
  };

  return (
    <PageContainer title={t('recouverement') || ''}>
      <Breadcrumb
        title={t('recouverement') || ''}
        items={[{ to: '/', title: 'Home' }, { title: t('recouverement') || '' }]}
      />
      <ParentCard title={t('recouverement') || ''}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div className="flex justify-between">
              <RadioGroup
                row
                aria-label="position"
                name="position"
                defaultValue={etat}
                value={etat}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="paid"
                  control={<CustomRadio />}
                  label={t('listfacturepaid')}
                  labelPlacement="start"
                />
                <FormControlLabel
                  value="all"
                  control={<CustomRadio />}
                  label={t('listfacturenopaid')}
                  labelPlacement="start"
                />
              </RadioGroup>
            </div>
            <Box className="mt-4">
              <TableRecouverement
                rows={
                  data?.filter((item: IVente) =>
                    etat === 'all' ? item?.statut !== 'paid' : item?.statut === etat,
                  ) || []
                }
                setData={setData}
                data={
                  data?.filter((item: IVente) =>
                    etat === 'all' ? item?.statut !== 'paid' : item?.statut === etat,
                  ) || []
                }
              />
            </Box>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
};

export default Recouverement;
