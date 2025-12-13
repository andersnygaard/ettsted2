# REFACTOR: Centralize Animation Keyframes

**Status**: In Progress
**Created**: 2025-12-05
**Started**: 2025-12-05
**Priority**: Low
**Labels**: frontend, css, design-system, cleanup
**Estimated Effort**: Simple - 0.5 day

## Acceptance Criteria

- [x] All duplicate `@keyframes fadeUp` removed from feature CSS files
- [x] `animations.css` imported via `global.css` (already done)
- [x] Animations still work correctly on all pages
- [x] No duplicate keyframe definitions remain
- [x] Build passes

## Files Updated

Removed `@keyframes fadeUp` from:
- `frontend/src/features/portfolio/PortfolioPage.css` (lines 37-46 removed)
- `frontend/src/features/dashboard/DashboardPage.css` (lines 227-236 removed)
- `frontend/src/features/import/ImportPage.css` (lines 85-94 removed)
- `frontend/src/features/dashboard/QuickStatsGrid.css` (lines 36-45 removed)

Kept only in:
- `frontend/src/styles/animations.css` (source of truth)

## Progress Log

- 2025-12-05 - Task moved to in-progress
- 2025-12-05 - Completed: All duplicates removed. Verified with grep that only animations.css contains @keyframes fadeUp. Frontend build successful (Vite compiled without CSS errors).
