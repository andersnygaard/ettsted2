import { PageLayout, HeroNumber, StatsRow, ChartWithTabs, Skeleton, formatCurrency, formatPercentage } from '@finans/components';
import { useSparingData } from './useSparingData';
import { FireSection } from './FireSection';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import '@/shared/styles/PageSkeletons.css';
import './SparingPage.css';

/**
 * SparingPage Component
 *
 * Savings overview page with F.I.R.E. progress tracking.
 * Shows total savings, key stats, and progress toward financial independence.
 *
 * Based on Nordic Minimal design from draft-1-sparing.html
 */
function SparingPage() {
  const { data: sparingData, isLoading, error } = useSparingData();
  usePageTitle('Sparing');

  if (isLoading) {
    return (
      <PageLayout
        breadcrumb={[{ label: 'Hjem', path: '/oversikt' }, { label: 'Sparing' }]}
        title="Sparing"
        subtitle="Din vei mot økonomisk frihet"
        className="sparing-page"
        aria-busy={true}
      >
        <div role="status" aria-live="polite" className="sr-only">
          Laster sparingsdata...
        </div>
        {/* Sparing Page Skeleton Loader */}
        <div className="skeleton-container">
          {/* Page Header */}
          <div className="skeleton-page-header">
            <Skeleton width={200} height={36} />
            <Skeleton width={200} height={14} style={{ marginTop: '8px' }} />
          </div>

          {/* Hero Section */}
          <div className="skeleton-hero-section">
            <Skeleton width={100} height={14} />
            <Skeleton width={280} height={72} style={{ marginTop: '16px' }} />
            <Skeleton width={220} height={24} style={{ marginTop: '12px' }} />
          </div>

          {/* Stats Row */}
          <div className="skeleton-stats-row">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-stat-card">
                <Skeleton height={36} />
                <Skeleton height={12} style={{ marginTop: '8px' }} />
              </div>
            ))}
          </div>

          {/* Fire Section */}
          <div className="skeleton-fire-section">
            <Skeleton width={150} height={16} style={{ marginBottom: '12px' }} />
            <Skeleton height={12} style={{ marginBottom: '16px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <Skeleton height={14} style={{ marginBottom: '8px' }} />
                  <Skeleton height={24} />
                </div>
              ))}
            </div>
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

  if (error) {
    return (
      <PageLayout
        breadcrumb={[{ label: 'Hjem', path: '/oversikt' }, { label: 'Sparing' }]}
        title="Sparing"
        subtitle="Feil ved lasting av sparingsdata. Prøv igjen senere."
        className="sparing-page"
      >
        <></>
      </PageLayout>
    );
  }

  if (!sparingData) {
    return (
      <PageLayout
        breadcrumb={[{ label: 'Hjem', path: '/oversikt' }, { label: 'Sparing' }]}
        title="Sparing"
        subtitle="Ingen sparingsdata tilgjengelig. Legg til dine første portefølje-data."
        className="sparing-page"
      >
        <></>
      </PageLayout>
    );
  }

  const yearlyGrowth = (sparingData.totalGrowth * (sparingData.yearlyChange / 100)) || 0;
  const yearlyGrowthFormatted = formatCurrency(yearlyGrowth);
  const yearlyGrowthPrefix = yearlyGrowth >= 0 ? '+' : '';

  const fireData = {
    fireNumber: sparingData.fireNumber,
    current: sparingData.sumSavings,
    minRetireAge: sparingData.minRetireAge,
    yearsToSalary: sparingData.yearsToSalary,
    annualWithdrawal: sparingData.annualWithdrawal,
  };

  return (
    <PageLayout
      breadcrumb={[{ label: 'Hjem', path: '/oversikt' }, { label: 'Sparing' }]}
      title="Sparing"
      subtitle="Din vei mot økonomisk frihet"
      className="sparing-page"
    >

        <HeroNumber
          label="Sum sparing"
          value={formatCurrency(sparingData.sumSavings)}
          change={sparingData.yearlyChange}
          changeLabel={`i ${new Date().getFullYear()} · ${yearlyGrowthPrefix}${yearlyGrowthFormatted}`}
        />

        <StatsRow
          stats={[
            { value: formatPercentage(sparingData.savingsRate / 100), label: 'Sparerate' },
            { value: `${sparingData.monthlyChange >= 0 ? '+' : ''}${formatPercentage(sparingData.monthlyChange / 100)}`, label: 'Siste måned' },
            { value: String(sparingData.monthsFree), label: 'Måneder fri' },
          ]}
        />

        <FireSection {...fireData} />

      <ChartWithTabs
        data={sparingData.accountHistory}
        accounts={sparingData.accounts}
        title="Spareutvikling"
        subtitle={`+${formatCurrency(sparingData.totalGrowth)} total`}
        totalColor="var(--muted-sage)"
        height={200}
      />
    </PageLayout>
  );
}

export default SparingPage;
