import { useAuth } from '../auth/useAuth';
import { formatCurrency } from '../../shared/utils/numberFormat';
import { Link } from 'react-router-dom';
import { useDashboardData } from './useDashboardData';
import './DashboardPage.css';

function DashboardPage() {
  const { user } = useAuth();
  const { data: dashboardData, isLoading, error } = useDashboardData();
  const firstName = user?.nickname?.split(' ')[0] || 'bruker';

  // Use dashboard data if available, otherwise use empty state
  const data = dashboardData || {
    netWorth: 0,
    monthlyChange: 0,
    sumSparing: 0,
    sumGjeld: 0,
    pensjon: 0,
    sparerate: 0,
    nextMilestone: 100000,
    currentTowardsMilestone: 0
  };

  // Get current month/year in Norwegian
  const currentDate = new Date();
  const monthYear = currentDate.toLocaleDateString('nb-NO', {
    month: 'long',
    year: 'numeric',
  });

  const milestoneProgress = Math.min(
    (data.currentTowardsMilestone / data.nextMilestone) * 100,
    100
  );
  const milestoneRemaining = Math.max(
    data.nextMilestone - data.currentTowardsMilestone,
    0
  );

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="dashboard-page">
        <div className="page-header">
          <h1 className="page-title">God morgen, {firstName}</h1>
          <p className="page-subtitle">Laster...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="page-header">
          <h1 className="page-title">God morgen, {firstName}</h1>
          <p className="page-subtitle">Feil ved lasting av data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">God morgen, {firstName}</h1>
        <p className="page-subtitle">{monthYear}</p>
      </div>

      {/* Hero Section - Net Worth */}
      <div className="hero-section">
        <div className="hero-label">Netto formue</div>
        <div className="hero-value">{formatCurrency(data.netWorth)}</div>
        <div className={`hero-change ${data.monthlyChange >= 0 ? 'positive' : 'negative'}`}>
          {data.monthlyChange >= 0 ? '+' : ''}{data.monthlyChange.toFixed(2).replace('.', ',')}% denne måneden
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="quick-stats">
        <Link to="/portfolio" className="quick-stat">
          <div className="quick-stat-value">{formatCurrency(data.sumSparing)}</div>
          <div className="quick-stat-label">Sum sparing</div>
        </Link>
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
            {data.sparerate.toFixed(2).replace('.', ',')}%
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
