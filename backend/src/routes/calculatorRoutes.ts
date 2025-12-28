/**
 * Calculator Routes (Kalkulatorer)
 *
 * API endpoints for financial calculators:
 * - POST /api/v1/kalkulatorer/monte-carlo - Run Monte Carlo simulation
 * - POST /api/v1/kalkulatorer/rentes-rente - Calculate compound interest
 * - POST /api/v1/kalkulatorer/fire - Calculate F.I.R.E. metrics
 * - POST /api/v1/kalkulatorer/lan - Calculate loan amortization
 */

import { Router, IRouter } from 'express';
import {
  monteCarloSimulation,
  compoundCalculation,
  fireCalculation,
  loanCalculation,
  flexiLoanCalculation
} from '../controllers/calculatorController';
import { validateBody } from '../middleware/validate';
import {
  monteCarloSchema,
  compoundSchema,
  fireSchema,
  loanSchema,
  flexiLoanSchema
} from '../validators/schemas';

const router: IRouter = Router();

/**
 * POST /api/v1/kalkulatorer/monte-carlo
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
 */
router.post(
  '/monte-carlo',
  validateBody(monteCarloSchema),
  monteCarloSimulation
);

/**
 * POST /api/v1/kalkulatorer/rentes-rente
 * Calculate compound interest with optional monthly contributions
 *
 * Body: {
 *   principal: number (required) - Initial investment in NOK
 *   annualRate: number (required) - Annual interest rate as percentage (e.g., 7 for 7%)
 *   years: number (required) - Investment period in years (max 100)
 *   compoundingFrequency?: number (default: 12) - Times per year interest compounds
 *   monthlyContribution?: number (default: 0) - Monthly contribution in NOK
 * }
 *
 * Returns: 200 with compound interest results including:
 * - finalValue: Final portfolio value
 * - totalContributions: Total amount contributed
 * - totalInterest: Total interest earned
 * - yearlyBreakdown: Year-by-year breakdown
 */
router.post(
  '/rentes-rente',
  validateBody(compoundSchema),
  compoundCalculation
);

/**
 * POST /api/v1/kalkulatorer/fire
 * Calculate F.I.R.E. (Financial Independence, Retire Early) metrics
 *
 * Body: {
 *   currentSavings: number (required) - Current savings in NOK
 *   annualExpenses: number (required) - Annual expenses in NOK
 *   annualIncome?: number (default: 0) - Annual income in NOK
 *   annualSavings?: number - Annual savings (calculated from income - expenses if not provided)
 *   expectedReturn?: number (default: 7) - Expected annual return as percentage
 *   customFireNumber?: number - Override default 25x expenses calculation
 * }
 *
 * Returns: 200 with F.I.R.E. calculation results including:
 * - fireNumber: Target wealth for financial independence
 * - currentProgress: Current progress percentage
 * - yearsToFire: Years until reaching FIRE number
 * - savingsRate: Savings rate percentage
 * - annualWithdrawal: Safe annual withdrawal at 4% rule
 * - monthsFree: Months of expenses covered by current savings
 * - yearlyProjection: Year-by-year projection
 */
router.post(
  '/fire',
  validateBody(fireSchema),
  fireCalculation
);

/**
 * POST /api/v1/kalkulatorer/lan
 * Calculate loan amortization schedule
 *
 * Body: {
 *   principal: number (required) - Loan amount in NOK
 *   annualRate: number (required) - Annual interest rate as percentage (e.g., 5 for 5%)
 *   years: number (required) - Loan term in years (max 50)
 *   extraPayment?: number (default: 0) - Additional monthly payment towards principal
 * }
 *
 * Returns: 200 with loan calculation results including:
 * - monthlyPayment: Standard monthly payment
 * - totalPayment: Total amount paid over loan term
 * - totalInterest: Total interest paid
 * - effectiveYears: Actual years to pay off (with extra payments)
 * - amortizationSchedule: Monthly breakdown
 * - yearlySummary: Yearly summary
 */
router.post(
  '/lan',
  validateBody(loanSchema),
  loanCalculation
);

/**
 * POST /api/v1/kalkulatorer/fleksilan
 * Calculate flexible loan (fleksilån) payoff schedule
 *
 * Body: {
 *   outstandingBalance: number (required) - Current debt amount in NOK
 *   annualRate: number (required) - Annual interest rate as percentage (e.g., 5 for 5%)
 *   monthlyPayment: number (required) - User's planned monthly payment in NOK
 *   creditLimit?: number - Optional credit limit for context
 * }
 *
 * Returns: 200 with flexible loan calculation results including:
 * - monthsToPayoff: Number of months to pay off
 * - yearsToPayoff: Formatted as "X år, Y måneder"
 * - totalInterestPaid: Total interest over payoff period
 * - totalPaid: Total amount paid (principal + interest)
 * - payoffDate: Estimated payoff date (dd.MM.yyyy)
 * - warning: Optional warning if payment barely covers interest
 * - amortizationSchedule: Monthly breakdown
 */
router.post(
  '/fleksilan',
  validateBody(flexiLoanSchema),
  flexiLoanCalculation
);

export default router;
