import { Box, Avatar, Typography, IconButton, Tooltip } from '@mui/material';
import img1 from 'src/assets/images/profile/user-1.jpg';
import { IconPower } from '@tabler/icons';
import { Link } from 'react-router-dom';

export const Profile = () => {
  const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user') || '');

  return (
    <Box
      display={'flex'}
      alignItems="center"
      gap={2}
      sx={{ m: 3, p: 2, bgcolor: `${'secondary.light'}` }}
    >
      <>
        <Avatar alt="Remy Sharp" src={img1} />

        <Box>
          <Typography variant="h6">{user?.firstName + ' ' + user?.lastName} </Typography>
          <Typography variant="caption">{user?.role} </Typography>
        </Box>
        <Box sx={{ ml: 'auto' }}>
          <Tooltip title="Logout" placement="top">
            <IconButton
              color="primary"
              component={Link}
              to="auth/login"
              aria-label="logout"
              size="small"
              onClick={() => {
                localStorage.clear();
              }}
            >
              <IconPower size="20" />
            </IconButton>
          </Tooltip>
        </Box>
      </>
    </Box>
  );
};
