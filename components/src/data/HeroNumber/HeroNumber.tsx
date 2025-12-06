/**
 * HeroNumber Component
 *
 * Displays a large, prominent value with optional change indicator.
 * Used for key financial metrics like net worth, savings total, etc.
 *
 * Supports smooth counting animation when provided a raw number.
 *
 * Based on Nordic Minimal design system.
 */

import { useCountAnimation } from '../../hooks/useCountAnimation';
import './HeroNumber.css';

export interface HeroNumberProps {
  label: string;
  /**
   * Value to display - can be a formatted string or a raw number.
   * If a number is provided, it will be animated and formatted as Norwegian currency.
   */
  value: string | number;
  change?: number;
  changeLabel?: string;
  /**
   * Enable counting animation (only applies when value is a number)
   * @default true
   */
  animate?: boolean;
  /**
   * Animation duration in milliseconds
   * @default 1000
   */
  animationDuration?: number;
}

export function HeroNumber({
  label,
  value,
  change,
  changeLabel,
  animate = true,
  animationDuration = 1000,
}: HeroNumberProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  // Determine if value is a number or string
  const isNumericValue = typeof value === 'number';

  // Use animation hook only for numeric values
  const animatedValue = useCountAnimation(
    isNumericValue ? value : 0,
    {
      duration: animationDuration,
      enabled: isNumericValue && animate,
    }
  );

  // Format the displayed value
  const displayValue = isNumericValue
    ? formatCurrency(animatedValue)
    : value;

  return (
    <div className="hero-section">
      <div className="hero-label">{label}</div>
      <div className="hero-value">{displayValue}</div>
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

/**
 * Format a number as Norwegian currency
 * Local implementation to avoid circular dependency
 */
function formatCurrency(value: number): string {
  // Format with Norwegian conventions
  const formatted = new Intl.NumberFormat('nb-NO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  return `${formatted} kr`;
}
