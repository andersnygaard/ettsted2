# 141-BUG: Dashboard vs Sparing Page Data Mismatch

## Summary
The "Sum Sparing" value differs drastically between Dashboard and Sparing page:
- Dashboard: 1,125,000.00 kr
- Sparing page: 90,800.00 kr

These should show the same value for the same metric.

## Context
Both pages display "SUM SPARING" but fetch data differently:
- Dashboard uses `useDashboardData()` hook
- Sparing uses `useSparingData()` hook

The data sources are likely calculating or filtering differently.

## Acceptance Criteria
- [ ] Dashboard and Sparing page show identical "Sum Sparing" values
- [ ] Values match the portfolio table totals
- [ ] Single source of truth for aggregate calculations

## Technical Approach
1. Compare `useDashboardData` and `useSparingData` implementations
2. Trace API endpoints being called
3. Verify backend aggregation logic
4. Consider creating shared hook for common metrics

## Files to Investigate
- [useDashboardData.ts](frontend/src/features/dashboard/useDashboardData.ts)
- [useSparingData.ts](frontend/src/features/sparing/useSparingData.ts)
- Backend aggregation endpoints

## Priority
Critical

## Effort
Medium (2-4 hours)

## Labels
bug, data, consistency, critical
