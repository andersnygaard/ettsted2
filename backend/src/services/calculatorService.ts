/**
 * Calculator Service
 *
 * Implements financial calculation logic:
 * - Monte Carlo retirement simulations
 */

/**
 * Parameters for Monte Carlo simulation
 */
export interface MonteCarloParams {
  portfolioValue: number;      // Starting portfolio value in NOK
  annualWithdrawal: number;    // Annual withdrawal amount in NOK
  years: number;               // Simulation period in years
  expectedReturn: number;      // Expected annual return (decimal, e.g., 0.07 for 7%)
  volatility: number;          // Return volatility (decimal, e.g., 0.15 for 15%)
  simulations: number;         // Number of simulations to run
}

/**
 * Result of Monte Carlo simulation
 */
export interface MonteCarloResult {
  successRate: number;         // Percentage of simulations that didn't run out of money
  percentile10: number;        // Final balance at 10th percentile
  percentile25: number;        // Final balance at 25th percentile
  percentile50: number;        // Final balance at 50th percentile (median)
  percentile75: number;        // Final balance at 75th percentile
  percentile90: number;        // Final balance at 90th percentile
  scenarios: number[][];       // Array of sample scenario paths (up to 100 scenarios)
  simulationsRun: number;      // Number of simulations actually run
}

/**
 * Generate a random number from normal distribution using Box-Muller transform
 * @param mean - Mean of the distribution
 * @param stdDev - Standard deviation of the distribution
 * @returns Random number from normal distribution
 */
function randomNormal(mean: number, stdDev: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z * stdDev;
}

/**
 * Run Monte Carlo retirement simulation
 *
 * Simulates portfolio growth/depletion over time with random returns.
 * Each simulation assumes:
 * - Annual returns follow a normal distribution
 * - Fixed annual withdrawal amount
 * - Portfolio stops growing once depleted
 *
 * @param params - Simulation parameters
 * @returns Simulation results with success rate and percentile bands
 */
export function runMonteCarloSimulation(params: MonteCarloParams): MonteCarloResult {
  const { portfolioValue, annualWithdrawal, years, expectedReturn, volatility, simulations } = params;

  const results: number[] = [];
  const scenarios: number[][] = [];

  // Run each simulation
  for (let sim = 0; sim < simulations; sim++) {
    let balance = portfolioValue;
    const yearlyBalances: number[] = [balance];

    // Simulate each year
    for (let year = 0; year < years; year++) {
      // Generate random return based on normal distribution
      const annualReturn = randomNormal(expectedReturn, volatility);

      // Apply return to balance
      balance = balance * (1 + annualReturn);

      // Apply withdrawal (only if balance is positive)
      if (balance > 0) {
        balance -= annualWithdrawal;
      }

      // Don't allow balance to go below zero
      balance = Math.max(0, balance);

      yearlyBalances.push(balance);

      // Stop simulation if balance depleted
      if (balance <= 0) {
        break;
      }
    }

    // Record final balance
    results.push(yearlyBalances[yearlyBalances.length - 1]);

    // Keep sample of scenarios (first 100) for frontend visualization
    if (sim < 100) {
      scenarios.push(yearlyBalances);
    }
  }

  // Calculate success rate (% of simulations that maintained positive balance)
  const successfulSimulations = results.filter(balance => balance > 0).length;
  const successRate = (successfulSimulations / simulations) * 100;

  // Sort results for percentile calculation
  const sorted = [...results].sort((a, b) => a - b);

  // Calculate percentiles
  const percentile10 = sorted[Math.floor(simulations * 0.1)] || 0;
  const percentile25 = sorted[Math.floor(simulations * 0.25)] || 0;
  const percentile50 = sorted[Math.floor(simulations * 0.5)] || 0;
  const percentile75 = sorted[Math.floor(simulations * 0.75)] || 0;
  const percentile90 = sorted[Math.floor(simulations * 0.9)] || 0;

  return {
    successRate: Math.round(successRate * 100) / 100, // Round to 2 decimal places
    percentile10,
    percentile25,
    percentile50,
    percentile75,
    percentile90,
    scenarios,
    simulationsRun: simulations
  };
}
