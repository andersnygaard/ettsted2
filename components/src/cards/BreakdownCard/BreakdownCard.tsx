/**
 * BreakdownCard Component
 *
 * Card showing a value breakdown with icon, label, and percentage.
 * Used for displaying category distributions (e.g., pension sources).
 *
 * Based on Nordic Minimal design system.
 */

import { formatCurrency } from '../../utils/format';
import './BreakdownCard.css';

export interface BreakdownCardProps {
  icon: string;
  iconLabel: string;
  value: number;
  label: string;
  percentage: number;
  variant?: 'primary' | 'secondary';
}

export function BreakdownCard({
  icon,
  iconLabel,
  value,
  label,
  percentage,
  variant = 'primary',
}: BreakdownCardProps) {
  return (
    <div className="breakdown-card">
      <div className={`breakdown-card__icon breakdown-card__icon--${variant}`}>
        <span role="img" aria-label={iconLabel}>{icon}</span>
      </div>
      <div className="breakdown-card__value">{formatCurrency(value)}</div>
      <div className="breakdown-card__label">{label}</div>
      <div className="breakdown-card__percent">{percentage}% av total</div>
    </div>
  );
}
