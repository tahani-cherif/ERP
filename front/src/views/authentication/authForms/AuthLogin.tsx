import React, { useState } from 'react';
import { Box, Typography, Button, Stack, Alert, AlertTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import { loginType } from 'src/types/auth/auth';
import api from 'src/utils/axios';

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const { t } = useTranslation();
  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();
  const validationSchema = Yup.object({
    username: Yup.string()
      .email(t('invalidEmail') || '')
      .required(t('usernameRequired') || ''),
    password: Yup.string().required(t('passwordRequired') || ''),
  });
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log('Form values:', values);
      api
        .post('/auth/login', {
          email: values.username,
          password: values.password,
        })
        .then((secces: any) => {
          localStorage.setItem('token', secces?.token);
          localStorage.setItem('user', JSON.stringify(secces?.data));
          navigate('/');
        })
        .catch((err) => {
          console.log(err);
          setError(true);
        });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="w-full">
      {title ? (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      <Stack>
        <Box mb={2}>
          <CustomFormLabel htmlFor="username">{t('username')}</CustomFormLabel>
          <CustomTextField
            id="username"
            name="username"
            variant="outlined"
            fullWidth
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
        </Box>
        <Box mb={2}>
          <CustomFormLabel htmlFor="password">{t('password')}</CustomFormLabel>
          <CustomTextField
            id="password"
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
        </Box>
        {/* <Stack justifyContent="space-between" direction="row" alignItems="end" my={2}>
          <Typography
            component={Link}
            to="/auth/forgot-password"
            fontWeight="500"
            sx={{
              textDecoration: 'none',
              color: 'primary.main',
            }}
          >
            {t("forgotPassword")}
          </Typography>
        </Stack> */}
      </Stack>
      <Box mb={2}>
        <Button color="primary" variant="contained" size="large" fullWidth type="submit">
          {t('login')}
        </Button>
      </Box>
      {subtitle}
      {error && (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {t('failedLogin')}
        </Alert>
      )}
    </form>
  );
};

export default AuthLogin;
