# Portfolio: New Month Year Boundary Bug

**Status**: Done
**Completed**: 2025-12-10

## Problem
When creating a new month snapshot, the year dropdown doesn't include next year. User often wants to add next month in advance, but if current latest snapshot is December, they can't select January of next year.

## Scenario
1. Latest snapshot is December 2025
2. User clicks "Ny måned" to add January 2026
3. Year dropdown only shows 2025 (and earlier)
4. User cannot select 2026

## Expected Behavior
Year dropdown should include:
- All years with existing snapshots
- Next year (current year + 1) to allow advance entry

## Files to Update
- `frontend/src/features/portfolio/` - find month/year selector component
- Update year options to include next year

## Acceptance Criteria
- [x] Year dropdown includes next year when creating new snapshot
- [x] Can create January snapshot when latest is December of previous year

## Progress Log

### Fixed: Portfolio Year Boundary Bug

**Changes Made:**

1. **Updated `availableYears` generation** (line 75-79)
   - Extended year range from `2020..currentYear` to `2020..currentYear+1`
   - Now includes next year to allow advance snapshot entry

2. **Refactored `isMonthDisabled` logic** (line 83-103)
   - Old: Prevented any month beyond current date
   - New: Allows current year months up to current month + all next year months
   - Enables creating January snapshots when latest is December of current year

**File Modified:**
- `frontend/src/features/portfolio/NewMonthModal.tsx`

**Testing:**
- ✓ Frontend build passes (no TypeScript errors)
- ✓ Logic verified: years now include current + 1
- ✓ Month disable logic allows future months in next year
