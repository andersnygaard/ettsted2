# FEATURE: Update Frontend Routes

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: High
**Labels**: frontend, routing
**Estimated Effort**: Simple - 30 minutes

## Context & Motivation

Add routes for all new pages (Sparing, Gjeld, Pensjon, individual calculators).

## Reference

Design navigation structure

## Desired Outcome

Complete routing for all pages.

## Acceptance Criteria

- [ ] Update `/frontend/src/routes/index.tsx`
- [ ] Add `/sparing` route → SparingPage
- [ ] Add `/gjeld` route → GjeldPage
- [ ] Add `/pensjon` route → PensjonPage
- [ ] Add `/kalkulatorer/compound` route → CompoundCalculatorPage
- [ ] Add `/kalkulatorer/fire` route → FireCalculatorPage
- [ ] Add `/kalkulatorer/loan` route → LoanCalculatorPage
- [ ] Add `/kalkulatorer/monte-carlo` route → MonteCarloPage
- [ ] All routes inside authenticated Layout

## Technical Approach

```tsx
// routes/index.tsx
export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="sparing" element={<SparingPage />} />
        <Route path="gjeld" element={<GjeldPage />} />
        <Route path="pensjon" element={<PensjonPage />} />
        <Route path="kalkulatorer" element={<CalculatorsPage />} />
        <Route path="kalkulatorer/compound" element={<CompoundCalculatorPage />} />
        <Route path="kalkulatorer/fire" element={<FireCalculatorPage />} />
        <Route path="kalkulatorer/loan" element={<LoanCalculatorPage />} />
        <Route path="kalkulatorer/monte-carlo" element={<MonteCarloPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
```

## Dependencies

- All page components created

---

**Next Steps**: Update as pages are implemented
