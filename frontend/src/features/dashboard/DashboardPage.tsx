import { useAuth } from '../auth/useAuth';
import { formatCurrency } from '../../shared/utils/numberFormat';
import { useNavigate } from 'react-router-dom';
import { useDashboardData } from './useDashboardData';
import { PageSkeleton, StatCard, SectionLink } from '@finans/components';
import { DashboardSkeleton } from '@/shared/components/skeletons';
import { MILESTONES } from '@/config/constants';
import './DashboardPage.css';

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: dashboardData, isLoading, error } = useDashboardData();
  const firstName = user?.nickname?.split(' ')[0] || 'bruker';

  // Calculate sparerate from user profile
  const profile = user?.profile;
  const sparerate = profile && profile.monthlySalary > 0 && profile.monthlySavings !== undefined
    ? (profile.monthlySavings / profile.monthlySalary) * 100
    : 0;

  // Use dashboard data if available, otherwise use empty state
  const data = dashboardData || {
    netWorth: 0,
    monthlyChange: 0,
    sumSparing: 0,
    sumGjeld: 0,
    pensjon: 0,
    sparerate: 0,
    nextMilestone: MILESTONES[0],
    currentTowardsMilestone: 0,
    sparingMonthlyChange: 0
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
  const heroValue = isNegativeNetWorth ? data.sumSparing : data.netWorth;
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
        centered
        className="dashboard-page"
      >
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
        centered
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
      centered
      className="dashboard-page"
    >

        {/* Hero Section - Net Worth or Sum Sparing */}
        <div className="hero-section">
          <div className="hero-label">{heroLabel}</div>
          <div className="hero-value">{formatCurrency(heroValue)}</div>
          <div className={`hero-change ${heroChange >= 0 ? 'positive' : 'negative'}`}>
            {heroChange >= 0 ? '+' : ''}{heroChange.toFixed(2).replace('.', ',')}% denne måneden
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="quick-stats">
          <StatCard
            value={isNegativeNetWorth ? formatCurrency(data.netWorth) : formatCurrency(data.sumSparing)}
            label={isNegativeNetWorth ? 'Netto formue' : 'Sum sparing'}
            onClick={() => navigate('/portfolio')}
          />
          <StatCard
            value={formatCurrency(data.sumGjeld)}
            label="Sum gjeld"
            onClick={() => navigate('/portfolio')}
          />
          <StatCard
            value={formatCurrency(data.pensjon)}
            label="Pensjon"
            onClick={() => navigate('/portfolio')}
          />
          <StatCard
            value={`${sparerate.toFixed(2).replace('.', ',')}%`}
            label="Sparerate"
            onClick={() => navigate('/portfolio')}
          />
        </div>

        {/* Milestone Section */}
        <div className="milestone-section">
          <div className="milestone-label">Neste milepæl</div>
          <div className="milestone-value">{formatCurrency(data.nextMilestone)}</div>
          <div className="milestone-bar">
            <div
              className="milestone-bar-fill"
              style={{ width: `${milestoneProgress}%` }}
            />
          </div>
          <div className="milestone-text">
            <span>Gjenstår: {formatCurrency(milestoneRemaining)}</span>
            <span>{Math.round(milestoneProgress)}%</span>
          </div>
        </div>

        {/* Section Links */}
        <div className="section-links">
          <SectionLink
            title="Portefølje"
            subtitle="Se alle kontoer og historikk"
            href="/portfolio"
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
