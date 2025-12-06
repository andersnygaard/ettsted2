import { PageSkeleton, HeroNumber, StackedAreaChart, BreakdownCard } from '@finans/components';
import type { StackedDataPoint, Series } from '@finans/components';
import { PensjonSkeleton } from '@/shared/components';
import { formatCurrency } from '@/shared/utils/numberFormat';
import { usePensjonData } from './usePensjonData';
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
    return (
      <PageSkeleton
        breadcrumb={[{ label: 'Hjem', path: '/dashboard' }, { label: 'Pensjon' }]}
        title="Pensjon"
        subtitle="Oppspart pensjon og fremtidig utbetaling"
        className="pensjon-page"
      >
        <PensjonSkeleton />
      </PageSkeleton>
    );
  }

  if (error) {
    return (
      <PageSkeleton
        breadcrumb={[{ label: 'Hjem', path: '/dashboard' }, { label: 'Pensjon' }]}
        title="Pensjon"
        subtitle="Feil ved lasting av pensjonsdata. Prøv igjen senere."
        className="pensjon-page"
      >
        <></>
      </PageSkeleton>
    );
  }

  if (!pensjonData || pensjonData.sumPensjon === 0) {
    return (
      <PageSkeleton
        breadcrumb={[{ label: 'Hjem', path: '/dashboard' }, { label: 'Pensjon' }]}
        title="Pensjon"
        subtitle="Ingen pensjonsdata tilgjengelig. Legg til pensjonskontoer i porteføljen."
        className="pensjon-page"
      >
        <></>
      </PageSkeleton>
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
    <PageSkeleton
      breadcrumb={[{ label: 'Hjem', path: '/dashboard' }, { label: 'Pensjon' }]}
      title="Pensjon"
      subtitle="Oppspart pensjon og fremtidig utbetaling"
      className="pensjon-page"
    >

        <HeroNumber
          label="Sum pensjon"
          value={formatCurrency(pensjonData.sumPensjon)}
          changeLabel={`Estimert ved pensjonering: ${formatCurrency(pensjonData.estimatedAtRetirement)}`}
        />

        <section className="breakdown-section">
          <BreakdownCard
            icon="🏢"
            iconLabel="Arbeidsgiver"
            value={arbeidsgiver}
            label="Pensjon arbeidsgiver"
            percentage={Math.round(arbeidsgiverPercent)}
            variant="primary"
          />
          <BreakdownCard
            icon="🏛️"
            iconLabel="NAV"
            value={nav}
            label="Pensjon NAV"
            percentage={Math.round(navPercent)}
            variant="secondary"
          />
        </section>

        <OtpSection percentage={Math.round(pensjonData.otpPercent)} trend="up" />

      <StackedAreaChart
        data={chartData}
        series={chartSeries}
        title="Pensjonsutvikling"
        height={200}
      />
    </PageSkeleton>
  );
}

export default PensjonPage;
