import { useQuery } from '@tanstack/react-query';
import { snapshotApi, gjeldApi } from '@/shared/api/services';
import { QUERY_KEYS } from '@/shared/api/queryHelpers';
import type { Account } from '@/shared/types';
import { getAccountCategory } from '@/shared/types';
import { parseDate } from '@/shared/utils/dateFormat';
import { QUERY_CONFIG } from '@/config/constants';

/**
 * Information about a single loan
 */
interface LoanInfo {
  id: string;
  name: string;
  balance: number;
}

/**
 * Calculate sum of gjeld (debt) accounts
 */
function calculateSumGjeld(accounts: Account[]): number {
  return accounts.reduce((sum, account) => {
    if (getAccountCategory(account.assetClass) === 'gjeld') {
      return sum + Math.abs(account.value);
    }
    return sum;
  }, 0);
}

/**
 * Gjeld (debt) metrics and historical data
 */
export interface GjeldData {
  sumGjeld: number;
  monthlyChange: number;
  dekning: number; // Coverage: sparing / gjeld * 100
  remaining: number; // How much gjeld remains uncovered
  loans: LoanInfo[];
  history: { date: Date; value: number }[];
}


/**
 * Empty gjeld data (no snapshots yet)
 */
function getEmptyGjeldData(): GjeldData {
  return {
    sumGjeld: 0,
    monthlyChange: 0,
    dekning: 100,
    remaining: 0,
    loans: [],
    history: []
  };
}

/**
 * Fetch and calculate gjeld data from API
 */
async function fetchGjeldData(): Promise<GjeldData> {
  try {
    // Fetch aggregated gjeld data from endpoint
    const gjeldData = await gjeldApi.getSummary();

    if (!gjeldData) {
      return getEmptyGjeldData();
    }

    // Fetch snapshots separately to get monthly change
    const snapshots = await snapshotApi.getAll();

    let monthlyChange = 0;
    if (snapshots && snapshots.length >= 2) {
      const sorted = [...snapshots].sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return dateB.getTime() - dateA.getTime();
      });

      const latest = sorted[0];
      const previous = sorted[1];

      const sumGjeld = calculateSumGjeld(latest.accounts);
      const prevGjeld = calculateSumGjeld(previous.accounts);
      monthlyChange = sumGjeld - prevGjeld;
    }

    // Parse history dates from API response (which are strings)
    const parsedHistory = (gjeldData.history || []).map((item: { date: string; value: number }) => ({
      date: parseDate(item.date),
      value: item.value
    }));

    // Extract loan info
    const loans: LoanInfo[] = (gjeldData.loans || []).map((loan: { name: string; value: number }) => ({
      id: loan.name.toLowerCase().replace(/\s+/g, '-'),
      name: loan.name,
      balance: Math.abs(loan.value)
    }));

    return {
      sumGjeld: gjeldData.sumGjeld,
      monthlyChange,
      dekning: gjeldData.dekning,
      remaining: gjeldData.remaining,
      loans,
      history: parsedHistory
    };
  } catch (error) {
    console.error('Error fetching gjeld data:', error);
    throw error;
  }
}

/**
 * Hook to fetch and calculate gjeld/debt data
 *
 * Fetches all snapshots from the portfolio API and calculates:
 * - Total debt (sum of gjeld accounts)
 * - Monthly change in debt
 * - Coverage ratio (dekning) - what % of debt is covered by savings
 * - Remaining uncovered debt
 * - List of individual loans
 * - Historical data for charting
 *
 * @returns TanStack Query result with gjeld data
 */
export function useGjeldData() {
  return useQuery({
    queryKey: QUERY_KEYS.GJELD,
    queryFn: fetchGjeldData,
    staleTime: QUERY_CONFIG.STALE_TIME,
    retry: QUERY_CONFIG.RETRY_COUNT
  });
}
