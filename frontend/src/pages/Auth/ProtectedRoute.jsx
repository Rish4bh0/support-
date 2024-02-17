// components/PrivateRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RoleCheck = ({ element, requiredRole }) => {
  const userRole = useSelector((state) => state.auth.user.role);

  // Check if the user's role matches the required role
  if (userRole === requiredRole) {
    return <Route element={element} />;
  } else {
    // Redirect to a suitable page for unauthorized users
    return <Navigate to="/" />;
  }
};

export default RoleCheck;
