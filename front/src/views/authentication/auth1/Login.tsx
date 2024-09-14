import React from 'react';
import { Grid, Box, Typography, Stack } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import img1 from 'src/assets/images/backgrounds/login-bg.svg';
import Logo from 'src/layouts/full/shared/logo/Logo';
import AuthLogin from '../authForms/AuthLogin';
import { useTranslation } from 'react-i18next';
import Language from 'src/layouts/full/vertical/header/Language';
import { IconBrandFacebook, IconBrandLinkedin } from '@tabler/icons';

const Login = () => {
  const { t } = useTranslation();

  return (
    <PageContainer title="Login" description="this is Login page">
      <Grid container spacing={0} sx={{ overflowX: 'hidden' }}>
        <Grid
          item
          xs={12}
          sm={12}
          lg={6}
          xl={7}
          sx={{
            position: 'relative',
            '&:before': {
              content: '""',
              background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
              backgroundSize: '400% 400%',
              animation: 'gradient 15s ease infinite',
              position: 'absolute',
              height: '100%',
              width: '100%',
              opacity: '0.3',
            },
          }}
        >
          <Box position="relative">
            <Box px={3}>
              <Logo />
            </Box>
            <Box
              alignItems="center"
              justifyContent="center"
              height={'calc(100vh - 75px)'}
              sx={{
                display: {
                  xs: 'none',
                  lg: 'flex',
                },
              }}
              className="flex flex-col"
            >
              <img
                src={img1}
                alt="bg"
                style={{
                  width: '100%',
                  maxWidth: '500px',
                }}
              />
              <div className="px-40">
                <p className="text-black text-lg">{t('footer2')}</p>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} mt={3}>
                  <div className="flew flex-row text-black items-center">
                    <IconBrandFacebook color="black" />
                    <a href="https://www.facebook.com/profile.php?id=61562246775096&mibextid=ZbWKwL">
                      Kais Manager
                    </a>
                  </div>
                  <div className="flew flex-row text-black items-center">
                    <IconBrandLinkedin color="black" />
                    <a href="https://www.linkedin.com/in/kais-safouene-3b7171188/">Kais Safouene</a>
                  </div>
                </Stack>
              </div>
            </Box>
          </Box>
        </Grid>
        <Grid
          xs={12}
          sm={12}
          lg={5}
          xl={5}
          display="flex"
          justifyContent="center"
          flexDirection="column"
          p={4}
        >
          <div className="ml-auto">
            <Language />
          </div>
          <Grid
            item
            xs={12}
            sm={12}
            lg={12}
            xl={12}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Box p={4} className="w-full">
              <AuthLogin
                title={t('welcome') || ''}
                subtext={
                  <Typography variant="subtitle1" color="textSecondary" mb={1}>
                    {t('welcomeMessage')}
                  </Typography>
                }
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Login;
