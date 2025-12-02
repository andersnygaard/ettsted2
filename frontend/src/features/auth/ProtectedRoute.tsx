import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { LoadingSpinner } from '../../shared/components';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner text="Laster..." />;
  }

  if (!isAuthenticated) {
    // Redirect to home page where user can use login modal
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
