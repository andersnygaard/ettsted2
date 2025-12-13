---
paths:
  - frontend/**/*
---

# Routing Rules

## Stack
react-router-dom v6, lazy loading, Suspense

## Structure
- `/routes/index.tsx` - All routes with guards and error boundaries
- `/features/auth/ProtectedRoute.tsx` - Auth guard
- `/features/auth/OnboardingRoute.tsx` - Onboarding guard
- `/shared/components/Layout.tsx` - Shell with nav/header

## Patterns

### Route Definition
```tsx
// Lazy load pages for code splitting
const DashboardPage = lazy(() => import('../features/dashboard/DashboardPage'));

// Protected route with error boundary
<Route
  path="oversikt"
  element={
    <ProtectedRoute>
      <ErrorBoundary fallback={(error, reset) =>
        <FeatureErrorFallback error={error} reset={reset} featureName="Dashboard" />
      }>
        <DashboardPage />
      </ErrorBoundary>
    </ProtectedRoute>
  }
/>
```

### Route Naming
Norwegian names with æøå replaced by aoa:
- `/oversikt` - Dashboard
- `/portefolje` - Portfolio
- `/kalkulatorer` - Calculators
- `/okonomi` - My Economy settings

### Legacy Redirects
```tsx
<Route path="dashboard" element={<Navigate to="/oversikt" replace />} />
<Route path="portfolio" element={<Navigate to="/portefolje" replace />} />
<Route path="calculators" element={<Navigate to="/kalkulatorer" replace />} />
```

### Guards
```tsx
// ProtectedRoute - redirects to / if not authenticated
// OnboardingRoute - redirects to /oversikt if already onboarded, allows if needsOnboarding
```

## Routes

| Path | Page | Guard | Description |
|------|------|-------|-------------|
| `/` | HomePage | None | Landing page |
| `/oversikt` | DashboardPage | Protected | Dashboard with net worth |
| `/portefolje` | PortfolioPage | Protected | Spreadsheet data entry |
| `/sparing` | SparingPage | Protected | Savings breakdown |
| `/gjeld` | GjeldPage | Protected | Debt tracking |
| `/pensjon` | PensjonPage | Protected | Pension overview |
| `/kalkulatorer` | CalculatorsPage | Protected | Calculator index |
| `/kalkulatorer/*` | Calculator pages | Protected | Compound, FIRE, Loan, Monte Carlo |
| `/okonomi` | EconomyPage | Protected | User settings via wizard |
| `/import` | ImportPage | Protected | LLM chat import |
| `/onboarding` | OnboardingPage | Onboarding | First-time setup |
| `/auth/callback` | PostLoginPage | None | OAuth callback handler |

## Decisions
- All protected routes wrapped with ErrorBoundary
- Lazy loading for all page components
- Norwegian route names (no English alternatives kept)
- 404 redirects to home page

## Gotchas
- **Layout outlet**: Pages render inside Layout via `<Outlet />`
- **Suspense fallback**: Uses LoadingSpinner during chunk load
- **Guard order**: ProtectedRoute checks auth BEFORE ErrorBoundary catches errors
