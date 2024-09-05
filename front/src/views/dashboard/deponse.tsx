import React, { useEffect, useState } from 'react';
import { Box, FormControlLabel, Grid, RadioGroup } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import { useSelector } from 'react-redux';
import { useDispatch } from 'src/store/Store';
import { useTranslation } from 'react-i18next';
import CustomRadio from 'src/components/forms/theme-elements/CustomRadio';
import TableDepnose from 'src/components/tables/deponseTab';
import { fetchAchats } from 'src/store/apps/achat/achatSlice';

interface IProduit {
  _id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  type: string;
  admin: string;
}
interface IAchat {
  _id: string;
  articles: {
    produit: IProduit;
    quantite: string;
  }[];
  total_general: string;
  statut: string;
  echeance: string;
  tva: number;
  totalHTV: number;
  modepaiement: string;
  admin: string;
  avance: number;
  reste: number;
  numero: string;
  banque: string;
}

const Deponse = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const achats = useSelector((state: any) => state.achatReducer.achats);
  const [data, setData] = useState<IAchat[]>();
  const [etat, setEtat] = React.useState('paid');

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchAchats());
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    setData(achats);
  }, [achats]);
  const handleChange = (event: any) => {
    setEtat(event.target.value);
  };

  return (
    <PageContainer title={t('deponse') || ''}>
      <Breadcrumb
        title={t('deponse') || ''}
        items={[{ to: '/', title: 'Home' }, { title: t('deponse') || '' }]}
      />
      <ParentCard title={t('deponse') || ''}>
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
              <TableDepnose
                rows={
                  data?.filter((item: IAchat) =>
                    etat === 'all' ? item?.statut !== 'paid' : item?.statut === etat,
                  ) || []
                }
                setData={setData}
                data={data || []}
              />
            </Box>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
};

export default Deponse;
