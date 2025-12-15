import { useQuery } from '@tanstack/react-query';
import { snapshotApi, sparingApi, userApi } from '@/shared/api/services';
import { QUERY_KEYS } from '@/shared/api/queryHelpers';
import type { MonthlySnapshot, Account } from '@/shared/types';
import { getAccountCategory } from '@/shared/types';
import { parseDate } from '@finans/components';
import { FIRE, QUERY_CONFIG } from '@/config/constants';

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
  monthsCovered: number;
  yearsToSalary: number;
  annualWithdrawal: number;
  totalGrowth: number;
  history: { date: Date; value: number }[];
  accountHistory: Array<{ date: Date; [accountId: string]: Date | number }>;
  accounts: Array<{ id: string; name: string }>;
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
    monthsCovered: 0,
    yearsToSalary: 0,
    annualWithdrawal: 0,
    totalGrowth: 0,
    history: [],
    accountHistory: [],
    accounts: []
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
 * Fetch and calculate sparing data from API
 *
 * Uses the aggregated /api/v1/sparing endpoint which calculates
 * F.I.R.E. metrics from user profile settings.
 * Also fetches user profile to calculate months covered by 4% withdrawal.
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

    // Calculate annual withdrawal at 4% rule
    const annualWithdrawalCalculated = (sparingData.sumSavings ?? 0) * FIRE.SAFE_WITHDRAWAL_RATE;

    // Calculate months of expenses covered by 4% withdrawal and years to salary
    let monthsCovered = 0;
    let yearsToSalary = 0;

    if (userData && userData.profile) {
      const profile = userData.profile;
      const monthlyExpenses = (profile.monthlySalary || 0) - (profile.monthlySavings || 0);

      // Calculate months covered: annual 4% withdrawal / monthly expenses
      monthsCovered = monthlyExpenses > 0
        ? annualWithdrawalCalculated / monthlyExpenses
        : 0;

      // Calculate years until savings equals annual income using simple savings rate formula
      // Formula: yearsToSalary = 1 / (savingsRate / 100)
      // Where savingsRate is the percentage from API
      const savingsRateDecimal = sparingData.savingsRate / 100;
      yearsToSalary = savingsRateDecimal > 0 ? 1 / savingsRateDecimal : Infinity;
    }

    // Build per-account history for ChartWithTabs
    // Collect unique active saving accounts from latest snapshot
    const uniqueAccounts = new Map<string, { id: string; name: string }>();
    if (snapshots && snapshots.length > 0) {
      const latest = [...snapshots].sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return dateB.getTime() - dateA.getTime();
      })[0];

      latest.accounts.forEach(account => {
        if (getAccountCategory(account.assetClass) === 'sparing') {
          uniqueAccounts.set(account.id, { id: account.id, name: account.name });
        }
      });
    }

    const accounts = Array.from(uniqueAccounts.values());

    // Build history with per-account breakdown
    const accountHistory = (snapshots || [])
      .sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return dateA.getTime() - dateB.getTime();
      })
      .map((snapshot) => {
        const point: { date: Date; [accountId: string]: Date | number } = {
          date: parseDate(snapshot.date)
        };

        // Add value for each account
        accounts.forEach(account => {
          const acc = snapshot.accounts.find(a => a.id === account.id);
          point[account.id] = acc && getAccountCategory(acc.assetClass) === 'sparing' ? acc.value : 0;
        });

        return point;
      });

    return {
      sumSavings: sparingData.sumSavings ?? 0,
      yearlyChange,
      monthlyChange,
      savingsRate: sparingData.savingsRate ?? 0,
      monthsFree: sparingData.monthsFree ?? 0,
      fireNumber: sparingData.fireNumber ?? 0,
      fireProgress: sparingData.fireProgress ?? 0,
      monthsCovered,
      yearsToSalary,
      annualWithdrawal: annualWithdrawalCalculated,
      totalGrowth,
      history: parsedHistory,
      accountHistory,
      accounts
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
 * - Months of expenses covered by 4% withdrawal
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
