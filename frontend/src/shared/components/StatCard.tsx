import { Link } from 'react-router-dom';
import './StatCard.css';

/**
 * StatCard Component
 *
 * Displays a metric with a value and label.
 * Can be clickable (with href or onClick handler) for navigation or interaction.
 *
 * Based on Nordic Minimal design system.
 */
export interface StatCardProps {
  value: string;
  label: string;
  href?: string;
  onClick?: () => void;
}

export function StatCard({ value, label, href, onClick }: StatCardProps) {
  const content = (
    <>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__label">{label}</div>
    </>
  );

  if (href) {
    return (
      <Link to={href} className="stat-card stat-card--clickable">
        {content}
      </Link>
    );
  }

  return (
    <div
      className={`stat-card ${onClick ? 'stat-card--clickable' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {content}
    </div>
  );
}
