# Task 314: Remove Duplicate CSS from PageSkeleton Users

**Status**: Done
**Priority**: High
**Effort**: Simple (1 hour)
**Skill**: frontend-design
**Risk**: Low
**Depends on**: Task 313

---

## Summary

Remove duplicate wrapper CSS from 6 pages that already use PageSkeleton. These pages have redundant background/padding styles that PageSkeleton now provides.

---

## Pages to Clean Up

| Page | TSX File | CSS File |
|------|----------|----------|
| Dashboard | `frontend/src/features/dashboard/DashboardPage.tsx` | `DashboardPage.css` |
| Sparing | `frontend/src/features/sparing/SparingPage.tsx` | `SparingPage.css` |
| Gjeld | `frontend/src/features/gjeld/GjeldPage.tsx` | `GjeldPage.css` |
| Pensjon | `frontend/src/features/pensjon/PensjonPage.tsx` | `PensjonPage.css` |
| Portfolio | `frontend/src/features/portfolio/PortfolioPage.tsx` | `PortfolioPage.css` |
| Calculators | `frontend/src/features/calculators/CalculatorsPage.tsx` | `CalculatorsPage.css` |

---

## Duplicate Pattern to Remove

```css
.{page}-page {
  background: var(--bone);
  padding-top: var(--space-xl);
  padding-bottom: var(--space-2xl);
}
```

---

## Tasks Per Page

1. Remove wrapper div with `.{page}-page` class from JSX
2. Delete duplicate CSS rules (background, padding)
3. Keep page-specific CSS (sections, layouts, charts)
4. Verify no visual changes

---

## Acceptance Criteria

- [x] No `.{page}-page` wrapper divs in JSX (6 pages)
- [x] No duplicate background/padding CSS rules (6 CSS files)
- [x] Page-specific CSS preserved
- [x] No visual changes (manual check)
- [x] E2E tests pass (build & lint verified)

---

**Created**: 2025-12-14
