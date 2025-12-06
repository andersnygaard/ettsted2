import { PageSkeleton, HeroNumber, AreaChart } from '@finans/components';
import type { DataPoint } from '@finans/components';
import { formatCurrency } from '@/shared/utils/numberFormat';
import { useGjeldData } from './useGjeldData';
import { useAuth } from '../auth/useAuth';
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

  // Handle loading state
  if (isLoading) {
    return (
      <PageSkeleton
        breadcrumb={[{ label: 'Hjem', path: '/dashboard' }, { label: 'Gjeld' }]}
        title="Gjeld"
        subtitle="Oversikt over lån og nedbetaling"
        className="gjeld-page"
      >
        <GjeldSkeleton />
      </PageSkeleton>
    );
  }

  // Handle error state
  if (error) {
    return (
      <PageSkeleton
        breadcrumb={[{ label: 'Hjem', path: '/dashboard' }, { label: 'Gjeld' }]}
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
    sumGjeld: 0,
    monthlyChange: 0,
    dekning: 100,
    remaining: 0,
    loans: [],
    history: []
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

  // Use history directly (already in DataPoint format)
  const debtHistory: DataPoint[] = data.history;

  // Calculate change percentage (handle division by zero)
  const changePercentage = data.sumGjeld > 0 ? (data.monthlyChange / data.sumGjeld) * 100 : 0;

  // Calculate sumSparing from dekning ratio
  // dekning = (sumSparing / sumGjeld) * 100
  // sumSparing = (dekning / 100) * sumGjeld
  const sumSparing = (data.dekning / 100) * data.sumGjeld;

  return (
    <PageSkeleton
      breadcrumb={[{ label: 'Hjem', path: '/dashboard' }, { label: 'Gjeld' }]}
      title="Gjeld"
      subtitle="Oversikt over lån og nedbetaling"
      className="gjeld-page"
    >

        <HeroNumber
          label="Sum gjeld"
          value={formatCurrency(data.sumGjeld)}
          change={changePercentage}
          changeLabel="denne måneden"
        />

        <DekningSection
          sumSparing={sumSparing}
          sumGjeld={data.sumGjeld}
        />

        <LoansList loans={loans} />

      <AreaChart
        data={debtHistory}
        title="Gjeldsutvikling"
        subtitle="Nedgang over tid"
        color="var(--pale-blue)"
        height={180}
      />
    </PageSkeleton>
  );
}

export default GjeldPage;
