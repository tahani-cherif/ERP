import React from 'react';
import { Grid, Typography, Box, Container, Stack } from '@mui/material';
import c2aImg from 'src/assets/images/landingpage/background/c2a.png';
import { IconBrandFacebook, IconBrandLinkedin } from '@tabler/icons';

// import GuaranteeCard from './GuaranteeCard';

// const StyledButton = styled(Button)(({ theme }) => ({
//   padding: '13px 34px',
//   fontSize: '16px',
//   backgroundColor: theme.palette.background.paper,
//   color: theme.palette.primary.main,
//   fontWeight: 600,
// }));

// const StyledButton2 = styled(Button)(({ theme }) => ({
//   padding: '13px 34px',
//   fontSize: '16px',
//   borderColor: theme.palette.background.paper,
//   color: theme.palette.background.paper,
//   fontWeight: 600,
//   '&:hover': {
//     backgroundColor: theme.palette.background.paper,
//     color: theme.palette.primary.main,
//   },
// }));

const C2a2 = () => {
  return (
    <Box>
      <Box
        bgcolor="primary.main"
        sx={{
          pt: '60px',
          pb: '30px',
        }}
      >
        <Container maxWidth="lg">
          <Grid container justifyContent="space-between" spacing={3}>
            <Grid item xs={12} sm={12} lg={5}>
              <Typography variant="h3" color="background.paper" fontWeight={400} mt={4}>
                Bienvenue chez KAIS MANAGER Entreprise spécialisée dans le développement d'ERP
                (logiciels de gestion des entreprises) et la construction de réseaux informatiques
                et de télécom.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} mt={3}>
                <div className="flew flex-row text-white items-center">
                  <IconBrandFacebook color="white" />
                  <a href="https://www.facebook.com/profile.php?id=61562246775096&mibextid=ZbWKwL">
                    Kais Manager
                  </a>
                </div>
                <div className="flew flex-row text-white items-center">
                  <IconBrandLinkedin color="white" />
                  <a href="https://www.linkedin.com/in/kais-safouene-3b7171188/">Kais Safouene</a>
                </div>
              </Stack>
            </Grid>
            <Grid item xs={12} lg={5}>
              <Box
                sx={{
                  textAlign: {
                    xs: 'center',
                    lg: 'right',
                  },
                }}
              >
                <img src={c2aImg} alt="img" width="330" />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      {/* <Container maxWidth="lg">
        <GuaranteeCard />
      </Container> */}
    </Box>
  );
};

export default C2a2;
