# 160-BUG: Dashboard Missing Breadcrumb

## Summary
Dashboard page lacks a breadcrumb component while all other authenticated pages (Sparing, Gjeld, Pensjon, Calculators, Portfolio) have them. This breaks navigation consistency.

## Status
COMPLETED

## Solution Implemented
Added Breadcrumb component to DashboardPage showing "Oversikt" as the current page. Since Dashboard is the root/home page, the breadcrumb displays only the current page label without a "Hjem" link (to avoid circular navigation).

## Changes Made
1. **Frontend**: `c:\code\ettsted2\frontend\src\features\dashboard\DashboardPage.tsx`
   - Import: Added `Breadcrumb` to imports from `@finans/components`
   - Rendering: Added `<Breadcrumb items={[{ label: 'Oversikt' }]} />` before PageHeader
   - Pattern follows navigation hierarchy: Dashboard is root, so no parent link

## Verification
- Build: `pnpm --filter frontend build` completed successfully
- TypeScript: No type errors
- All 879 modules transformed, bundle size within expected ranges

## Acceptance Criteria
- [x] Dashboard has breadcrumb OR documented exception
- [x] Visual consistency with other pages
- [x] "Oversikt" shows in breadcrumb (as root page)

## Labels
bug, consistency, navigation
