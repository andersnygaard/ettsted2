import { PageLayout, HeroNumber, ChartWithTabs, BreakdownCard, formatCurrency, Skeleton } from '@finans/components';
import { usePensjonData } from './usePensjonData';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { OtpSection } from './OtpSection';
import '@/shared/styles/PageSkeletons.css';
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
  usePageTitle('Pensjon');

  if (isLoading) {
    return (
      <PageLayout
        breadcrumb={[{ label: 'Hjem', path: '/oversikt' }, { label: 'Pensjon' }]}
        title="Pensjon"
        subtitle="Oppspart pensjon og fremtidig utbetaling"
        className="pensjon-page"
        aria-busy={true}
      >
        <div role="status" aria-live="polite" className="sr-only">
          Laster pensjonsdata...
        </div>
        <div className="skeleton-container">
          {/* Hero Section */}
          <div className="skeleton-hero-section">
            <Skeleton width={100} height={14} />
            <Skeleton width={300} height={72} style={{ marginTop: '16px' }} />
            <Skeleton width={240} height={20} style={{ marginTop: '12px' }} />
          </div>

          {/* Breakdown Cards */}
          <div className="skeleton-breakdown-cards">
            {[1, 2].map((i) => (
              <div key={i} className="skeleton-breakdown-card">
                <Skeleton width={40} height={40} variant="circular" style={{ marginBottom: '12px' }} />
                <Skeleton width={120} height={14} style={{ marginBottom: '8px' }} />
                <Skeleton width={180} height={28} style={{ marginBottom: '8px' }} />
                <Skeleton width={80} height={12} />
              </div>
            ))}
          </div>

          {/* OTP Section */}
          <div className="skeleton-otp-section">
            <Skeleton width={150} height={14} style={{ marginBottom: '12px' }} />
            <Skeleton height={12} style={{ marginBottom: '8px' }} />
            <Skeleton width={80} height={16} style={{ marginTop: '8px' }} />
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
        breadcrumb={[{ label: 'Hjem', path: '/oversikt' }, { label: 'Pensjon' }]}
        title="Pensjon"
        subtitle="Feil ved lasting av pensjonsdata. Prøv igjen senere."
        className="pensjon-page"
      >
        <></>
      </PageLayout>
    );
  }

  if (!pensjonData || pensjonData.totalPension === 0) {
    return (
      <PageLayout
        breadcrumb={[{ label: 'Hjem', path: '/oversikt' }, { label: 'Pensjon' }]}
        title="Pensjon"
        subtitle="Ingen pensjonsdata tilgjengelig. Legg til pensjonskontoer i porteføljen."
        className="pensjon-page"
      >
        <></>
      </PageLayout>
    );
  }

  // Calculate private vs public pension from breakdown
  const publicItem = pensjonData.breakdown.find(b => b.isPublicPension === true);
  const privateItems = pensjonData.breakdown.filter(b => !b.isPublicPension);

  const publicPension = publicItem?.amount || 0;
  const privatePension = privateItems.reduce((sum, item) => sum + item.amount, 0);

  return (
    <PageLayout
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

      <ChartWithTabs
        data={pensjonData.accountHistory}
        accounts={pensjonData.accounts}
        title="Pensjonsutvikling"
        height={200}
        totalColor="var(--muted-sage)"
      />
    </PageLayout>
  );
}

export default PensjonPage;
