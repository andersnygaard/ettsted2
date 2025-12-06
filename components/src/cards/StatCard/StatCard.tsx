/**
 * StatCard Component
 *
 * Displays a metric with a value and label.
 * Can be clickable (with onClick handler) for navigation or interaction.
 *
 * Based on Nordic Minimal design system.
 */

import './StatCard.css';

export interface StatCardProps {
  value: string;
  label: string;
  onClick?: () => void;
}

export function StatCard({ value, label, onClick }: StatCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={`stat-card ${onClick ? 'stat-card--clickable' : ''}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__label">{label}</div>
    </div>
  );
}
