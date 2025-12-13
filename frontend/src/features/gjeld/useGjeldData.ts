import { useQuery } from '@tanstack/react-query';
import { snapshotApi, gjeldApi, userApi } from '@/shared/api/services';
import { QUERY_KEYS } from '@/shared/api/queryHelpers';
import type { Account } from '@/shared/types';
import { getAccountCategory } from '@/shared/types';
import { parseDate } from '@finans/components';
import { QUERY_CONFIG } from '@/config/constants';

/**
 * Information about a single loan
 */
interface LoanInfo {
  id: string;
  name: string;
  balance: number;
  interestRate?: number;
  remainingYears?: number;
  isPrimaryResidence?: boolean;
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
  totalDebt: number;
  monthlyChange: number;
  coverage: number; // Coverage: sparing / gjeld * 100
  remaining: number; // How much gjeld remains uncovered
  loans: LoanInfo[];
  primaryResidenceLoan?: LoanInfo;
  history: { date: Date; value: number }[];
  accountHistory: Array<{ date: Date; [accountId: string]: Date | number }>;
  accounts: Array<{ id: string; name: string }>;
}


/**
 * Empty gjeld data (no snapshots yet)
 */
function getEmptyGjeldData(): GjeldData {
  return {
    totalDebt: 0,
    monthlyChange: 0,
    coverage: 100,
    remaining: 0,
    loans: [],
    history: [],
    accountHistory: [],
    accounts: []
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

    // Fetch user accounts to get loan details and primary residence
    const user = await userApi.getMe();

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

    // Extract loan info with details from user accounts
    const loans: LoanInfo[] = (gjeldData.loans || []).map((loan: { name: string; value: number }) => {
      const accountConfig = user?.accounts?.find(
        acc => acc.category === 'gjeld' && acc.name === loan.name
      );

      return {
        id: loan.name.toLowerCase().replace(/\s+/g, '-'),
        name: loan.name,
        balance: Math.abs(loan.value),
        interestRate: accountConfig?.loanDetails?.interestRate,
        remainingYears: accountConfig?.loanDetails?.remainingYears,
        isPrimaryResidence: accountConfig?.isPrimaryResidence
      };
    });

    // Find primary residence loan
    const primaryResidenceLoan = loans.find(loan => loan.isPrimaryResidence);

    // Build per-account history for ChartWithTabs
    // Collect unique debt accounts from latest snapshot
    const uniqueAccounts = new Map<string, { id: string; name: string }>();
    if (snapshots && snapshots.length > 0) {
      const latest = [...snapshots].sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return dateB.getTime() - dateA.getTime();
      })[0];

      latest.accounts.forEach(account => {
        if (getAccountCategory(account.assetClass) === 'gjeld') {
          uniqueAccounts.set(account.id, { id: account.id, name: account.name });
        }
      });
    }

    const accounts = Array.from(uniqueAccounts.values());

    // Build history with per-account breakdown (use absolute values for debt)
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

        // Add absolute value for each debt account
        accounts.forEach(account => {
          const acc = snapshot.accounts.find(a => a.id === account.id);
          point[account.id] = acc && getAccountCategory(acc.assetClass) === 'gjeld' ? Math.abs(acc.value) : 0;
        });

        return point;
      });

    return {
      totalDebt: gjeldData.totalDebt ?? 0,
      monthlyChange,
      coverage: gjeldData.coverage ?? 0,
      remaining: gjeldData.remaining ?? 0,
      loans,
      primaryResidenceLoan,
      history: parsedHistory,
      accountHistory,
      accounts
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
