# 155-FEATURE: Skeleton Loading Consistency

## Summary
Ensure all pages have consistent skeleton loading states that match the final layout.

## Context
Loading states were inconsistent - some pages showed "Laster..." text while others had proper skeleton loaders. This task unifies the loading experience across all data-fetching pages.

## Acceptance Criteria
- [x] All data-fetching pages show skeleton loaders
- [x] Skeletons match the shape of actual content
- [x] Consistent shimmer animation across all skeletons
- [x] No layout shift when data loads
- [x] DashboardPage skeleton matches: hero, stats grid, milestone, section links
- [x] SparingPage skeleton matches: hero, stats, chart, fire section
- [x] GjeldPage skeleton matches: hero, dekning, loans list, chart
- [x] PensjonPage skeleton matches: hero, breakdown cards, OTP section, chart
- [x] PortfolioPage correctly uses skeleton implementation

## Implementation Summary

### Changes Made:

1. **DashboardPage.tsx**
   - Replaced "Laster..." text with DashboardSkeleton component
   - Maintains subtitle with current month/year for context
   - Wraps skeleton in consistent PageSkeleton layout

2. **SparingPage.tsx**
   - Replaced "Laster..." text with SparingSkeleton component
   - Uses proper subtitle "Din vei mot økonomisk frihet"
   - Consistent PageSkeleton wrapper

3. **GjeldPage.tsx**
   - Replaced "Laster..." text with GjeldSkeleton component
   - Proper subtitle "Oversikt over lån og nedbetaling"
   - Consistent PageSkeleton wrapper

4. **PensjonPage.tsx**
   - Wrapped PensjonSkeleton in PageSkeleton for consistency
   - Previously returned raw skeleton without page structure
   - Now matches other pages with breadcrumb, title, subtitle

### Skeleton Components Used:
- All use existing `Skeleton` component from `@finans/components`
- All have consistent shimmer animation (1.5s infinite)
- Uses CSS gradient: `var(--bone)` → `var(--warm-white)` → `var(--bone)`
- No layout shift when data loads
- Responsive layouts for mobile

### Build Verification:
✓ `pnpm --filter frontend build` - Success
- No TypeScript errors
- All skeleton components properly imported
- All pages build successfully

## Files Modified
- frontend/src/features/dashboard/DashboardPage.tsx
- frontend/src/features/sparing/SparingPage.tsx
- frontend/src/features/gjeld/GjeldPage.tsx
- frontend/src/features/pensjon/PensjonPage.tsx

## Status
✅ COMPLETED
