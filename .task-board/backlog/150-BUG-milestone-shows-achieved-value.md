# 151-BUG: Dashboard Milestone Shows Already-Achieved Value

## Summary
Dashboard shows "Neste milepæl: 100 000,00 kr" at 100% progress when user's savings exceed 1M kr. Should show the NEXT unachieved milestone, not one already passed.

## Context
Screenshot shows:
- Sum Sparing: 1,125,000 kr
- Neste milepæl: 100,000 kr
- Progress: 100%
- Gjenstår: 0,00 kr

When savings > 1M, the next milestone should be something like 1.5M or 2M, not 100k which was passed long ago.

## Acceptance Criteria
- [ ] Milestone shows next UNACHIEVED target
- [ ] Progress calculated toward next target
- [ ] Milestone progression: 100k → 250k → 500k → 1M → 1.5M → 2M → etc.
- [ ] "Gjenstår" shows remaining to next milestone

## Technical Approach
1. Find milestone calculation logic
2. Implement milestone ladder (array of milestone values)
3. Find first milestone > current savings
4. Calculate progress toward that milestone

## Files to Modify
- [DashboardPage.tsx](frontend/src/features/dashboard/DashboardPage.tsx)
- [useDashboardData.ts](frontend/src/features/dashboard/useDashboardData.ts)
- Backend dashboard endpoint if milestone is calculated server-side

## Priority
Medium

## Effort
Medium (2-3 hours)

## Labels
bug, logic, ux
