import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../shared/components/Layout';
import { LoadingSpinner, FeatureErrorFallback, ErrorBoundary } from '../shared/components';
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
            path="oversikt"
            element={
              <ProtectedRoute>
                <ErrorBoundary fallback={(error, reset) => <FeatureErrorFallback error={error} reset={reset} featureName="Dashboard" />}>
                  <DashboardPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="portefolje"
            element={
              <ProtectedRoute>
                <ErrorBoundary fallback={(error, reset) => <FeatureErrorFallback error={error} reset={reset} featureName="Portefølje" />}>
                  <PortfolioPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="import"
            element={
              <ProtectedRoute>
                <ErrorBoundary fallback={(error, reset) => <FeatureErrorFallback error={error} reset={reset} featureName="Import" />}>
                  <ImportPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="sparing"
            element={
              <ProtectedRoute>
                <ErrorBoundary fallback={(error, reset) => <FeatureErrorFallback error={error} reset={reset} featureName="Sparing" />}>
                  <SparingPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="gjeld"
            element={
              <ProtectedRoute>
                <ErrorBoundary fallback={(error, reset) => <FeatureErrorFallback error={error} reset={reset} featureName="Gjeld" />}>
                  <GjeldPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="pensjon"
            element={
              <ProtectedRoute>
                <ErrorBoundary fallback={(error, reset) => <FeatureErrorFallback error={error} reset={reset} featureName="Pensjon" />}>
                  <PensjonPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="kalkulatorer"
            element={
              <ProtectedRoute>
                <ErrorBoundary fallback={(error, reset) => <FeatureErrorFallback error={error} reset={reset} featureName="Kalkulatorer" />}>
                  <CalculatorsPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="kalkulatorer/rentes-rente"
            element={
              <ProtectedRoute>
                <ErrorBoundary fallback={(error, reset) => <FeatureErrorFallback error={error} reset={reset} featureName="Rentes Rente" />}>
                  <CompoundCalculatorPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="kalkulatorer/fire"
            element={
              <ProtectedRoute>
                <ErrorBoundary fallback={(error, reset) => <FeatureErrorFallback error={error} reset={reset} featureName="F.I.R.E." />}>
                  <FireCalculatorPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="kalkulatorer/lan"
            element={
              <ProtectedRoute>
                <ErrorBoundary fallback={(error, reset) => <FeatureErrorFallback error={error} reset={reset} featureName="Lånekalkulator" />}>
                  <LoanCalculatorPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="kalkulatorer/monte-carlo"
            element={
              <ProtectedRoute>
                <ErrorBoundary fallback={(error, reset) => <FeatureErrorFallback error={error} reset={reset} featureName="Monte Carlo" />}>
                  <MonteCarloPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          {/* Redirects from old calculator routes to new Norwegian names */}
          <Route path="kalkulatorer/compound" element={<Navigate to="/kalkulatorer/rentes-rente" replace />} />
          <Route path="kalkulatorer/loan" element={<Navigate to="/kalkulatorer/lan" replace />} />
          <Route
            path="okonomi"
            element={
              <ProtectedRoute>
                <ErrorBoundary fallback={(error, reset) => <FeatureErrorFallback error={error} reset={reset} featureName="Min Økonomi" />}>
                  <EconomyPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="min-okonomi"
            element={
              <ProtectedRoute>
                <ErrorBoundary fallback={(error, reset) => <FeatureErrorFallback error={error} reset={reset} featureName="Min Økonomi" />}>
                  <EconomyPage />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          {/* Redirect from old English route to Norwegian */}
          <Route path="economy" element={<Navigate to="/okonomi" replace />} />
          {/* Legacy route redirects */}
          <Route path="calculators" element={<Navigate to="/kalkulatorer" replace />} />
          <Route path="dashboard" element={<Navigate to="/oversikt" replace />} />
          <Route path="portfolio" element={<Navigate to="/portefolje" replace />} />
          <Route path="login" element={<Navigate to="/oversikt" replace />} />
          {/* 404 - Not Found */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
