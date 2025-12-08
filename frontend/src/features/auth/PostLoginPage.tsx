/**
 * PostLoginPage
 *
 * Landing page after OAuth redirect. Routes user to:
 * - /onboarding if authenticated but not in our DB
 * - /oversikt if authenticated and in our DB
 * - / (homepage) if not authenticated
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { LoadingSpinner } from '../../shared/components';

export default function PostLoginPage() {
  const { isLoading, isAuthenticated, needsOnboarding } = useAuth();
  const navigate = useNavigate();
  usePageTitle('Logger inn...');

  useEffect(() => {
    if (isLoading) return;

    if (needsOnboarding) {
      // User has EasyAuth session but not in our DB
      navigate('/onboarding', { replace: true });
    } else if (isAuthenticated) {
      // User is fully authenticated
      navigate('/oversikt', { replace: true });
    } else {
      // No session at all - back to homepage
      navigate('/', { replace: true });
    }
  }, [isLoading, isAuthenticated, needsOnboarding, navigate]);

  return <LoadingSpinner text="Logger inn..." />;
}
