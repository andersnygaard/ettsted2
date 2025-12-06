# 161-BUG: Dashboard Missing Container Wrapper

## Status
COMPLETED

## Summary
Dashboard page didn't use the `.container.container--narrow` wrapper that all other pages use. This caused inconsistent max-width and padding across the app.

## Changes Made
1. Wrapped entire dashboard content in `<div className="container container--narrow">`
2. Changed root element from `<div className="dashboard-page">` to `<main className="dashboard-page">`
3. Applied changes to all three render paths (loading, error, success)
4. Verified build compiles successfully

## Acceptance Criteria
- [x] Dashboard uses consistent container wrapper
- [x] Max-width matches other pages (SparingPage, GjeldPage pattern)
- [x] All content properly indented within container

## Technical Details
Updated `DashboardPage.tsx` to match pattern used in other pages:
- Replaced root `<div>` with `<main>` element for semantic HTML
- Added container wrapper to all three render paths
- No CSS changes needed (container styles already exist)

## Build Status
✓ Frontend builds successfully with no errors or warnings

## Files Modified
- `/frontend/src/features/dashboard/DashboardPage.tsx`

## Labels
bug, consistency, layout
