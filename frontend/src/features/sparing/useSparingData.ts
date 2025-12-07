import { useQuery } from '@tanstack/react-query';
import { snapshotApi, sparingApi, userApi } from '@/shared/api/services';
import { QUERY_KEYS } from '@/shared/api/queryHelpers';
import type { MonthlySnapshot, Account } from '@/shared/types';
import { getAccountCategory } from '@/shared/types';
import { parseDate } from '@finans/components';
import { GROWTH_RATES, FIRE, QUERY_CONFIG } from '@/config/constants';

/**
 * F.I.R.E. metrics and historical data for Sparing page
 */
export interface SparingData {
  sumSavings: number;
  yearlyChange: number;
  monthlyChange: number;
  savingsRate: number;
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
    sumSavings: 0,
    yearlyChange: 0,
    monthlyChange: 0,
    savingsRate: 0,
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
 * Uses getAccountCategory for consistency with backend and dashboard
 */
function calculateSumSparing(accounts: Account[]): number {
  return accounts.reduce((sum, account) => {
    if (getAccountCategory(account.assetClass) === 'sparing') {
      return sum + account.value;
    }
    return sum;
  }, 0);
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
  growthRate: number = GROWTH_RATES.DEFAULT
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
 *
 * Uses the aggregated /api/v1/sparing endpoint which calculates
 * F.I.R.E. metrics from user profile settings.
 * Also fetches user profile to calculate retirement age projections.
 */
async function fetchSparingData(): Promise<SparingData> {
  try {
    // Fetch both sparing metrics and user profile in parallel
    const [sparingData, userData] = await Promise.all([
      sparingApi.getSummary(),
      userApi.getMe()
    ]);

    if (!sparingData) {
      return getEmptySparingData();
    }

    // API response structure for /api/v1/sparing:
    // {
    //   sumSavings: number
    //   savingsRate: number (percentage)
    //   monthsFree: number
    //   fireNumber: number
    //   fireProgress: number (0-100+)
    //   history: Array<{ date: string, value: number }>
    // }

    // Parse history dates
    const parsedHistory = (sparingData.history || []).map((item: { date: string; value: number }) => ({
      date: parseDate(item.date),
      value: item.value
    }));

    // Get snapshots for calculating yearly/monthly changes and growth
    const snapshots = await snapshotApi.getAll();

    let yearlyChange = 0;
    let monthlyChange = 0;
    let totalGrowth = 0;

    if (snapshots && snapshots.length > 0) {
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

      yearlyChange = calculateYearlyChange(latest, yearStartSnapshot);
      monthlyChange = calculateMonthlyChange(sorted);

      // Calculate total growth from first snapshot
      const firstValue = calculateSumSparing(first.accounts);
      const currentValue = calculateSumSparing(latest.accounts);
      totalGrowth = currentValue - firstValue;
    }

    // Calculate retirement age projection using user profile data
    let minRetireAge = 999;
    let yearsToSalary = 0;

    if (userData && userData.profile) {
      const profile = userData.profile;
      const currentYear = new Date().getFullYear();
      const currentAge = profile.birthYear ? currentYear - profile.birthYear : 35;
      const annualIncome = (profile.monthlySalary || 0) * 12;
      const annualExpenses = profile.annualExpenses || 0;
      const annualSavings = annualIncome - annualExpenses;
      const annualGrowthRate = GROWTH_RATES.DEFAULT;

      // Calculate years until F.I.R.E. target is reached
      const yearsToFire = calculateYearsToValue(
        sparingData.sumSavings,
        sparingData.fireNumber,
        annualSavings,
        annualGrowthRate
      );
      minRetireAge = yearsToFire === Infinity ? 999 : currentAge + yearsToFire;

      // Calculate years until savings equals annual income
      yearsToSalary = calculateYearsToValue(
        sparingData.sumSavings,
        annualIncome,
        annualSavings,
        annualGrowthRate
      );
    }

    return {
      sumSavings: sparingData.sumSavings ?? 0,
      yearlyChange,
      monthlyChange,
      savingsRate: sparingData.savingsRate ?? 0,
      monthsFree: sparingData.monthsFree ?? 0,
      fireNumber: sparingData.fireNumber ?? 0,
      fireProgress: sparingData.fireProgress ?? 0,
      minRetireAge,
      yearsToSalary,
      annualWithdrawal: (sparingData.sumSavings ?? 0) * FIRE.SAFE_WITHDRAWAL_RATE,
      totalGrowth,
      history: parsedHistory
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
    queryKey: QUERY_KEYS.SPARING,
    queryFn: fetchSparingData,
    staleTime: QUERY_CONFIG.STALE_TIME,
    retry: QUERY_CONFIG.RETRY_COUNT
  });
}
