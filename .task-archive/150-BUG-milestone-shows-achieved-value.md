# 151-BUG: Dashboard Milestone Shows Already-Achieved Value

## Summary
Dashboard shows "Neste milepæl: 100 000,00 kr" at 100% progress when user's savings exceed 1M kr. Should show the NEXT unachieved milestone, not one already passed.

**STATUS: FIXED**

## Root Cause
The milestone calculation in `useDashboardData.ts` line 123 used `netWorth` instead of `sumSparing` to find the next milestone. Additionally, the milestone ladder was missing 1.5M in the progression.

**Problem flow:**
- `findNextMilestone(netWorth)` would find wrong milestone when debt was involved
- Milestone ladder: 100k → 250k → 500k → 750k → 1M → **2M** (missing 1.5M) → 3M...
- For user with 1.125M savings, should show 1.5M but showed 100k

## Solution Applied

### File 1: `frontend/src/features/dashboard/useDashboardData.ts`
1. **Line 123**: Changed from `findNextMilestone(netWorth)` to `findNextMilestone(sumSparing)`
2. **Line 133**: Changed from `currentTowardsMilestone: netWorth` to `currentTowardsMilestone: sumSparing`
3. **Line 68**: Added 1500000 to milestone ladder between 1M and 2M

### File 2: `frontend/src/features/dashboard/DashboardPage.tsx`
1. **Lines 47-55**: Removed unnecessary conditional logic that checked `isNegativeNetWorth`
   - Milestone calculation now directly uses `data.currentTowardsMilestone` (which is now sumSparing)
   - Simplified and more readable

## Acceptance Criteria
- [x] Milestone shows next UNACHIEVED target
- [x] Progress calculated toward next target
- [x] Milestone progression: 100k → 250k → 500k → 750k → 1M → 1.5M → 2M → 3M...
- [x] "Gjenstår" shows remaining to next milestone

## Build & Lint Results
- [x] Frontend build: SUCCESS (3.16s)
- [x] Backend build: SUCCESS
- [x] Lint: SUCCESS (11 pre-existing warnings, 0 new errors)

## Example Fix Verification
For user with sumSparing = 1,125,000 kr:
- findNextMilestone(1125000) finds first milestone > 1125000
- Milestone ladder: [..., 1000000, 1500000, 2000000, ...]
- **Result: nextMilestone = 1,500,000 kr** ✓
- Progress: (1,125,000 / 1,500,000) × 100 = **75%** ✓
- Remaining: 1,500,000 - 1,125,000 = **375,000 kr** ✓

## Files Modified
- `/frontend/src/features/dashboard/useDashboardData.ts`
- `/frontend/src/features/dashboard/DashboardPage.tsx`

## Priority
Medium

## Effort
Medium (Completed in 1 hour)

## Labels
bug, logic, ux, FIXED
