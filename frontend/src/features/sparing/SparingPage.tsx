import { PageSkeleton, HeroNumber, StatsRow, ChartWithTabs, formatCurrency, formatPercentage } from '@finans/components';
import { useSparingData } from './useSparingData';
import { FireSection } from './FireSection';
import { SparingSkeleton } from '@/shared/components/skeletons';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
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
      <PageSkeleton
        breadcrumb={[{ label: 'Hjem', path: '/oversikt' }, { label: 'Sparing' }]}
        title="Sparing"
        subtitle="Din vei mot økonomisk frihet"
        className="sparing-page"
        aria-busy={true}
      >
        <div role="status" aria-live="polite" className="sr-only">
          Laster sparingsdata...
        </div>
        <SparingSkeleton />
      </PageSkeleton>
    );
  }

  if (error) {
    return (
      <PageSkeleton
        breadcrumb={[{ label: 'Hjem', path: '/oversikt' }, { label: 'Sparing' }]}
        title="Sparing"
        subtitle="Feil ved lasting av sparingsdata. Prøv igjen senere."
        className="sparing-page"
      >
        <></>
      </PageSkeleton>
    );
  }

  if (!sparingData) {
    return (
      <PageSkeleton
        breadcrumb={[{ label: 'Hjem', path: '/oversikt' }, { label: 'Sparing' }]}
        title="Sparing"
        subtitle="Ingen sparingsdata tilgjengelig. Legg til dine første portefølje-data."
        className="sparing-page"
      >
        <></>
      </PageSkeleton>
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
    <PageSkeleton
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
    </PageSkeleton>
  );
}

export default SparingPage;
