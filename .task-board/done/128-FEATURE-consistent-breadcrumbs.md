# 128-FEATURE: Consistent Breadcrumbs Across Pages

**Priority**: Medium
**Effort**: Small (30 min)
**Labels**: frontend, navigation, consistency

---

## Context

Main content pages should consistently show breadcrumb navigation:
- Portefølje
- Sparing
- Gjeld
- Pensjon
- Kalkulatorer
- Individual calculator pages

This helps users understand their location and navigate back.

---

## Acceptance Criteria

- [x] Portefølje page has breadcrumb: `Hjem > Portefølje`
- [x] Sparing page has breadcrumb: `Hjem > Sparing`
- [x] Gjeld page has breadcrumb: `Hjem > Gjeld`
- [x] Pensjon page has breadcrumb: `Hjem > Pensjon`
- [x] Kalkulatorer page has breadcrumb: `Hjem > Kalkulatorer`
- [x] Individual calculators already have breadcrumbs (verify consistent format)

---

## Technical Approach

Import `Breadcrumb` from `@finans/components` and add to each page.

```tsx
<Breadcrumb
  items={[
    { label: 'Hjem', path: '/dashboard' },
    { label: 'Sparing' },
  ]}
/>
```

---

## Files to Modify

- [PortfolioPage.tsx](frontend/src/features/portfolio/PortfolioPage.tsx)
- [SparingPage.tsx](frontend/src/features/sparing/SparingPage.tsx)
- [GjeldPage.tsx](frontend/src/features/gjeld/GjeldPage.tsx)
- [PensjonPage.tsx](frontend/src/features/pensjon/PensjonPage.tsx)
- [CalculatorsPage.tsx](frontend/src/features/calculators/CalculatorsPage.tsx)

---

## Notes

- Current calculator subpages (compound, fire, loan, monte-carlo) already have breadcrumbs
- Use consistent "Hjem" as root label (not "Oversikt" or "Dashboard")

---

## Implementation Notes

**Completed**: All main content pages now have consistent breadcrumb navigation.

**Changes made**:
1. Added `Breadcrumb` import to: SparingPage, GjeldPage, PensjonPage, CalculatorsPage
2. Updated PortfolioPage breadcrumbs from 'Oversikt' to 'Hjem' with path '/dashboard'
3. Fixed CalculatorsPage PageHeader by removing invalid 'centered' prop
4. All individual calculator pages (CompoundCalculatorPage, FireCalculatorPage, LoanCalculatorPage, MonteCarloPage) already had breadcrumbs

**Build & Lint Status**:
- Frontend build: ✓ Success
- Lint: ✓ Passed (no new warnings)
