import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../UserContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useUser(); // Access user data from context

  if (!user) {
    return <Navigate to="/" replace />;  // Redirect to login if no user
  }

  return children;
};

export default ProtectedRoute;
