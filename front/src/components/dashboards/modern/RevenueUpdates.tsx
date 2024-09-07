import React, { useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography, Avatar, Box } from '@mui/material';
import DashboardCard from '../../shared/DashboardCard';
import { Props } from 'react-apexcharts';
import { useSelector } from 'react-redux';
import { dispatch } from 'src/store/Store';
import { fetchstatfacture } from 'src/store/apps/stat/statSlice';
import { useTranslation } from 'react-i18next';

const RevenueUpdates = () => {
  const { t } = useTranslation();
  const stat = useSelector((state: any) => state.statReducer.statfacture);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchstatfacture());
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [dispatch]);

  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  // chart
  const optionscolumnchart: Props = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: true,
      },
      height: 370,
      stacked: true,
    },
    colors: [primary, secondary],
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: '60%',
        columnWidth: '20%',
        borderRadius: [6],
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'all',
      },
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
    grid: {
      borderColor: 'rgba(0,0,0,0.1)',
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },

    // yaxis: {
    //   min: -5,
    //   max: 100,
    //   tickAmount: 4,
    // },
    xaxis: {
      categories: stat.month,
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
    },
  };
  const seriescolumnchart = [
    {
      name: t('vente'),
      data: stat.tabvente,
    },
    {
      name: t('achat'),
      data: stat.tabachat,
    },
  ];

  return (
    <DashboardCard title={t('vente') + '/' + t('achat') || ''} subtitle={t('stat') || ''}>
      <Grid container spacing={3}>
        {/* column */}
        <Grid item xs={12} sm={8}>
          <Chart
            options={optionscolumnchart}
            series={seriescolumnchart}
            type="bar"
            height="370px"
          />
        </Grid>
        {/* column */}
        <Grid item xs={12} sm={4}>
          <Stack spacing={3} my={5}>
            <Stack direction="row" spacing={2}>
              <Avatar
                sx={{ width: 9, mt: 1, height: 9, bgcolor: primary, svg: { display: 'none' } }}
              ></Avatar>
              <Box>
                <Typography variant="subtitle1" color="textSecondary">
                  {t('vente')}
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Avatar
                sx={{ width: 9, mt: 1, height: 9, bgcolor: secondary, svg: { display: 'none' } }}
              ></Avatar>
              <Box>
                <Typography variant="subtitle1" color="textSecondary">
                  {t('achat')}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default RevenueUpdates;
