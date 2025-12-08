import { Link } from 'react-router-dom';
import { ReactNode } from 'react';
import './CalculatorCard.css';

export interface CalculatorCardProps {
  /** Icon component or string to display */
  icon: ReactNode;
  /** Calculator title */
  title: string;
  /** Description of what the calculator does */
  description: string;
  /** Link to the calculator page */
  href: string;
  /** Optional background color for the icon */
  iconBg?: string;
  /** Optional additional CSS class */
  className?: string;
}

/**
 * CalculatorCard Component
 *
 * A clickable card for calculator navigation on the Kalkulatorer page.
 * Features hover lift effect and staggered animation support.
 *
 * Based on Nordic Minimal design from draft-1-kalkulatorer.html
 */
export function CalculatorCard({
  icon,
  title,
  description,
  href,
  iconBg,
  className = '',
}: CalculatorCardProps) {
  return (
    <Link to={href} className={`calc-card ${className}`.trim()}>
      <div
        className="calc-icon"
        style={iconBg ? { background: iconBg } : undefined}
      >
        {icon}
      </div>
      <div className="calc-title">{title}</div>
      <div className="calc-desc">{description}</div>
    </Link>
  );
}
