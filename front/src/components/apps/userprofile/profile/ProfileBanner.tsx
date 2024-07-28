import React from 'react';
import {
  Grid,
  Box,
  Typography,
  Avatar,
  CardMedia,
  styled,

} from '@mui/material';
import profilecover from 'src/assets/images/backgrounds/profilebg.jpg';
import userimg from 'src/assets/images/profile/user-1.jpg';

import BlankCard from '../../../shared/BlankCard';

const ProfileBanner = () => {
  const ProfileImage = styled(Box)(() => ({
    backgroundImage: 'linear-gradient(#50b2fc,#f44c66)',
    borderRadius: '50%',
    width: '110px',
    height: '110px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto'
  }));
  const user=JSON.parse(localStorage.getItem('user') || "")

  return (
    <>
      <BlankCard>
        <CardMedia component="img" image={profilecover} alt={profilecover} width="100%" />
        <Grid container spacing={0} justifyContent="center" alignItems="center">
          {/* Post | Followers | Following */}
          <Grid
            item
       
            lg={4}
            sm={12}
            md={5}
            xs={12}
            sx={{
              order: {
                xs: '2',
                sm: '2',
                lg: '1',
              },
            }}
          >
           
          </Grid>
          {/* about profile */}
          <Grid
            item
            lg={12}
            sm={12}
            xs={12}
            p={4}
            sx={{
              order: {
                xs: '1',
                sm: '1',
                lg: '2',
              },
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              textAlign="center"
              justifyContent="center"
              sx={{
                mt: '-85px',
              }}
            >
              <Box>
                <ProfileImage>
                  <Avatar
                    src={userimg}
                    alt={userimg}
                    sx={{
                      borderRadius: '50%',
                      width: '100px',
                      height: '100px',
                      border: '4px solid #fff',
                    }}
                  />
                </ProfileImage>
                <Box mt={1}>
                  <Typography fontWeight={600} variant="h5">
                  {user?.firstName+" " + user?.lastName}
                  </Typography>
                  <Typography color="textSecondary" variant="h6" fontWeight={400}>
                  {user?.role}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

      </BlankCard>
    </>
  );
};

export default ProfileBanner;
