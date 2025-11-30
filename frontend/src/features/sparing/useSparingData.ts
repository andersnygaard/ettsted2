import { useQuery } from '@tanstack/react-query';
import { snapshotApi } from '@/shared/api/services';
import type { MonthlySnapshot, Account } from '@/shared/types';
import { ASSET_CLASS_CATEGORIES } from '@/shared/types';

/**
 * F.I.R.E. metrics and historical data for Sparing page
 */
export interface SparingData {
  sumSparing: number;
  yearlyChange: number;
  monthlyChange: number;
  sparerate: number;
  monthsFree: number;
  fireNumber: number;
  fireProgress: number;
  minRetireAge: number;
  yearsToSalary: number;
  annualWithdrawal: number;
  totalGrowth: number;
  history: { date: Date; value: number }[];
}

/**
 * Empty sparing data (no snapshots yet)
 */
function getEmptySparingData(): SparingData {
  return {
    sumSparing: 0,
    yearlyChange: 0,
    monthlyChange: 0,
    sparerate: 0,
    monthsFree: 0,
    fireNumber: 0,
    fireProgress: 0,
    minRetireAge: 0,
    yearsToSalary: 0,
    annualWithdrawal: 0,
    totalGrowth: 0,
    history: []
  };
}

/**
 * Calculate sum of sparing accounts
 */
function calculateSumSparing(accounts: Account[]): number {
  return accounts.reduce((sum, account) => {
    const assetClassLower = account.assetClass.toLowerCase();
    // Include if it's in sparing category OR not in gjeld/pensjon categories
    const isGjeld = ASSET_CLASS_CATEGORIES.gjeld.includes(assetClassLower);
    const isPensjon = ASSET_CLASS_CATEGORIES.pensjon.includes(assetClassLower);
    if (!isGjeld && !isPensjon) {
      return sum + account.value;
    }
    return sum;
  }, 0);
}

/**
 * Parse Norwegian date format (dd.MM.yyyy) to Date object
 */
function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('.');
  return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
}

/**
 * Check if a date is the start of the year
 */
function isStartOfYear(dateStr: string): boolean {
  const date = parseDate(dateStr);
  return date.getMonth() === 0; // January
}

/**
 * Calculate yearly change percentage
 */
function calculateYearlyChange(
  latestSnapshot: MonthlySnapshot | undefined,
  yearStartSnapshot: MonthlySnapshot | undefined
): number {
  if (!latestSnapshot || !yearStartSnapshot) {
    return 0;
  }

  const latestValue = calculateSumSparing(latestSnapshot.accounts);
  const yearStartValue = calculateSumSparing(yearStartSnapshot.accounts);

  if (yearStartValue === 0) {
    return 0;
  }

  return ((latestValue - yearStartValue) / yearStartValue) * 100;
}

/**
 * Calculate monthly change percentage
 */
function calculateMonthlyChange(snapshots: MonthlySnapshot[]): number {
  if (snapshots.length < 2) {
    return 0;
  }

  const latest = snapshots[0];
  const previous = snapshots[1];

  const latestValue = calculateSumSparing(latest.accounts);
  const previousValue = calculateSumSparing(previous.accounts);

  if (previousValue === 0) {
    return 0;
  }

  return ((latestValue - previousValue) / previousValue) * 100;
}

/**
 * Calculate years to reach a target value using compound growth
 *
 * Formula: FV = PV * (1 + r)^n + PMT * (((1 + r)^n - 1) / r)
 * Where:
 * - FV = Future value (target)
 * - PV = Present value (current savings)
 * - r = Annual growth rate (as decimal)
 * - PMT = Annual payment (savings per year)
 * - n = Number of years
 *
 * We solve for n iteratively
 */
function calculateYearsToValue(
  currentValue: number,
  targetValue: number,
  annualSavings: number,
  growthRate: number = 0.07 // 7% annual growth assumption
): number {
  if (currentValue >= targetValue) {
    return 0;
  }

  if (annualSavings === 0) {
    // No contributions, only growth
    if (growthRate === 0) {
      return Infinity;
    }
    return Math.log(targetValue / currentValue) / Math.log(1 + growthRate);
  }

  // Iterative approach for compound growth with contributions
  let value = currentValue;
  let years = 0;

  while (value < targetValue && years < 100) {
    value = value * (1 + growthRate) + annualSavings;
    years += 1;
  }

  return years >= 100 ? Infinity : years;
}

/**
 * Fetch and calculate sparing data from API
 */
async function fetchSparingData(): Promise<SparingData> {
  try {
    const snapshots = await snapshotApi.getAll();

    if (!snapshots || snapshots.length === 0) {
      return getEmptySparingData();
    }

    // Sort by date descending (most recent first)
    const sorted = [...snapshots].sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return dateB.getTime() - dateA.getTime();
    });

    const latest = sorted[0];
    const first = sorted[sorted.length - 1];

    // Find snapshot from start of year
    const currentYear = new Date().getFullYear();
    const yearStartSnapshot = sorted.find(s => {
      const date = parseDate(s.date);
      return date.getFullYear() === currentYear && isStartOfYear(s.date);
    });

    const sumSparing = calculateSumSparing(latest.accounts);

    // TODO: Get these from user settings once implemented
    const annualExpenses = 256000;
    const annualIncome = 800000;
    const currentAge = 35;
    const annualGrowthRate = 0.07; // 7% assumption

    // Calculate F.I.R.E. metrics
    const fireNumber = annualExpenses * 25;
    const fireProgress = (sumSparing / fireNumber) * 100;
    const sparerate = annualIncome > 0 ? ((annualIncome - annualExpenses) / annualIncome) * 100 : 0;
    const monthlyExpenses = annualExpenses / 12;
    const monthsFree = monthlyExpenses > 0 ? Math.floor(sumSparing / monthlyExpenses) : 0;
    const annualWithdrawal = sumSparing * 0.04;

    // Calculate years to financial independence
    const annualSavings = annualIncome - annualExpenses;
    const yearsToFire = calculateYearsToValue(sumSparing, fireNumber, annualSavings, annualGrowthRate);
    const minRetireAge = yearsToFire === Infinity ? 999 : currentAge + yearsToFire;

    // Calculate years until savings equals annual salary
    const yearsToSalary = calculateYearsToValue(sumSparing, annualIncome, annualSavings, annualGrowthRate);

    // Calculate total growth from first snapshot
    const firstValue = calculateSumSparing(first.accounts);
    const totalGrowth = sumSparing - firstValue;

    // Build history for chart (reversed to chronological order)
    const history = sorted
      .map(s => ({
        date: parseDate(s.date),
        value: calculateSumSparing(s.accounts)
      }))
      .reverse();

    return {
      sumSparing,
      yearlyChange: calculateYearlyChange(latest, yearStartSnapshot),
      monthlyChange: calculateMonthlyChange(sorted),
      sparerate,
      monthsFree,
      fireNumber,
      fireProgress,
      minRetireAge,
      yearsToSalary,
      annualWithdrawal,
      totalGrowth,
      history
    };
  } catch (error) {
    console.error('Error fetching sparing data:', error);
    throw error;
  }
}

/**
 * Hook to fetch and calculate sparing/F.I.R.E. data
 *
 * Fetches all snapshots and calculates:
 * - Total savings (sparing)
 * - Yearly and monthly change percentages
 * - F.I.R.E. number and progress toward it
 * - Minimum retirement age
 * - Years until savings equals annual income
 * - Annual withdrawal at 4% rule
 * - Historical data for charting
 *
 * @returns TanStack Query result with sparing data
 */
export function useSparingData() {
  return useQuery({
    queryKey: ['sparing'],
    queryFn: fetchSparingData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1
  });
}
