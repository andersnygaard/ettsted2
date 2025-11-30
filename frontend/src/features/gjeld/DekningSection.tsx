/**
 * DekningSection Component
 *
 * Shows debt coverage visualization with donut chart and info text.
 * Displays how much of debt is covered by savings.
 *
 * Based on Nordic Minimal design from draft-1-gjeld.html
 */

import { DonutChart } from '@/shared/components';
import { formatCurrency } from '@/shared/utils/numberFormat';

export interface DekningSectionProps {
  sumSparing: number;
  sumGjeld: number;
}

export function DekningSection({ sumSparing, sumGjeld }: DekningSectionProps) {
  const percentage = Math.min(100, (sumSparing / sumGjeld) * 100);
  const remaining = Math.max(0, sumGjeld - sumSparing);

  return (
    <section className="dekning-section">
      <DonutChart percentage={percentage} label="Dekning" />
      <div className="dekning-info">
        <h3>Dekning for gjeld</h3>
        <p>
          Din sparing dekker nå {percentage >= 100 ? 'all' : 'nesten all'} gjeld.
          Ved 100% har du teknisk sett null netto gjeld - sparingen din kan betale ned alt.
        </p>
        <div className="dekning-highlight">
          Gjenstår: {formatCurrency(remaining)}
        </div>
      </div>
    </section>
  );
}
