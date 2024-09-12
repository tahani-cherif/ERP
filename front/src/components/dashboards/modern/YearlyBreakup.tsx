import React, { useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography, Box } from '@mui/material';

import DashboardCard from '../../shared/DashboardCard';
import { Props } from 'react-apexcharts';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { dispatch } from 'src/store/Store';
import { fetchstatstock } from 'src/store/apps/stat/statSlice';
import { IconGridDots } from '@tabler/icons';

const YearlyBreakup = () => {
  const { t } = useTranslation();
  const stat = useSelector((state: any) => state.statReducer.statstock);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchstatstock());
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [dispatch]);

  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.primary.light;

  // chart
  const optionscolumnchart: Props = {
    chart: {
      type: 'donut',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 155,
    },
    colors: [primary, primarylight, '#F9F9FD'],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: '75%',
          background: 'transparent',
        },
      },
    },
    tooltip: {
      enabled: false,
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: {
            width: 120,
          },
        },
      },
    ],
  };
  const seriescolumnchart = [stat.achat, stat.vendre];

  return (
    <DashboardCard title={t('produit') || ''}>
      <Grid container spacing={3} className="h-full">
        {/* column */}
        <Grid item xs={7} sm={7}>
          <Typography variant="h3" fontWeight="700">
            {stat.produit}
          </Typography>
          <Stack direction="column" spacing={2} justifyContent="space-between" mt={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                width={45}
                height={45}
                bgcolor="primary.light"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Typography
                  color="primary.main"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <IconGridDots width={40} />
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  {t('stockAchat')}
                </Typography>
                <Typography variant="h6" fontWeight="600">
                  {stat.achat?.toFixed(2)}%
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                width={45}
                height={45}
                bgcolor="grey.200"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Typography
                  color="grey.400"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <IconGridDots width={40} />
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  {t('stockProduction')}
                </Typography>
                <Typography variant="h6" fontWeight="600">
                  {stat.vendre?.toFixed(2)}%
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Grid>
        {/* column */}
        <Grid item xs={5} sm={5}>
          <Chart
            options={optionscolumnchart}
            series={seriescolumnchart}
            type="donut"
            height="130px"
          />
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default YearlyBreakup;
