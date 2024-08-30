import React from 'react';
import { Grid, Link, Typography, Container } from '@mui/material';

const Footer = () => {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} justifyContent="center" mt={4}>
        <Grid item xs={12} sm={5} lg={4} textAlign="center">
          <Typography fontSize="16" color="textSecondary" mt={1} mb={4}>
            <Link target="_blank" href="https://portfolio-cheriftahani92-gmailcom.vercel.app/">
              © 2024 All rights reserved by Tahani Cherif.
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Footer;
