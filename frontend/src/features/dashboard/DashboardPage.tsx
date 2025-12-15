import { useAuth } from '../auth/useAuth';
import { formatCurrency, formatPercentage, AreaChart, Skeleton } from '@finans/components';
import { useNavigate } from 'react-router-dom';
import { useDashboardData } from './useDashboardData';
import { PageLayout, StatCard, SectionLink } from '@finans/components';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { MILESTONES } from '@/config/constants';
import './DashboardPage.css';
import '@/shared/styles/PageSkeletons.css';

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: dashboardData, isLoading, error } = useDashboardData();
  usePageTitle('Oversikt');
  const firstName = user?.nickname?.split(' ')[0] || 'bruker';

  // Calculate sparerate from user profile
  const profile = user?.profile;
  const sparerate = profile && profile.monthlySalary > 0 && profile.monthlySavings !== undefined
    ? (profile.monthlySavings / profile.monthlySalary) * 100
    : 0;

  // Use dashboard data if available, otherwise use empty state
  const data = dashboardData ?? {
    netWorth: 0,
    monthlyChange: 0,
    sumSavings: 0,
    totalDebt: 0,
    pensjon: 0,
    savingsRate: 0,
    nextMilestone: MILESTONES[0],
    currentTowardsMilestone: 0,
    sparingMonthlyChange: 0,
    netWorthHistory: []
  };

  // Get current month/year in Norwegian
  const currentDate = new Date();
  const monthYear = currentDate.toLocaleDateString('nb-NO', {
    month: 'long',
    year: 'numeric',
  });

  // Determine if net worth is negative and adjust metrics accordingly
  const isNegativeNetWorth = data.netWorth < 0;

  // Hero metrics: use savings when net worth is negative
  const heroValue = isNegativeNetWorth ? data.sumSavings : data.netWorth;
  const heroLabel = isNegativeNetWorth ? 'Sum sparing' : 'Netto formue';
  const heroChange = isNegativeNetWorth ? data.sparingMonthlyChange : data.monthlyChange;

  // Milestone: track savings progress toward next milestone
  const milestoneProgress = Math.max(
    0,
    Math.min((data.currentTowardsMilestone / data.nextMilestone) * 100, 100)
  );
  const milestoneRemaining = Math.max(
    data.nextMilestone - data.currentTowardsMilestone,
    0
  );

  // Handle loading and error states
  if (isLoading) {
    return (
      <PageLayout
        breadcrumb={[{ label: 'Oversikt' }]}
        title={`God morgen, ${firstName}`}
        subtitle={monthYear}
        className="dashboard-page"
        aria-busy={true}
      >
        <div role="status" aria-live="polite" className="sr-only">
          Laster dashboarddata...
        </div>
        {/* Dashboard Skeleton Loader */}
        <div className="skeleton-container">
          {/* Page Header */}
          <div className="skeleton-page-header">
            <Skeleton width={250} height={36} />
            <Skeleton width={180} height={20} />
          </div>

          {/* Hero Section */}
          <div className="skeleton-hero-section">
            <Skeleton width={120} height={14} />
            <Skeleton width={300} height={72} style={{ marginTop: '16px' }} />
            <Skeleton width={200} height={28} style={{ marginTop: '12px' }} />
          </div>

          {/* Quick Stats Grid */}
          <div className="skeleton-quick-stats">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton-stat-card">
                <Skeleton height={40} />
                <Skeleton height={12} style={{ marginTop: '8px' }} />
              </div>
            ))}
          </div>

          {/* Milestone Section */}
          <div className="skeleton-milestone-section">
            <Skeleton width={150} height={14} style={{ marginBottom: '8px' }} />
            <Skeleton width={200} height={48} style={{ marginBottom: '16px' }} />
            <Skeleton height={12} style={{ marginBottom: '8px' }} />
            <div style={{ display: 'flex', gap: '16px' }}>
              <Skeleton width={200} height={14} />
              <Skeleton width={50} height={14} />
            </div>
          </div>

          {/* Section Links */}
          <div className="skeleton-section-links">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-section-link">
                <div>
                  <Skeleton width={120} height={16} style={{ marginBottom: '8px' }} />
                  <Skeleton width={180} height={14} />
                </div>
                <Skeleton width={20} height={20} variant="rectangular" />
              </div>
            ))}
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout
        breadcrumb={[{ label: 'Oversikt' }]}
        title={`God morgen, ${firstName}`}
        subtitle="Feil ved lasting av data"
        className="dashboard-page"
      >
        <></>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      breadcrumb={[{ label: 'Oversikt' }]}
      title={`God morgen, ${firstName}`}
      subtitle={monthYear}
      className="dashboard-page"
    >

        {/* Hero Section - Net Worth or Sum Sparing */}
        <div className="dashboard-hero">
          <div className="dashboard-hero__label">{heroLabel}</div>
          <div className="dashboard-hero__value">{formatCurrency(heroValue)}</div>
          <div className={`dashboard-hero__change ${heroChange >= 0 ? 'dashboard-hero__change--positive' : 'dashboard-hero__change--negative'}`}>
            {heroChange >= 0 ? '+' : ''}{formatPercentage(heroChange / 100)} denne måneden
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="dashboard-stats">
          <StatCard
            value={isNegativeNetWorth ? formatCurrency(data.netWorth) : formatCurrency(data.sumSavings)}
            label={isNegativeNetWorth ? 'Netto formue' : 'Sum sparing'}
            onClick={() => navigate('/portefolje')}
          />
          <StatCard
            value={formatCurrency(data.totalDebt)}
            label="Sum gjeld"
            onClick={() => navigate('/portefolje')}
          />
          <StatCard
            value={formatCurrency(data.pensjon)}
            label="Pensjon"
            onClick={() => navigate('/portefolje')}
          />
          <StatCard
            value={formatPercentage(sparerate / 100)}
            label="Sparerate"
            onClick={() => navigate('/portefolje')}
          />
        </div>

        {/* Milestone Section */}
        <div className="dashboard-milestone">
          <div className="dashboard-milestone__label">Neste milepæl</div>
          <div className="dashboard-milestone__value">{formatCurrency(data.nextMilestone)}</div>
          <div className="dashboard-milestone__progress">
            <div className="dashboard-milestone__bar">
              <div
                className="dashboard-milestone__fill"
                style={{ width: `${milestoneProgress}%` }}
              />
            </div>
            <div className="dashboard-milestone__text">
              <span>Gjenstår: {formatCurrency(milestoneRemaining)}</span>
              <span>{Math.round(milestoneProgress)}%</span>
            </div>
          </div>
        </div>

        {/* Net Worth History Chart */}
        {data.netWorthHistory.length >= 2 && (
          <div className="dashboard-chart">
            <AreaChart
              data={data.netWorthHistory}
              title="Netto formue"
              height={160}
              color="var(--charcoal)"
            />
          </div>
        )}

        {/* Section Links */}
        <div className="dashboard-links">
          <SectionLink
            title="Portefølje"
            subtitle="Se alle kontoer og historikk"
            href="/portefolje"
          />
          <SectionLink
            title="Sparing & F.I.R.E."
            subtitle="Fremgang mot økonomisk frihet"
            href="/sparing"
          />
          <SectionLink
            title="Kalkulatorer"
            subtitle="Rente, lån og simuleringer"
            href="/kalkulatorer"
          />
        </div>
    </PageLayout>
  );
}

export default DashboardPage;
