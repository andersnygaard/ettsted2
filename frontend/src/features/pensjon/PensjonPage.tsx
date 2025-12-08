import { PageSkeleton, HeroNumber, StackedAreaChart, BreakdownCard, formatCurrency } from '@finans/components';
import type { StackedDataPoint, Series } from '@finans/components';
import { PensjonSkeleton } from '@/shared/components';
import { usePensjonData } from './usePensjonData';
import { OtpSection } from './OtpSection';
import './PensjonPage.css';

/**
 * PensjonPage Component
 *
 * Pension overview page showing total pension savings,
 * breakdown by source, private vs public pension progress, and development chart.
 *
 * Based on Nordic Minimal design from draft-1-pensjon.html
 */
function PensjonPage() {
  const { data: pensjonData, isLoading, error } = usePensjonData();

  if (isLoading) {
    return (
      <PageSkeleton
        breadcrumb={[{ label: 'Hjem', path: '/oversikt' }, { label: 'Pensjon' }]}
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
        breadcrumb={[{ label: 'Hjem', path: '/oversikt' }, { label: 'Pensjon' }]}
        title="Pensjon"
        subtitle="Feil ved lasting av pensjonsdata. Prøv igjen senere."
        className="pensjon-page"
      >
        <></>
      </PageSkeleton>
    );
  }

  if (!pensjonData || pensjonData.totalPension === 0) {
    return (
      <PageSkeleton
        breadcrumb={[{ label: 'Hjem', path: '/oversikt' }, { label: 'Pensjon' }]}
        title="Pensjon"
        subtitle="Ingen pensjonsdata tilgjengelig. Legg til pensjonskontoer i porteføljen."
        className="pensjon-page"
      >
        <></>
      </PageSkeleton>
    );
  }

  // Calculate private vs public pension from breakdown
  const publicItem = pensjonData.breakdown.find(b => b.isPublicPension === true);
  const privateItems = pensjonData.breakdown.filter(b => !b.isPublicPension);

  const publicPension = publicItem?.amount || 0;
  const privatePension = privateItems.reduce((sum, item) => sum + item.amount, 0);

  // Chart data from history
  const chartData: StackedDataPoint[] = pensjonData.history.map(h => ({
    date: h.date,
    privatePension: h.privatePension,
    publicPension: h.publicPension,
  }));

  const chartSeries: Series[] = [
    { key: 'privatePension', color: 'var(--pale-blue)', label: 'Privat pensjon' },
    { key: 'publicPension', color: 'var(--orange, #D4956A)', label: 'Offentlig pensjon' },
  ];

  return (
    <PageSkeleton
      breadcrumb={[{ label: 'Hjem', path: '/oversikt' }, { label: 'Pensjon' }]}
      title="Pensjon"
      subtitle="Oppspart pensjon og fremtidig utbetaling"
      className="pensjon-page"
    >

        <HeroNumber
          label="Sum pensjon"
          value={formatCurrency(pensjonData.totalPension)}
          changeLabel={`Estimert ved pensjonering: ${formatCurrency(pensjonData.estimatedAtRetirement)}`}
        />

        <section className="breakdown-section">
          <BreakdownCard
            icon="🏢"
            iconLabel="Privat"
            value={privatePension}
            label="Privat pensjon"
            percentage={Math.round(pensjonData.privatePercent)}
            variant="primary"
          />
          <BreakdownCard
            icon="🏛️"
            iconLabel="Offentlig"
            value={publicPension}
            label="Offentlig pensjon"
            percentage={Math.round(pensjonData.publicPercent)}
            variant="secondary"
          />
        </section>

        <OtpSection percentage={Math.round(pensjonData.privatePercent)} trend="up" />

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
