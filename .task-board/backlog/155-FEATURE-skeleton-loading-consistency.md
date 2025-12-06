# 129-FEATURE: Skeleton Loading Consistency

## Summary
Ensure all pages have consistent skeleton loading states that match the final layout. Some pages show text ("Laster...") while others may have skeletons.

## Context
Loading states vary across pages:
- Some show Placeholder component
- Some show text messages
- Skeleton component exists but may not be used everywhere

Consistent skeleton loading improves perceived performance and reduces layout shift.

## Acceptance Criteria
- [ ] All data-fetching pages show skeleton loaders
- [ ] Skeletons match the shape of actual content
- [ ] Consistent shimmer animation across all skeletons
- [ ] No layout shift when data loads
- [ ] DashboardPage skeleton matches: hero, stats grid, milestone, section links
- [ ] SparingPage skeleton matches: hero, stats, chart, fire section

## Technical Approach
1. Audit all pages with data fetching
2. Create page-specific skeleton compositions
3. Use existing Skeleton component from components library
4. Add skeleton variants for different shapes (text, circle, rectangle)

## Files to Modify
- [DashboardPage.tsx](frontend/src/features/dashboard/DashboardPage.tsx)
- [SparingPage.tsx](frontend/src/features/sparing/SparingPage.tsx)
- [GjeldPage.tsx](frontend/src/features/gjeld/GjeldPage.tsx)
- [PensjonPage.tsx](frontend/src/features/pensjon/PensjonPage.tsx)
- [PortfolioPage.tsx](frontend/src/features/portfolio/PortfolioPage.tsx)

## Priority
Medium

## Effort
Medium (4-5 hours)

## Labels
design, ux, loading, consistency
