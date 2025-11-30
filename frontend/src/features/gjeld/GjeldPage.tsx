import { PageHeader, HeroNumber, AreaChart, DataPoint } from '@/shared/components';
import { formatCurrency } from '@/shared/utils/numberFormat';
import { DekningSection } from './DekningSection';
import { LoansList, Loan } from './LoansList';
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
  // Placeholder data for testing (will be replaced with API data)
  const debtData = {
    sumGjeld: 823751,
    monthlyChange: -12450,
    sumSparing: 763502, // Used to calculate coverage
  };


  const loans: Loan[] = [
    {
      id: '1',
      name: 'SBanken Boliglån',
      interestRate: 4.2,
      yearsRemaining: 25,
      balance: 823751,
    },
  ];

  // Sample chart data - debt decreasing over time
  const debtHistory: DataPoint[] = [
    { date: new Date(2022, 8, 1), value: 950000 },
    { date: new Date(2022, 11, 1), value: 935000 },
    { date: new Date(2023, 2, 1), value: 915000 },
    { date: new Date(2023, 5, 1), value: 895000 },
    { date: new Date(2023, 8, 1), value: 875000 },
    { date: new Date(2023, 11, 1), value: 860000 },
    { date: new Date(2024, 2, 1), value: 850000 },
    { date: new Date(2024, 5, 1), value: 840000 },
    { date: new Date(2024, 8, 1), value: 830000 },
    { date: new Date(2024, 10, 1), value: 823751 },
  ];

  return (
    <main className="gjeld-page">
      <div className="container container--narrow">
        <PageHeader
          title="Gjeld"
          subtitle="Oversikt over lån og nedbetaling"
        />

        <HeroNumber
          label="Sum gjeld"
          value={formatCurrency(debtData.sumGjeld)}
          change={debtData.monthlyChange / debtData.sumGjeld * 100}
          changeLabel="denne måneden"
        />

        <DekningSection
          sumSparing={debtData.sumSparing}
          sumGjeld={debtData.sumGjeld}
        />

        <LoansList loans={loans} />

        <AreaChart
          data={debtHistory}
          title="Gjeldsutvikling"
          subtitle="Nedgang over tid"
          color="var(--pale-blue)"
          height={180}
        />
      </div>
    </main>
  );
}

export default GjeldPage;
