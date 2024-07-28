import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }:{element:any}) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Check if the user is authenticated

  return isAuthenticated ? element : <Navigate to="/auth/login" />;
};

export default ProtectedRoute;