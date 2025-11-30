import { PageHeader, HeroNumber, StackedAreaChart, StackedDataPoint, Series } from '@/shared/components';
import { PensjonSkeleton } from '@/shared/components/skeletons';
import { formatCurrency } from '@/shared/utils/numberFormat';
import { usePensjonData } from './usePensjonData';
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
  const { data: pensjonData, isLoading, error } = usePensjonData();

  if (isLoading) {
    return <PensjonSkeleton />;
  }

  if (error) {
    return (
      <main className="pensjon-page">
        <div className="container container--narrow">
          <p>Feil ved lasting av pensjonsdata. Prøv igjen senere.</p>
        </div>
      </main>
    );
  }

  if (!pensjonData || pensjonData.sumPensjon === 0) {
    return (
      <main className="pensjon-page">
        <div className="container container--narrow">
          <PageHeader
            title="Pensjon"
            subtitle="Oppspart pensjon og fremtidig utbetaling"
          />
          <p>Ingen pensjonsdata tilgjengelig. Legg til pensjonskontoer i porteføljen.</p>
        </div>
      </main>
    );
  }

  // Calculate arbeidsgiver vs NAV from breakdown
  const arbeidsgiverItem = pensjonData.breakdown.find(b =>
    b.name.toLowerCase().includes('arbeidsgiver')
  );
  const navItem = pensjonData.breakdown.find(b =>
    b.name.toLowerCase().includes('folketrygd') ||
    b.name.toLowerCase().includes('nav')
  );

  const arbeidsgiver = arbeidsgiverItem?.amount || 0;
  const nav = navItem?.amount || 0;
  const arbeidsgiverPercent = arbeidsgiverItem?.percent || 0;
  const navPercent = navItem?.percent || 0;

  // Breakdown items for cards
  const breakdownItems: BreakdownItem[] = [
    {
      icon: '🏢',
      iconLabel: 'Arbeidsgiver',
      value: arbeidsgiver,
      label: 'Pensjon arbeidsgiver',
      percentage: Math.round(arbeidsgiverPercent),
      variant: 'arbeidsgiver',
    },
    {
      icon: '🏛️',
      iconLabel: 'NAV',
      value: nav,
      label: 'Pensjon NAV',
      percentage: Math.round(navPercent),
      variant: 'nav',
    },
  ];

  // Chart data from history
  const chartData: StackedDataPoint[] = pensjonData.history.map(h => ({
    date: h.date,
    arbeidsgiver: h.arbeidsgiver,
    nav: h.folketrygden,
  }));

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
          changeLabel={`Estimert ved pensjonering: ${formatCurrency(pensjonData.estimatedAtRetirement)}`}
        />

        <BreakdownCards items={breakdownItems} />

        <OtpSection percentage={Math.round(pensjonData.otpPercent)} trend="up" />

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
