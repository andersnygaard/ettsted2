import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../shared/components/Layout';
import ProtectedRoute from '../features/auth/ProtectedRoute';

// Lazy load page components for code splitting
const HomePage = lazy(() => import('../features/dashboard/HomePage'));
const DashboardPage = lazy(() => import('../features/dashboard/DashboardPage'));
const PortfolioPage = lazy(() => import('../features/portfolio/PortfolioPage'));
const SparingPage = lazy(() => import('../features/sparing/SparingPage'));
const GjeldPage = lazy(() => import('../features/gjeld/GjeldPage'));
const PensjonPage = lazy(() => import('../features/pensjon/PensjonPage'));
const CalculatorsPage = lazy(() => import('../features/calculators/CalculatorsPage'));
const CompoundCalculatorPage = lazy(() => import('../features/calculators/CompoundCalculatorPage'));
const FireCalculatorPage = lazy(() => import('../features/calculators/FireCalculatorPage'));
const LoanCalculatorPage = lazy(() => import('../features/calculators/LoanCalculatorPage'));
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
            path="sparing"
            element={<SparingPage />}
          />
          <Route
            path="gjeld"
            element={<GjeldPage />}
          />
          <Route
            path="pensjon"
            element={<PensjonPage />}
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
            path="kalkulatorer/compound"
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
            path="kalkulatorer/loan"
            element={
              <ProtectedRoute>
                <LoanCalculatorPage />
              </ProtectedRoute>
            }
          />
          {/* Legacy route redirect */}
          <Route path="calculators" element={<Navigate to="/kalkulatorer" replace />} />
          {/* 404 - Not Found */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
