import { useAuth } from '../auth/useAuth';
import { formatCurrency } from '../../shared/utils/numberFormat';
import { Link } from 'react-router-dom';
import './DashboardPage.css';

// Placeholder data - will be replaced with API calls
const placeholderData = {
  netWorth: 2005194,
  monthlyChange: 0.0233,
  sumSavings: 970194,
  sumDebt: 823751,
  pension: 3848757,
  savingsRate: 0.3588,
  milestone: {
    label: 'Den første satisfying',
    target: 1000000,
    current: 970194,
  },
};

function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.username?.split(' ')[0] || 'bruker';

  // Get current month/year in Norwegian
  const currentDate = new Date();
  const monthYear = currentDate.toLocaleDateString('nb-NO', {
    month: 'long',
    year: 'numeric',
  });

  const milestoneProgress = Math.min(
    (placeholderData.milestone.current / placeholderData.milestone.target) * 100,
    100
  );
  const milestoneRemaining = Math.max(
    placeholderData.milestone.target - placeholderData.milestone.current,
    0
  );

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
        <div className="hero-value">{formatCurrency(placeholderData.netWorth)}</div>
        <div className="hero-change positive">
          +{(placeholderData.monthlyChange * 100).toFixed(2).replace('.', ',')}% denne måneden
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="quick-stats">
        <Link to="/portfolio" className="quick-stat">
          <div className="quick-stat-value">{formatCurrency(placeholderData.sumSavings)}</div>
          <div className="quick-stat-label">Sum sparing</div>
        </Link>
        <Link to="/portfolio" className="quick-stat">
          <div className="quick-stat-value">{formatCurrency(placeholderData.sumDebt)}</div>
          <div className="quick-stat-label">Sum gjeld</div>
        </Link>
        <Link to="/portfolio" className="quick-stat">
          <div className="quick-stat-value">{formatCurrency(placeholderData.pension)}</div>
          <div className="quick-stat-label">Pensjon</div>
        </Link>
        <Link to="/portfolio" className="quick-stat">
          <div className="quick-stat-value">
            {(placeholderData.savingsRate * 100).toFixed(2).replace('.', ',')}%
          </div>
          <div className="quick-stat-label">Sparerate</div>
        </Link>
      </div>

      {/* Milestone Section */}
      <div className="milestone-section">
        <div className="milestone-label">{placeholderData.milestone.label}</div>
        <div className="milestone-value">{formatCurrency(placeholderData.milestone.target)}</div>
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
