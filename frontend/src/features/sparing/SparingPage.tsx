import { PageHeader, HeroNumber, StatsRow, AreaChart, DataPoint } from '@/shared/components';
import { formatCurrency } from '@/shared/utils/numberFormat';
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
  // Placeholder data for testing (will be replaced with API data)
  const savingsData = {
    sumSparing: 970194,
    yearlyChange: 21.6,
    yearlyGrowth: 172330,
    sparerate: 35.88,
    monthlyChange: 2.33,
    monthsFree: 22,
  };

  const fireData = {
    fireNumber: 6400000,
    current: savingsData.sumSparing,
    minRetireAge: 54.5,
    yearsToSalary: 2.8,
    annualWithdrawal: 38808,
  };

  // Sample chart data (will be replaced with API data)
  const chartHistory: DataPoint[] = [
    { date: new Date(2022, 8, 1), value: 252268 },
    { date: new Date(2022, 11, 1), value: 310000 },
    { date: new Date(2023, 2, 1), value: 385000 },
    { date: new Date(2023, 5, 1), value: 450000 },
    { date: new Date(2023, 8, 1), value: 520000 },
    { date: new Date(2023, 11, 1), value: 610000 },
    { date: new Date(2024, 2, 1), value: 720000 },
    { date: new Date(2024, 5, 1), value: 810000 },
    { date: new Date(2024, 8, 1), value: 890000 },
    { date: new Date(2024, 10, 1), value: 970194 },
  ];

  const totalGrowth = 717926;

  return (
    <main className="sparing-page">
      <div className="container container--narrow">
        <PageHeader
          title="Sparing"
          subtitle="Din vei mot økonomisk frihet"
        />

        <HeroNumber
          label="Sum sparing"
          value={formatCurrency(savingsData.sumSparing)}
          change={savingsData.yearlyChange}
          changeLabel={`i ${new Date().getFullYear()} · +${formatCurrency(savingsData.yearlyGrowth)}`}
        />

        <StatsRow
          stats={[
            { value: `${savingsData.sparerate.toFixed(2).replace('.', ',')}%`, label: 'Sparerate' },
            { value: `+${savingsData.monthlyChange.toFixed(2).replace('.', ',')}%`, label: 'Siste måned' },
            { value: String(savingsData.monthsFree), label: 'Måneder fri' },
          ]}
        />

        <FireSection {...fireData} />

        <AreaChart
          data={chartHistory}
          title="Spareutvikling"
          subtitle={`+${formatCurrency(totalGrowth)} total`}
          color="var(--muted-sage)"
          height={200}
        />
      </div>
    </main>
  );
}

export default SparingPage;
