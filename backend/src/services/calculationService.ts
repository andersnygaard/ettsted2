/**
 * Calculation Service - Pure Functions for Financial Metrics
 *
 * Provides calculation utilities for financial metrics used across the application.
 * All functions are pure (no side effects, no mutations) and can be safely used
 * in services, routes, and aggregated endpoints.
 *
 * Works with Portfolio.ts model (Account[] in MonthlySnapshot).
 * Category mapping by assetClass:
 * - sparing: "aksjer", "fond", "krypto", "bankkonto" (anything not lån or pensjon)
 * - gjeld: "lån"
 * - pensjon: "pensjon"
 */

import { Account } from '../models/Portfolio';
import { UserProfile } from '../models/User';

/**
 * Determine category from asset class
 *
 * Maps assetClass string to category type.
 * Case-insensitive matching.
 *
 * @param assetClass - Asset class string (e.g., "aksjer", "lån", "pensjon")
 * @returns Category: 'sparing' | 'gjeld' | 'pensjon'
 */
function getCategory(assetClass: string): 'sparing' | 'gjeld' | 'pensjon' {
  const classLower = assetClass.toLowerCase();

  // Gjeld categories: "gjeld", "lån", "loan", "debt"
  if (['gjeld', 'lån', 'loan', 'debt'].includes(classLower)) return 'gjeld';

  // Pensjon categories: "pensjon", "pension"
  if (['pensjon', 'pension'].includes(classLower)) return 'pensjon';

  // Everything else defaults to sparing: "aksjer", "fond", "krypto", "bankkonto"
  return 'sparing';
}

/**
 * Calculate sum of account values for a specific category
 *
 * Filters accounts by asset class category.
 * Used as a building block for other calculations.
 *
 * @param accounts - Accounts array from a monthly snapshot
 * @param category - Category to filter by ('sparing', 'gjeld', 'pensjon')
 * @returns Sum of account values for the category in NOK
 *
 * @example
 * const sparingSum = calculateSumByCategory(snapshot.accounts, 'sparing')
 * const gieldSum = calculateSumByCategory(snapshot.accounts, 'gjeld')
 */
export function calculateSumByCategory(
  accounts: Account[],
  category: 'sparing' | 'gjeld' | 'pensjon'
): number {
  return accounts
    .filter(a => getCategory(a.assetClass) === category)
    .reduce((sum, a) => sum + a.value, 0);
}

/**
 * Calculate net worth (total assets minus total debt)
 *
 * Formula: Sum(sparing) - Sum(gjeld)
 *
 * Net worth represents the user's total wealth by subtracting all debt
 * from all savings and investments. Pensjon is not included as it's
 * not directly accessible capital.
 *
 * @param accounts - Accounts array from a monthly snapshot
 * @returns Net worth in NOK
 *
 * @example
 * const netWorth = calculateNetWorth(snapshot.accounts)
 * // Returns: 500000 (if sparing=700000 and gjeld=200000)
 */
export function calculateNetWorth(accounts: Account[]): number {
  const sparing = calculateSumByCategory(accounts, 'sparing');
  const gjeld = calculateSumByCategory(accounts, 'gjeld');
  return sparing - gjeld;
}

/**
 * Calculate dekning (coverage) percentage
 *
 * Represents how much of total debt is covered by savings.
 * Formula: (Sum(sparing) / Sum(gjeld)) * 100
 *
 * At 100%, user has zero net debt. Above 100% means assets exceed debt.
 * Returns 100 if no debt exists (undefined coverage rate).
 *
 * @param accounts - Accounts array from a monthly snapshot
 * @returns Coverage percentage (0 to 100+), or 100 if no debt
 *
 * @example
 * const dekning = calculateDekning(snapshot.accounts)
 * // Returns: 150 (if sparing=300000 and gjeld=200000)
 * // Returns: 100 (if gjeld=0)
 */
export function calculateDekning(accounts: Account[]): number {
  const sparing = calculateSumByCategory(accounts, 'sparing');
  const gjeld = calculateSumByCategory(accounts, 'gjeld');

  if (gjeld === 0) return 100;
  return (sparing / gjeld) * 100;
}

/**
 * Calculate savings rate percentage
 *
 * Represents the percentage of income that is saved/invested.
 * Formula: ((Annual Income - Annual Expenses) / Annual Income) * 100
 *
 * Annual income is derived from monthly salary (monthlySalary * 12).
 * Returns 0 if annual income is 0 to avoid division by zero.
 *
 * @param profile - User profile containing salary and expense information
 * @returns Savings rate as percentage (0-100+)
 *
 * @example
 * const sparerate = calculateSparerate(user.profile)
 * // If monthlySalary=50000, annualExpenses=480000:
 * // Annual income = 600000
 * // Savings rate = (600000 - 480000) / 600000 * 100 = 20%
 */
export function calculateSparerate(profile: UserProfile): number {
  const annualIncome = profile.monthlySalary * 12;
  if (annualIncome === 0) return 0;
  return ((annualIncome - profile.annualExpenses) / annualIncome) * 100;
}

/**
 * Calculate F.I.R.E. number (target wealth for financial independence)
 *
 * Represents the total wealth needed to retire and live off investment returns.
 * Uses the 4% rule: annual expenses * 25 = portfolio needed for 4% withdrawal.
 *
 * Formula: profile.fireNumber ?? (annualExpenses * 25)
 *
 * If user has set a custom fireNumber, that takes precedence. Otherwise,
 * defaults to 25x annual expenses (equivalent to 4% safe withdrawal rate).
 *
 * @param profile - User profile containing expense and FIRE settings
 * @returns Target wealth in NOK for financial independence
 *
 * @example
 * const fireTarget = calculateFireNumber(user.profile)
 * // If annualExpenses=480000 and no custom fireNumber:
 * // Returns: 12000000 (25 * 480000)
 *
 * // If custom fireNumber is set:
 * // Returns: 10000000 (uses custom value)
 */
export function calculateFireNumber(profile: UserProfile): number {
  return profile.fireNumber ?? profile.annualExpenses * 25;
}

/**
 * Calculate months of expenses covered by savings
 *
 * How many months the current savings can sustain at current expense rate.
 * Formula: Sum(sparing) / (Annual Expenses / 12)
 *
 * Uses Math.floor to return whole months. Returns Infinity if annual
 * expenses are 0 to avoid division by zero.
 *
 * @param sumSparing - Total savings and investments in NOK
 * @param annualExpenses - Annual expenses in NOK
 * @returns Number of months of expenses covered (whole number)
 *
 * @example
 * const monthsFree = calculateMonthsFree(600000, 480000)
 * // Monthly expenses = 480000 / 12 = 40000
 * // Months free = 600000 / 40000 = 15 months
 * // Returns: 15
 */
export function calculateMonthsFree(
  sumSparing: number,
  annualExpenses: number
): number {
  if (annualExpenses === 0) return Infinity;
  const monthlyExpenses = annualExpenses / 12;
  return Math.floor(sumSparing / monthlyExpenses);
}

/**
 * Calculate percentage change between two values
 *
 * Used for showing period-over-period changes (e.g., month-over-month growth).
 * Formula: ((Current - Previous) / |Previous|) * 100
 *
 * Uses absolute value of previous to handle negative starting values correctly.
 * Returns 0 if previous value is 0 to avoid division by zero.
 *
 * @param current - Current value
 * @param previous - Previous value (baseline for comparison)
 * @returns Percentage change (+/- value)
 *
 * @example
 * const growth = calculateMonthlyChange(550000, 500000)
 * // Returns: 10 (10% growth)
 *
 * const decline = calculateMonthlyChange(400000, 500000)
 * // Returns: -20 (-20% decline)
 *
 * const fromZero = calculateMonthlyChange(100000, 0)
 * // Returns: 0 (can't calculate percentage from zero)
 */
export function calculateMonthlyChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}
