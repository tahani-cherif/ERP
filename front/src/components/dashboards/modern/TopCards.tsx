import { Box, CardContent, Grid, Typography } from '@mui/material';

import icon1 from '../../../assets/images/svgs/icon-connect.svg';
import icon2 from '../../../assets/images/svgs/icon-user-male.svg';
import icon3 from '../../../assets/images/svgs/icon-briefcase.svg';
import icon4 from '../../../assets/images/svgs/icon-mailbox.svg';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { dispatch } from 'src/store/Store';
import { fetchstatcount } from 'src/store/apps/stat/statSlice';
import { useTranslation } from 'react-i18next';

// interface cardType {
//   href: string;
//   icon: string;
//   title: string;
//   digits: string;
//   bgcolor: string;
// }

const TopCards = () => {
  const { t } = useTranslation();
  const stat = useSelector((state: any) => state.statReducer.statcount);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchstatcount());
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <Grid container spacing={3} mt={3}>
      {/* {topcards.map((topcard, i) => (
        <Grid item xs={12} sm={4} lg={2} key={i}>
          <Link to={topcard.href}>
            <Box bgcolor={topcard.bgcolor + '.light'} textAlign="center">
              <CardContent>
                <img src={topcard.icon} alt={topcard.icon} width="50" />
                <Typography
                  color={topcard.bgcolor + '.main'}
                  mt={1}
                  variant="subtitle1"
                  fontWeight={600}
                >
                  {topcard.title}
                </Typography>
                <Typography color={topcard.bgcolor + '.main'} variant="h4" fontWeight={600}>
                  {topcard.digits}
                </Typography>
              </CardContent>
            </Box>
          </Link>
        </Grid>
      ))} */}

      <Grid item xs={12} sm={3} lg={3}>
        <Box bgcolor={'primary.light'} textAlign="center">
          <CardContent>
            <img src={icon2} alt="client" width="50" className="mx-auto" />
            <Typography color={'primary.main'} mt={1} variant="subtitle1" fontWeight={600}>
              Client
            </Typography>
            <Typography color={'primary.main'} variant="h4" fontWeight={600}>
              {stat.client}
            </Typography>
          </CardContent>
        </Box>
      </Grid>
      <Grid item xs={12} sm={3} lg={3}>
        <Box bgcolor={'warning.light'} textAlign="center">
          <CardContent>
            <img src={icon3} alt="banque" width="50" className="mx-auto" />
            <Typography color={'warning.main'} mt={1} variant="subtitle1" fontWeight={600}>
              {t('banque')}
            </Typography>
            <Typography color={'warning.main'} variant="h4" fontWeight={600}>
              {stat.banque}
            </Typography>
          </CardContent>
        </Box>
      </Grid>
      <Grid item xs={12} sm={3} lg={3}>
        <Box bgcolor={'secondary.light'} textAlign="center">
          <CardContent>
            <img src={icon4} alt="client" width="50" className="mx-auto" />
            <Typography color={'secondary.main'} mt={1} variant="subtitle1" fontWeight={600}>
              {t('produit')}
            </Typography>
            <Typography color={'secondary.main'} variant="h4" fontWeight={600}>
              {stat.produit}
            </Typography>
          </CardContent>
        </Box>
      </Grid>
      <Grid item xs={12} sm={3} lg={3}>
        <Box bgcolor={'info.light'} textAlign="center">
          <CardContent>
            <img src={icon1} alt="fournisseur" width="50" className="mx-auto" />
            <Typography color={'info.main'} mt={1} variant="subtitle1" fontWeight={600}>
              {t('fournisseur')}
            </Typography>
            <Typography color={'info.main'} variant="h4" fontWeight={600}>
              {stat.fournisseur}
            </Typography>
          </CardContent>
        </Box>
      </Grid>
    </Grid>
  );
};

export default TopCards;
