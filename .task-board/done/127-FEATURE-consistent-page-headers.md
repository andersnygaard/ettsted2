# 127-FEATURE: Consistent Page Headers Alignment

**Priority**: Medium
**Effort**: Small (30 min)
**Labels**: frontend, css, consistency

---

## Context

Page headers (title + subtitle) should be consistently left-aligned on:
- Portefølje
- Sparing
- Gjeld
- Pensjon
- Kalkulatorer

Some pages may have centered headers while others are left-aligned. Need to audit and standardize.

---

## Acceptance Criteria

- [x] All main pages have left-aligned page headers
- [x] Calculator landing page may keep centered (intentional design choice)
- [x] Individual calculator pages use left-aligned headers
- [x] Consistent use of `PageHeader` component with/without `centered` prop

---

## Technical Approach

1. Audit all pages using `PageHeader` component
2. Remove `centered` prop where not intentional
3. Verify CSS doesn't override alignment

---

## Files to Review

- [PortfolioPage.tsx](frontend/src/features/portfolio/PortfolioPage.tsx)
- [SparingPage.tsx](frontend/src/features/sparing/SparingPage.tsx)
- [GjeldPage.tsx](frontend/src/features/gjeld/GjeldPage.tsx)
- [PensjonPage.tsx](frontend/src/features/pensjon/PensjonPage.tsx)
- [CalculatorsPage.tsx](frontend/src/features/calculators/CalculatorsPage.tsx)
- [CompoundCalculatorPage.tsx](frontend/src/features/calculators/CompoundCalculatorPage.tsx)
- [MonteCarloPage.tsx](frontend/src/features/calculators/MonteCarloPage.tsx)
- [FireCalculatorPage.tsx](frontend/src/features/calculators/FireCalculatorPage.tsx)
- [LoanCalculatorPage.tsx](frontend/src/features/calculators/LoanCalculatorPage.tsx)

---

## Implementation Summary

### Changes Made

1. **PageHeader.tsx** - Added `centered?: boolean` prop (defaults to false)
   - Component now renders with className modifier `page-header--centered` when centered=true

2. **PageHeader.css** - Updated alignment defaults
   - Changed base `.page-header` text-align from `center` to `left`
   - Added `.page-header--centered` class for intentional centering

3. **CalculatorsPage.tsx** - Added `centered` prop
   - Intentionally kept centered as per design choice for landing page

4. **All Other Pages** - Default to left-aligned
   - PortfolioPage, SparingPage, GjeldPage, PensjonPage
   - CompoundCalculatorPage, MonteCarloPage, FireCalculatorPage, LoanCalculatorPage
   - No changes needed - they default to left-aligned now

### Build & Lint Status

- Frontend build: ✓ Success
- Linting: ✓ No new errors (15 pre-existing warnings unrelated to changes)

---

## PageHeader Props

```tsx
// Left-aligned (default)
<PageHeader
  title="Sparing"
  subtitle="Din vei mot økonomisk frihet"
/>

// Centered (intentional)
<PageHeader
  title="Kalkulatorer"
  subtitle="Verktøy for å planlegge din økonomi"
  centered
/>
```
