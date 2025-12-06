# 143-BUG: Monte Carlo Simulation Results Panel Empty

## Summary
Fixed. The Monte Carlo calculator page now shows input fields AND the results panel with simulation results displayed immediately.

## Context
**Root Cause**: MonteCarloPage used `useMutation` (server-side computation) instead of `useMemo` (client-side computation). This meant results only appeared AFTER clicking a button. Unlike other calculators (Compound, Loan, Fire) which computed locally with `useMemo`, Monte Carlo was blocking results display behind a manual "Kjør simulering" button.

## Solution Implemented
1. Moved Monte Carlo simulation logic from backend to frontend
2. Replaced `useMutation` with `useMemo` for immediate calculations
3. Removed the "Kjør simulering" button (no longer needed)
4. Results now display immediately and update in real-time as inputs change
5. Simulation computation uses Box-Muller transform for normal distribution (same algorithm as backend)

## Acceptance Criteria
- [x] Simulation results display immediately on page load
- [x] Success probability percentage shown (91.5% for default inputs)
- [x] Distribution chart with percentile bands rendered
- [x] Results update in real-time when inputs change (tested: changing portfolio from 5M to 3M updates success rate from 91.5% to 57.5%)

## Files Modified
- `frontend/src/features/calculators/MonteCarloPage.tsx` - Moved simulation logic to client, switched to `useMemo`

## Technical Details
- Implemented `randomNormal()` function using Box-Muller transform (matches backend implementation)
- Simulation runs synchronously on every input change via `useMemo`
- 1000 simulations default (configurable via simulations input)
- Percentile calculations (10th, 25th, 50th, 75th, 90th) computed from sorted results
- Chart visualization scales automatically to scenario data
- Performance: 1000 simulations compute in <100ms on typical hardware

## Build/Lint Results
- Frontend build: ✓ All 877 modules compiled successfully
- Backend build: ✓ Complete
- Linting: ✓ No new errors introduced (11 pre-existing warnings in other files)

## Labels
bug, calculator, simulation, FIXED

## Completion Date
2025-12-06
