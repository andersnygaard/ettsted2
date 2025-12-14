# Task 315: Migrate Calculator Pages to PageSkeleton

**Status**: Backlog
**Priority**: Medium
**Effort**: Medium (2 hours)
**Skill**: frontend-design
**Risk**: Medium
**Depends on**: Task 313

---

## Summary

Migrate 4 calculator pages to use PageSkeleton for consistent layout and structure.

---

## Pages to Migrate

| Page | TSX File | CSS File |
|------|----------|----------|
| F.I.R.E. | `frontend/src/features/calculators/FireCalculatorPage.tsx` | `FireCalculatorPage.css` |
| Compound | `frontend/src/features/calculators/CompoundCalculatorPage.tsx` | `CompoundCalculatorPage.css` |
| Loan | `frontend/src/features/calculators/LoanCalculatorPage.tsx` | `LoanCalculatorPage.css` |
| Monte Carlo | `frontend/src/features/calculators/MonteCarloPage.tsx` | `MonteCarloPage.css` |

---

## Implementation Per Page

1. Import PageSkeleton from `@finans/components`
2. Wrap content:
   ```tsx
   <PageSkeleton
     title="[Page Title]"
     breadcrumb={[
       { label: 'Kalkulatorer', href: '/kalkulatorer' },
       { label: '[Current Page]' }
     ]}
   >
     {/* existing content */}
   </PageSkeleton>
   ```
3. Remove duplicate layout CSS (background, padding, min-height)
4. Keep calculator-specific CSS (forms, results, charts)
5. Verify visual parity

---

## Research During Implementation

- [ ] Check current breadcrumb/title patterns
- [ ] Compare with `CalculatorsPage.tsx` (already uses PageSkeleton)
- [ ] Identify special layout needs per page

---

## Acceptance Criteria

- [ ] All 4 calculator pages use PageSkeleton
- [ ] Consistent breadcrumb structure
- [ ] No visual regressions
- [ ] E2E calculator tests pass
- [ ] CSS files cleaned of duplicate layout styles

---

**Created**: 2025-12-14
