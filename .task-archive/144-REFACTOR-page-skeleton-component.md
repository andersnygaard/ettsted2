# 145-REFACTOR: Create Shared PageSkeleton Component

## Summary
Each page has its own wrapper class and layout structure (sparing-page, gjeld-page, portfolio-page, etc.) with inconsistent patterns. Need a shared PageSkeleton component to guarantee consistent experience across all pages.

## Context
Current state:
- DashboardPage: `<div className="dashboard-page">` (no container, no breadcrumb)
- SparingPage: `<main className="sparing-page"><div className="container container--narrow">`
- GjeldPage: `<main className="gjeld-page"><div className="container container--narrow">`
- CalculatorsPage: `<main className="calculators-page"><div className="container container--narrow">`

This leads to:
- Inconsistent spacing and layout
- Duplicate container code
- Harder to maintain global changes

## Acceptance Criteria
- [x] Create PageSkeleton component with standard structure
- [x] Include optional breadcrumb slot
- [x] Include PageHeader integration
- [x] Consistent container wrapper
- [x] Migrate all pages to use PageSkeleton
- [x] Remove duplicate page wrapper CSS (not needed - minimal CSS in PageSkeleton)

## Technical Approach
```tsx
<PageSkeleton
  breadcrumb={[...]}
  title="Sparing"
  subtitle="Din vei mot økonomisk frihet"
  centered={false}
>
  {/* Page content */}
</PageSkeleton>
```

1. Create PageSkeleton in components library
2. Include: container, breadcrumb, PageHeader
3. Migrate pages one by one
4. Remove redundant CSS

## Files to Create/Modify
- Create: `components/src/layout/PageSkeleton/`
- Modify: All *Page.tsx files in frontend/src/features/

## Priority
High

## Effort
Large (4-6 hours)

## Labels
refactor, architecture, consistency
