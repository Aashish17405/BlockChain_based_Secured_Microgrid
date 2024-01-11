import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const isAuthenticated = () => {
  const access_token = localStorage.getItem('access_token');

  if (access_token) {
    const tokenParts = access_token.split('.');
    if (tokenParts.length === 3) {
      const payload = JSON.parse(atob(tokenParts[1]));
      if (payload && payload.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp < currentTime) {
          localStorage.removeItem('access_token');
          return false; 
        }
        return true;
      }
    }
  }
  return false; 
};


const PrivateRoutes = () => {
  const isAuth = isAuthenticated();

  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;