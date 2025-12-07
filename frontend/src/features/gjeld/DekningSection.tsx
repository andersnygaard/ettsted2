/**
 * DekningSection Component
 *
 * Shows debt coverage visualization with donut chart and info text.
 * Displays how much of debt is covered by savings.
 *
 * Based on Nordic Minimal design from draft-1-gjeld.html
 */

import { DonutChart, formatCurrency } from '@finans/components';

export interface DekningSectionProps {
  sumSavings: number;
  sumGjeld: number;
}

export function DekningSection({ sumSavings, sumGjeld }: DekningSectionProps) {
  const percentage = Math.min(100, (sumSavings / sumGjeld) * 100);
  const remaining = Math.max(0, sumGjeld - sumSavings);

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
