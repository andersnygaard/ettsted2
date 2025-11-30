import { PageHeader, HeroNumber, StackedAreaChart, StackedDataPoint, Series } from '@/shared/components';
import { formatCurrency } from '@/shared/utils/numberFormat';
import { BreakdownCards, BreakdownItem } from './BreakdownCards';
import { OtpSection } from './OtpSection';
import './PensjonPage.css';

/**
 * PensjonPage Component
 *
 * Pension overview page showing total pension savings,
 * breakdown by source, OTP progress, and development chart.
 *
 * Based on Nordic Minimal design from draft-1-pensjon.html
 */
function PensjonPage() {
  // Placeholder data for testing (will be replaced with API data)
  const pensjonData = {
    sumPensjon: 3848757,
    arbeidsgiver: 2694130,
    nav: 1154627,
    otpPercentage: 45,
  };

  const arbeidsgiverPercent = Math.round((pensjonData.arbeidsgiver / pensjonData.sumPensjon) * 100);
  const navPercent = Math.round((pensjonData.nav / pensjonData.sumPensjon) * 100);

  // Breakdown items
  const breakdownItems: BreakdownItem[] = [
    {
      icon: '🏢',
      iconLabel: 'Arbeidsgiver',
      value: pensjonData.arbeidsgiver,
      label: 'Pensjon arbeidsgiver',
      percentage: arbeidsgiverPercent,
      variant: 'arbeidsgiver',
    },
    {
      icon: '🏛️',
      iconLabel: 'NAV',
      value: pensjonData.nav,
      label: 'Pensjon NAV',
      percentage: navPercent,
      variant: 'nav',
    },
  ];

  // Chart data - pension development over time
  const chartData: StackedDataPoint[] = [
    { date: new Date(2020, 0, 1), arbeidsgiver: 1200000, nav: 600000 },
    { date: new Date(2021, 0, 1), arbeidsgiver: 1500000, nav: 720000 },
    { date: new Date(2022, 0, 1), arbeidsgiver: 1900000, nav: 850000 },
    { date: new Date(2023, 0, 1), arbeidsgiver: 2300000, nav: 1000000 },
    { date: new Date(2024, 0, 1), arbeidsgiver: 2694130, nav: 1154627 },
  ];

  const chartSeries: Series[] = [
    { key: 'arbeidsgiver', color: 'var(--pale-blue)', label: 'Arbeidsgiver' },
    { key: 'nav', color: 'var(--orange, #D4956A)', label: 'NAV' },
  ];

  return (
    <main className="pensjon-page">
      <div className="container container--narrow">
        <PageHeader
          title="Pensjon"
          subtitle="Oppspart pensjon og fremtidig utbetaling"
        />

        <HeroNumber
          label="Sum pensjon"
          value={formatCurrency(pensjonData.sumPensjon)}
          changeLabel="Estimert ved pensjonering"
        />

        <BreakdownCards items={breakdownItems} />

        <OtpSection percentage={pensjonData.otpPercentage} trend="up" />

        <StackedAreaChart
          data={chartData}
          series={chartSeries}
          title="Pensjonsutvikling"
          height={200}
        />
      </div>
    </main>
  );
}

export default PensjonPage;
