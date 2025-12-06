import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../shared/components/Layout';
import { LoadingSpinner } from '../shared/components';
import ProtectedRoute from '../features/auth/ProtectedRoute';
import OnboardingRoute from '../features/auth/OnboardingRoute';

// Lazy load page components for code splitting
const HomePage = lazy(() => import('../features/dashboard/HomePage'));
const DashboardPage = lazy(() => import('../features/dashboard/DashboardPage'));
const PortfolioPage = lazy(() => import('../features/portfolio/PortfolioPage'));
const ImportPage = lazy(() => import('../features/import/ImportPage'));
const SparingPage = lazy(() => import('../features/sparing/SparingPage'));
const GjeldPage = lazy(() => import('../features/gjeld/GjeldPage'));
const PensjonPage = lazy(() => import('../features/pensjon/PensjonPage'));
const CalculatorsPage = lazy(() => import('../features/calculators/CalculatorsPage'));
const CompoundCalculatorPage = lazy(() => import('../features/calculators/CompoundCalculatorPage'));
const FireCalculatorPage = lazy(() => import('../features/calculators/FireCalculatorPage'));
const LoanCalculatorPage = lazy(() => import('../features/calculators/LoanCalculatorPage'));
const MonteCarloPage = lazy(() => import('../features/calculators/MonteCarloPage'));
const OnboardingPage = lazy(() => import('../features/auth/OnboardingPage'));
const EconomyPage = lazy(() => import('../features/auth/EconomyPage'));
const PostLoginPage = lazy(() => import('../features/auth/PostLoginPage'));


function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="auth/callback" element={<PostLoginPage />} />
          <Route
            path="onboarding"
            element={
              <OnboardingRoute>
                <OnboardingPage />
              </OnboardingRoute>
            }
          />
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
            path="import"
            element={
              <ProtectedRoute>
                <ImportPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="sparing"
            element={
              <ProtectedRoute>
                <SparingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="gjeld"
            element={
              <ProtectedRoute>
                <GjeldPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="pensjon"
            element={
              <ProtectedRoute>
                <PensjonPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="kalkulatorer"
            element={
              <ProtectedRoute>
                <CalculatorsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="kalkulatorer/rentes-rente"
            element={
              <ProtectedRoute>
                <CompoundCalculatorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="kalkulatorer/fire"
            element={
              <ProtectedRoute>
                <FireCalculatorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="kalkulatorer/lan"
            element={
              <ProtectedRoute>
                <LoanCalculatorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="kalkulatorer/monte-carlo"
            element={
              <ProtectedRoute>
                <MonteCarloPage />
              </ProtectedRoute>
            }
          />
          {/* Redirects from old calculator routes to new Norwegian names */}
          <Route path="kalkulatorer/compound" element={<Navigate to="/kalkulatorer/rentes-rente" replace />} />
          <Route path="kalkulatorer/loan" element={<Navigate to="/kalkulatorer/lan" replace />} />
          <Route
            path="economy"
            element={
              <ProtectedRoute>
                <EconomyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="min-okonomi"
            element={
              <ProtectedRoute>
                <EconomyPage />
              </ProtectedRoute>
            }
          />
          {/* Legacy route redirects */}
          <Route path="calculators" element={<Navigate to="/kalkulatorer" replace />} />
          <Route path="login" element={<Navigate to="/dashboard" replace />} />
          {/* 404 - Not Found */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
