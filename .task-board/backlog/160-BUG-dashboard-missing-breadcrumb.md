# 146-BUG: Dashboard Missing Breadcrumb

## Summary
Dashboard page lacks a breadcrumb component while all other authenticated pages (Sparing, Gjeld, Pensjon, Calculators, Portfolio) have them. This breaks navigation consistency.

## Context
Breadcrumb pattern on other pages:
```tsx
<Breadcrumb items={[
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Sparing' },
]} />
```

Dashboard should either:
1. Have a simple breadcrumb showing "Hjem" or "Oversikt"
2. Or explicitly opt-out as the root page

Currently it just omits the component entirely, which looks inconsistent.

## Acceptance Criteria
- [ ] Dashboard has breadcrumb OR documented exception
- [ ] Visual consistency with other pages
- [ ] Consider if "Oversikt" should show in breadcrumb

## Technical Approach
1. Add Breadcrumb to DashboardPage
2. Or update PageSkeleton (task 145) to handle root page case

## Files to Modify
- [DashboardPage.tsx](frontend/src/features/dashboard/DashboardPage.tsx)

## Priority
Low

## Effort
Simple (30 min)

## Labels
bug, consistency, navigation
