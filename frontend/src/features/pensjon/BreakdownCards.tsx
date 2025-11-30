/**
 * BreakdownCards Component
 *
 * Two-column grid showing pension breakdown by source.
 *
 * Based on Nordic Minimal design from draft-1-pensjon.html
 */

import { formatCurrency } from '@/shared/utils/numberFormat';

export interface BreakdownItem {
  icon: string;
  iconLabel: string;
  value: number;
  label: string;
  percentage: number;
  variant: 'arbeidsgiver' | 'nav';
}

export interface BreakdownCardsProps {
  items: BreakdownItem[];
}

export function BreakdownCards({ items }: BreakdownCardsProps) {
  return (
    <section className="breakdown-section">
      {items.map((item) => (
        <div key={item.label} className="breakdown-card">
          <div className={`breakdown-icon breakdown-icon--${item.variant}`}>
            <span role="img" aria-label={item.iconLabel}>{item.icon}</span>
          </div>
          <div className="breakdown-value">{formatCurrency(item.value)}</div>
          <div className="breakdown-label">{item.label}</div>
          <div className="breakdown-percent">{item.percentage}% av total</div>
        </div>
      ))}
    </section>
  );
}
