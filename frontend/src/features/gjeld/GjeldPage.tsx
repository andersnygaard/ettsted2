import { PageSkeleton, HeroNumber, ChartWithTabs, formatCurrency } from '@finans/components';
import { useGjeldData } from './useGjeldData';
import { useAuth } from '../auth/useAuth';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { DekningSection } from './DekningSection';
import { LoansList, Loan } from './LoansList';
import { GjeldSkeleton } from '@/shared/components/skeletons';
import './GjeldPage.css';

/**
 * GjeldPage Component
 *
 * Debt overview page showing total debt, coverage ratio,
 * active loans, and debt reduction trend.
 *
 * Based on Nordic Minimal design from draft-1-gjeld.html
 */
function GjeldPage() {
  const { data: gjeldData, isLoading, error } = useGjeldData();
  const { user } = useAuth();
  usePageTitle('Gjeld');

  // Handle loading state
  if (isLoading) {
    return (
      <PageSkeleton
        breadcrumb={[{ label: 'Hjem', path: '/oversikt' }, { label: 'Gjeld' }]}
        title="Gjeld"
        subtitle="Oversikt over lån og nedbetaling"
        className="gjeld-page"
        aria-busy={true}
      >
        <div role="status" aria-live="polite" className="sr-only">
          Laster gjelddata...
        </div>
        <GjeldSkeleton />
      </PageSkeleton>
    );
  }

  // Handle error state
  if (error) {
    return (
      <PageSkeleton
        breadcrumb={[{ label: 'Hjem', path: '/oversikt' }, { label: 'Gjeld' }]}
        title="Gjeld"
        subtitle="Feil ved lasting av data"
        className="gjeld-page"
      >
        <></>
      </PageSkeleton>
    );
  }

  // Use gjeldData or empty defaults
  const data = gjeldData || {
    totalDebt: 0,
    monthlyChange: 0,
    coverage: 100,
    remaining: 0,
    loans: [],
    history: [],
    accountHistory: [],
    accounts: []
  };

  // Merge loan info with user account details for interest rate and years
  const loans: Loan[] = data.loans.map(loanInfo => {
    // Find matching account config from user for loan details
    const accountConfig = user?.accounts?.find(
      acc => acc.id === loanInfo.id || acc.name === loanInfo.name
    );
    return {
      id: loanInfo.id,
      name: loanInfo.name,
      balance: loanInfo.balance,
      interestRate: accountConfig?.loanDetails?.interestRate ?? 0,
      yearsRemaining: accountConfig?.loanDetails?.remainingYears ?? 0
    };
  });

  // Calculate change percentage (handle division by zero)
  const changePercentage = data.totalDebt > 0 ? (data.monthlyChange / data.totalDebt) * 100 : 0;

  // Calculate sumSavings from coverage ratio
  // coverage = (sumSavings / totalDebt) * 100
  // sumSavings = (coverage / 100) * totalDebt
  const sumSavings = (data.coverage / 100) * data.totalDebt;

  return (
    <PageSkeleton
      breadcrumb={[{ label: 'Hjem', path: '/oversikt' }, { label: 'Gjeld' }]}
      title="Gjeld"
      subtitle="Oversikt over lån og nedbetaling"
      className="gjeld-page"
    >

        <HeroNumber
          label="Sum gjeld"
          value={formatCurrency(data.totalDebt)}
          change={changePercentage}
          changeLabel="denne måneden"
        />

        <DekningSection
          sumSavings={sumSavings}
          sumGjeld={data.totalDebt}
        />

        <LoansList loans={loans} />

      <ChartWithTabs
        data={data.accountHistory}
        accounts={data.accounts}
        title="Gjeldsutvikling"
        subtitle="Nedgang over tid"
        totalColor="var(--pale-blue)"
        height={180}
      />
    </PageSkeleton>
  );
}

export default GjeldPage;
