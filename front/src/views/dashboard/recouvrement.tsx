import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, FormControlLabel, Grid, RadioGroup, TextField } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import { useSelector } from 'react-redux';
import { useDispatch } from 'src/store/Store';
import { useTranslation } from 'react-i18next';
import { fetchVentes } from 'src/store/apps/vente/venteSlice';
import TableRecouverement from 'src/components/tables/recouverementTab';
import CustomRadio from 'src/components/forms/theme-elements/CustomRadio';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField'; // Ensure CustomTextField is imported
import { useReactToPrint } from 'react-to-print';
import { IconPrinter } from '@tabler/icons';
import moment from 'moment';

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
  reference: string;
  client: Iclient;
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

const Recouverement = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const ventes = useSelector((state: any) => state.venteReducer.ventes);
  const [data, setData] = useState<IVente[]>();
  const [etat, setEtat] = React.useState('paid');
  const [filterReference, setFilterReference] = React.useState('');
  const [filterEcheance, setFilterEcheance] = React.useState<string | null>(null);
  const [filterNumCheque, setFilterNumCheque] = React.useState('');
  const [filterBanque, setFilterBanque] = React.useState('');
  const [filteredData, setFilteredData] = useState<IVente[]>();
  const printableRef = useRef(null);

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

  const handleChange = (event: any) => {
    setEtat(event.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => printableRef.current,
  });
  useEffect(() => {
    if (data) {
      const filtered = data.filter((item: any) => {
        return (
          (etat === 'all' ? item.statut !== 'paid' : item.statut === etat) &&
          (!filterReference || item._id.includes(filterReference)) &&
          (!filterEcheance ||
            moment(item.echeance).format('dd-mm-yyyy') ===
              moment(filterEcheance).format('dd-mm-yyyy')) &&
          (!filterNumCheque || item?.numero?.includes(filterNumCheque)) &&
          (!filterBanque || item?.banque?.includes(filterBanque))
        );
      });
      setFilteredData(filtered);
    }
  }, [data, etat, filterReference, filterEcheance, filterNumCheque, filterBanque]);

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
            <br />
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label={t('Reference')}
                value={filterReference}
                onChange={(e) => setFilterReference(e.target.value)}
                variant="outlined"
                fullWidth
              />
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
                label={t('numCheque')}
                value={filterNumCheque}
                onChange={(e) => setFilterNumCheque(e.target.value)}
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
              <TableRecouverement rows={filteredData || []} setData={setData} data={data} />
            </Box>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
};

export default Recouverement;
