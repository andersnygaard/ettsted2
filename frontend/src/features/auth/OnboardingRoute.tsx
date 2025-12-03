/**
 * OnboardingRoute
 *
 * Route guard that only allows access to users who:
 * - Have an EasyAuth session (hasEasyAuthSession = true)
 * - Need to complete onboarding (needsOnboarding = true)
 *
 * Redirects to:
 * - /dashboard if already authenticated
 * - / (homepage) if no EasyAuth session
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { LoadingSpinner } from '../../shared/components';

interface OnboardingRouteProps {
  children: React.ReactNode;
}

export default function OnboardingRoute({ children }: OnboardingRouteProps) {
  const { isLoading, isAuthenticated, needsOnboarding } = useAuth();

  if (isLoading) {
    return <LoadingSpinner text="Laster..." />;
  }

  if (isAuthenticated) {
    // User already completed onboarding - go to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  if (!needsOnboarding) {
    // No EasyAuth session - go to homepage to log in
    return <Navigate to="/" replace />;
  }

  // User has EasyAuth session but needs onboarding
  return <>{children}</>;
}
