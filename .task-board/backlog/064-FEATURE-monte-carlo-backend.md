# FEATURE: Monte Carlo Backend Endpoint

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: Medium
**Labels**: backend, calculators, api
**Estimated Effort**: Medium - 2-3 hours

## Context & Motivation

Monte Carlo simulations are computationally intensive. Running them on the backend ensures consistent performance and can leverage server-side optimizations.

## Reference

CLAUDE.md API design for calculators

## Desired Outcome

Backend endpoint for running Monte Carlo simulations.

## Acceptance Criteria

- [ ] Create `POST /api/v1/calculators/monte-carlo` endpoint
- [ ] Validate input parameters
- [ ] Run configurable number of simulations (default 1000)
- [ ] Return success rate, percentile bands, and sample scenarios
- [ ] Rate limit to 10 requests/minute (expensive operation)
- [ ] Execution time under 5 seconds for 1000 simulations

## Technical Approach

```typescript
// routes/calculatorRoutes.ts
router.post('/monte-carlo', calculatorRateLimiter, async (req, res) => {
  const { portfolioValue, annualWithdrawal, years, expectedReturn, volatility, simulations = 1000 } = req.body;

  // Validate inputs
  if (!portfolioValue || !annualWithdrawal || !years) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const result = runMonteCarloSimulation({
    portfolioValue,
    annualWithdrawal,
    years,
    expectedReturn: expectedReturn / 100,
    volatility: volatility / 100,
    simulations: Math.min(simulations, 10000) // Cap at 10k
  });

  res.json({ data: result, success: true });
});

// services/calculatorService.ts
function runMonteCarloSimulation(params: MonteCarloParams): MonteCarloResult {
  const { portfolioValue, annualWithdrawal, years, expectedReturn, volatility, simulations } = params;

  const results: number[] = [];
  const scenarios: number[][] = [];

  for (let sim = 0; sim < simulations; sim++) {
    let balance = portfolioValue;
    const yearlyBalances: number[] = [balance];

    for (let year = 0; year < years; year++) {
      // Random return based on normal distribution
      const annualReturn = randomNormal(expectedReturn, volatility);
      balance = balance * (1 + annualReturn) - annualWithdrawal;
      yearlyBalances.push(Math.max(0, balance));

      if (balance <= 0) break;
    }

    results.push(yearlyBalances[yearlyBalances.length - 1]);

    // Keep sample of scenarios for visualization
    if (sim < 100) {
      scenarios.push(yearlyBalances);
    }
  }

  // Calculate success rate and percentiles
  const successRate = results.filter(r => r > 0).length / simulations * 100;
  const sorted = [...results].sort((a, b) => a - b);

  return {
    successRate: Math.round(successRate),
    percentile10: sorted[Math.floor(simulations * 0.1)],
    percentile25: sorted[Math.floor(simulations * 0.25)],
    percentile50: sorted[Math.floor(simulations * 0.5)],
    percentile75: sorted[Math.floor(simulations * 0.75)],
    percentile90: sorted[Math.floor(simulations * 0.9)],
    scenarios,
    simulationsRun: simulations
  };
}
```

## Dependencies

- Backend infrastructure (complete)
- Rate limiter middleware (complete)

---

**Next Steps**: Implement when Monte Carlo page needed
