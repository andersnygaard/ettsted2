import { useAuth } from '../auth/useAuth';
import { formatCurrency, formatPercentage, AreaChart } from '@finans/components';
import { useNavigate } from 'react-router-dom';
import { useDashboardData } from './useDashboardData';
import { PageSkeleton, StatCard, SectionLink } from '@finans/components';
import { DashboardSkeleton } from '@/shared/components/skeletons';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { MILESTONES } from '@/config/constants';
import './DashboardPage.css';

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
      <PageSkeleton
        breadcrumb={[{ label: 'Oversikt' }]}
        title={`God morgen, ${firstName}`}
        subtitle={monthYear}
        className="dashboard-page"
        aria-busy={true}
      >
        <div role="status" aria-live="polite" className="sr-only">
          Laster dashboarddata...
        </div>
        <DashboardSkeleton />
      </PageSkeleton>
    );
  }

  if (error) {
    return (
      <PageSkeleton
        breadcrumb={[{ label: 'Oversikt' }]}
        title={`God morgen, ${firstName}`}
        subtitle="Feil ved lasting av data"
        className="dashboard-page"
      >
        <></>
      </PageSkeleton>
    );
  }

  return (
    <PageSkeleton
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
    </PageSkeleton>
  );
}

export default DashboardPage;
