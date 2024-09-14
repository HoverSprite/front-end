import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './../context/AuthContext';
import { hasAnyRole } from './../utils/roleUtils';

export const withRoleRoute = (WrappedComponent, allowedRoles) => {
  return (props) => {
    const { user, loading } = useAuth();

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    if (!hasAnyRole(user, allowedRoles)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return <WrappedComponent {...props} />;
  };
};