import { useAuth } from '../auth/useAuth';
import { formatCurrency } from '../../shared/utils/numberFormat';
import { Link } from 'react-router-dom';
import { useDashboardData } from './useDashboardData';
import { PageHeader, Placeholder } from '@finans/components';
import './DashboardPage.css';

function DashboardPage() {
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
    nextMilestone: 100000,
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

  // Milestone: track savings progress when net worth is negative
  const milestoneBase = isNegativeNetWorth ? data.sumSparing : data.currentTowardsMilestone;
  const milestoneProgress = Math.max(
    0,
    Math.min((milestoneBase / data.nextMilestone) * 100, 100)
  );
  const milestoneRemaining = Math.max(
    data.nextMilestone - milestoneBase,
    0
  );

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="dashboard-page">
        <Placeholder/>
        <PageHeader title={`God morgen, ${firstName}`} subtitle="Laster..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <Placeholder/>
        <PageHeader title={`God morgen, ${firstName}`} subtitle="Feil ved lasting av data" />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Placeholder/>
      <PageHeader title={`God morgen, ${firstName}`} subtitle={monthYear} />

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
        {isNegativeNetWorth ? (
          <Link to="/portfolio" className="quick-stat">
            <div className="quick-stat-value">{formatCurrency(data.netWorth)}</div>
            <div className="quick-stat-label">Netto formue</div>
          </Link>
        ) : (
          <Link to="/portfolio" className="quick-stat">
            <div className="quick-stat-value">{formatCurrency(data.sumSparing)}</div>
            <div className="quick-stat-label">Sum sparing</div>
          </Link>
        )}
        <Link to="/portfolio" className="quick-stat">
          <div className="quick-stat-value">{formatCurrency(data.sumGjeld)}</div>
          <div className="quick-stat-label">Sum gjeld</div>
        </Link>
        <Link to="/portfolio" className="quick-stat">
          <div className="quick-stat-value">{formatCurrency(data.pensjon)}</div>
          <div className="quick-stat-label">Pensjon</div>
        </Link>
        <Link to="/portfolio" className="quick-stat">
          <div className="quick-stat-value">
            {sparerate.toFixed(2).replace('.', ',')}%
          </div>
          <div className="quick-stat-label">Sparerate</div>
        </Link>
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
        <Link to="/portfolio" className="section-link">
          <div>
            <div className="section-link-title">Portefølje</div>
            <div className="section-link-subtitle">Se alle kontoer og historikk</div>
          </div>
          <span className="section-link-arrow">→</span>
        </Link>
        <Link to="/portfolio" className="section-link">
          <div>
            <div className="section-link-title">Sparing & F.I.R.E.</div>
            <div className="section-link-subtitle">Fremgang mot økonomisk frihet</div>
          </div>
          <span className="section-link-arrow">→</span>
        </Link>
        <Link to="/calculators" className="section-link">
          <div>
            <div className="section-link-title">Kalkulatorer</div>
            <div className="section-link-subtitle">Rente, lån og simuleringer</div>
          </div>
          <span className="section-link-arrow">→</span>
        </Link>
      </div>
    </div>
  );
}

export default DashboardPage;
