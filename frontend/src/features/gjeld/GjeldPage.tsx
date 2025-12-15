import { PageLayout, HeroNumber, ChartWithTabs, formatCurrency, Skeleton } from '@finans/components';
import { useGjeldData } from './useGjeldData';
import { useAuth } from '../auth/useAuth';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { DekningSection } from './DekningSection';
import { LoansList, Loan } from './LoansList';
import '@finans/components/styles/tokens.css';
import '@/shared/styles/PageSkeletons.css';
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
      <PageLayout
        breadcrumb={[{ label: 'Hjem', path: '/oversikt' }, { label: 'Gjeld' }]}
        title="Gjeld"
        subtitle="Oversikt over lån og nedbetaling"
        className="gjeld-page"
        aria-busy={true}
      >
        <div role="status" aria-live="polite" className="sr-only">
          Laster gjelddata...
        </div>
        <div className="skeleton-container">
          {/* Page Header */}
          <div className="skeleton-page-header">
            <Skeleton width={150} height={36} />
            <Skeleton width={220} height={14} style={{ marginTop: '8px' }} />
          </div>

          {/* Hero Section */}
          <div className="skeleton-hero-section">
            <Skeleton width={100} height={14} />
            <Skeleton width={260} height={72} style={{ marginTop: '16px' }} />
            <Skeleton width={180} height={24} style={{ marginTop: '12px' }} />
          </div>

          {/* Dekning Section */}
          <div className="skeleton-dekning-section">
            <div style={{ display: 'flex', gap: '32px' }}>
              {/* Donut placeholder */}
              <Skeleton width={120} height={120} variant="circular" />
              {/* Info section */}
              <div style={{ flex: 1 }}>
                <Skeleton width={100} height={14} style={{ marginBottom: '8px' }} />
                <Skeleton width={150} height={20} style={{ marginBottom: '16px' }} />
                <Skeleton height={12} style={{ marginBottom: '8px' }} />
                <Skeleton width={90} height={12} />
              </div>
            </div>
          </div>

          {/* Loans List */}
          <div className="skeleton-loans-list">
            <Skeleton width={120} height={16} style={{ marginBottom: '16px' }} />
            {[1, 2].map((i) => (
              <div key={i} className="skeleton-loan-item">
                <Skeleton height={14} style={{ marginBottom: '8px' }} />
                <Skeleton width={200} height={12} />
              </div>
            ))}
          </div>

          {/* Chart Area */}
          <div className="skeleton-chart-section">
            <Skeleton width={180} height={16} style={{ marginBottom: '8px' }} />
            <Skeleton height={200} style={{ marginTop: '12px' }} />
          </div>
        </div>
      </PageLayout>
    );
  }

  // Handle error state
  if (error) {
    return (
      <PageLayout
        breadcrumb={[{ label: 'Hjem', path: '/oversikt' }, { label: 'Gjeld' }]}
        title="Gjeld"
        subtitle="Feil ved lasting av data"
        className="gjeld-page"
      >
        <></>
      </PageLayout>
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
    <PageLayout
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
    </PageLayout>
  );
}

export default GjeldPage;
