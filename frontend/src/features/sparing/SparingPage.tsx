import { PageHeader, HeroNumber, StatsRow, AreaChart } from '@finans/components';
import { formatCurrency } from '@/shared/utils/numberFormat';
import { useSparingData } from './useSparingData';
import { FireSection } from './FireSection';
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

  if (isLoading) {
    return (
      <main className="sparing-page">
        <div className="container container--narrow">
          <p>Laster sparingsdata...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="sparing-page">
        <div className="container container--narrow">
          <p>Feil ved lasting av sparingsdata. Prøv igjen senere.</p>
        </div>
      </main>
    );
  }

  if (!sparingData) {
    return (
      <main className="sparing-page">
        <div className="container container--narrow">
          <p>Ingen sparingsdata tilgjengelig. Legg til dine første portefølje-data.</p>
        </div>
      </main>
    );
  }

  const yearlyGrowth = (sparingData.totalGrowth * (sparingData.yearlyChange / 100)) || 0;

  const fireData = {
    fireNumber: sparingData.fireNumber,
    current: sparingData.sumSparing,
    minRetireAge: sparingData.minRetireAge,
    yearsToSalary: sparingData.yearsToSalary,
    annualWithdrawal: sparingData.annualWithdrawal,
  };

  return (
    <main className="sparing-page">
      <div className="container container--narrow">
        <PageHeader
          title="Sparing"
          subtitle="Din vei mot økonomisk frihet"
        />

        <HeroNumber
          label="Sum sparing"
          value={formatCurrency(sparingData.sumSparing)}
          change={sparingData.yearlyChange}
          changeLabel={`i ${new Date().getFullYear()} · +${formatCurrency(yearlyGrowth)}`}
        />

        <StatsRow
          stats={[
            { value: `${sparingData.sparerate.toFixed(2).replace('.', ',')}%`, label: 'Sparerate' },
            { value: `${sparingData.monthlyChange >= 0 ? '+' : ''}${sparingData.monthlyChange.toFixed(2).replace('.', ',')}%`, label: 'Siste måned' },
            { value: String(sparingData.monthsFree), label: 'Måneder fri' },
          ]}
        />

        <FireSection {...fireData} />

        <AreaChart
          data={sparingData.history}
          title="Spareutvikling"
          subtitle={`+${formatCurrency(sparingData.totalGrowth)} total`}
          color="var(--muted-sage)"
          height={200}
        />
      </div>
    </main>
  );
}

export default SparingPage;
