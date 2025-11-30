/**
 * Calculator Routes
 *
 * API endpoints for financial calculators:
 * - POST /api/v1/calculators/monte-carlo - Run Monte Carlo simulation
 *
 * Calculator endpoints are rate-limited to 10 requests/minute (expensive operations).
 */

import { Router, IRouter } from 'express';
import { monteCarloSimulation } from '../controllers/calculatorController';
import { calculatorRateLimiter } from '../middleware/rateLimiter';
import { validateBody } from '../middleware/validate';
import { monteCarloSchema } from '../validators/schemas';

const router: IRouter = Router();

/**
 * POST /api/v1/calculators/monte-carlo
 * Run Monte Carlo retirement simulation
 *
 * Body: {
 *   portfolioValue: number (required) - Starting portfolio value in NOK
 *   annualWithdrawal: number (required) - Annual withdrawal amount in NOK
 *   years: number (required) - Simulation period in years
 *   expectedReturn?: number (default: 7) - Expected annual return as percentage
 *   volatility?: number (default: 15) - Return volatility (std dev) as percentage
 *   simulations?: number (default: 1000, max: 10000) - Number of simulations to run
 * }
 *
 * Returns: 200 with simulation results including:
 * - successRate: Percentage of simulations that didn't run out of money
 * - percentile10/25/50/75/90: Final balance at each percentile
 * - scenarios: Array of sample scenario paths for visualization
 * - simulationsRun: Number of simulations actually run
 *
 * Rate limited to 10 requests per minute per IP
 */
router.post(
  '/monte-carlo',
  calculatorRateLimiter,
  validateBody(monteCarloSchema),
  monteCarloSimulation
);

export default router;
