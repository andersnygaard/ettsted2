# 143-BUG: Monte Carlo Simulation Results Panel Empty

## Summary
The Monte Carlo calculator page shows input fields but the results panel on the right side is completely empty. No visualization, no success probability, no simulation results displayed.

## Context
Screenshot shows:
- Left panel: All input fields present (portfolio value, annual withdrawal, years, return rate, volatility)
- "Kjør simulering" button visible
- Right panel: EMPTY (should show simulation results and chart)
- Explanatory text mentions "0,0% sannsynlighet" suggesting simulation ran but UI didn't render

## Acceptance Criteria
- [ ] Simulation results display after clicking "Kjør simulering"
- [ ] Success probability percentage shown
- [ ] Distribution chart or confidence bands rendered
- [ ] Results update when inputs change

## Technical Approach
1. Check if simulation API is being called
2. Verify response data structure
3. Check conditional rendering of results panel
4. Compare with other calculator pages that work

## Files to Investigate
- [MonteCarloPage.tsx](frontend/src/features/calculators/MonteCarloPage.tsx)
- Backend /calculators/monte-carlo endpoint
- Any MonteCarloResults component

## Priority
High

## Effort
Medium (2-4 hours)

## Labels
bug, calculator, simulation
