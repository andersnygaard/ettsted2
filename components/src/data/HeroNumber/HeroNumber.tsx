/**
 * HeroNumber Component
 *
 * Displays a large, prominent value with optional change indicator.
 * Used for key financial metrics like net worth, savings total, etc.
 *
 * Based on Nordic Minimal design system.
 */

import './HeroNumber.css';

export interface HeroNumberProps {
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
}

export function HeroNumber({ label, value, change, changeLabel }: HeroNumberProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <div className="hero-section">
      <div className="hero-label">{label}</div>
      <div className="hero-value">{value}</div>
      {change !== undefined && (
        <div
          className={`hero-change ${isPositive ? 'hero-change--positive' : ''} ${
            isNegative ? 'hero-change--negative' : ''
          }`}
        >
          {isPositive ? '+' : ''}
          {change.toFixed(2)}% {changeLabel}
        </div>
      )}
    </div>
  );
}
