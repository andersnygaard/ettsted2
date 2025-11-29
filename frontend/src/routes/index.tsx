import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../shared/components/Layout';
import ProtectedRoute from '../features/auth/ProtectedRoute';

// Lazy load page components for code splitting
const HomePage = lazy(() => import('../features/dashboard/HomePage'));
const DashboardPage = lazy(() => import('../features/dashboard/DashboardPage'));
const PortfolioPage = lazy(() => import('../features/portfolio/PortfolioPage'));
const CalculatorsPage = lazy(() => import('../features/calculators/CalculatorsPage'));
const LoginPage = lazy(() => import('../features/auth/LoginPage'));
const OnboardingPage = lazy(() => import('../features/auth/OnboardingPage'));

// Loading component
function LoadingFallback() {
  return (
    <div className="middle-align center-align">
      <progress className="circle large"></progress>
    </div>
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="onboarding" element={<OnboardingPage />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="portfolio"
            element={
              <ProtectedRoute>
                <PortfolioPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="calculators"
            element={
              <ProtectedRoute>
                <CalculatorsPage />
              </ProtectedRoute>
            }
          />
          {/* 404 - Not Found */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
