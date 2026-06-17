import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUserRole, isLoggedIn } from '~/utils/authUtils';
import config from '~/config';
import NotFound from './NotFound';

function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  let userRole = null;

  try {
    userRole = getCurrentUserRole();
  } catch (error) {
    console.error('Failed to parse user data from localStorage:', error);
  }

  const requiresAuth = !allowedRoles.includes('ALL');

  if (requiresAuth && !isLoggedIn()) {
    return <Navigate to={config.routes.login} state={{ from: location }} replace />;
  }

  // Check if the user's role is allowed
  if (userRole && !allowedRoles.includes(userRole) && !allowedRoles.includes('ALL')) {
    return <NotFound />;
  }

  if (requiresAuth && !userRole) {
    return <Navigate to={config.routes.login} state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
