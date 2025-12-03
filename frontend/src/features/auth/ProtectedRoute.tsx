import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { LoadingSpinner } from '../../shared/components';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, needsOnboarding } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner text="Laster..." />;
  }

  if (needsOnboarding) {
    // User has EasyAuth session but hasn't completed onboarding
    return <Navigate to="/onboarding" replace />;
  }

  if (!isAuthenticated) {
    // No session - redirect to home page where user can use login modal
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
