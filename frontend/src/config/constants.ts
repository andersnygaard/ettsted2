/**
 * Application Constants
 *
 * Centralized configuration values used throughout the application.
 * This file contains all "magic numbers" extracted for maintainability.
 */

/**
 * Dashboard milestone thresholds in NOK
 * Used to track wealth goals and display milestone badges
 */
export const MILESTONES = [
  100_000,
  250_000,
  500_000,
  750_000,
  1_000_000,
  1_500_000,
  2_000_000,
  3_000_000,
  4_000_000,
  5_000_000,
  7_500_000,
  10_000_000,
  15_000_000,
  20_000_000,
] as const;

/**
 * Portfolio milestone thresholds in NOK
 * More granular milestones used for portfolio tracking
 */
export const PORTFOLIO_MILESTONES = [
  10_000,
  20_000,
  30_000,
  40_000,
  50_000,
  60_000,
  70_000,
  80_000,
  90_000,
  100_000,
  200_000,
  300_000,
  400_000,
  500_000,
  600_000,
  700_000,
  800_000,
  900_000,
  1_000_000,
  2_000_000,
  3_000_000,
  4_000_000,
  5_000_000,
] as const;

/**
 * Investment growth rate assumptions
 * Used for compound growth calculations and projections
 */
export const GROWTH_RATES = {
  CONSERVATIVE: 0.05,  // 5% annual growth (pension)
  DEFAULT: 0.07,       // 7% annual growth (default assumption)
  AGGRESSIVE: 0.10,    // 10% annual growth
} as const;

/**
 * React Query configuration
 * Centralized query settings for consistency across all hooks
 */
export const QUERY_CONFIG = {
  STALE_TIME: 5 * 60 * 1000,  // 5 minutes in milliseconds
  RETRY_COUNT: 1,
} as const;

/**
 * F.I.R.E. (Financial Independence, Retire Early) calculations
 * Standard formulas used for wealth independence planning
 */
export const FIRE = {
  SAFE_WITHDRAWAL_RATE: 0.04,  // 4% rule: sustainable annual withdrawal
  EXPENSE_MULTIPLIER: 25,      // 25x annual expenses = F.I.R.E. target
} as const;

/**
 * Default retirement assumptions
 * Used for pension projections and retirement age calculations
 */
export const RETIREMENT = {
  DEFAULT_RETIREMENT_AGE: 67,
  DEFAULT_CURRENT_AGE: 35,
} as const;
