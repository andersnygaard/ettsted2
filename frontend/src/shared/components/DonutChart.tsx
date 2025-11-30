/**
 * DonutChart Component
 *
 * CSS-based donut chart showing a percentage value.
 * Used for coverage visualization on the Gjeld page.
 *
 * Based on Nordic Minimal design from draft-1-gjeld.html
 */

import './DonutChart.css';

export interface DonutChartProps {
  percentage: number;
  label?: string;
  size?: number;
}

export function DonutChart({
  percentage,
  label = 'Dekning',
  size = 180,
}: DonutChartProps) {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  const degrees = (clampedPercentage / 100) * 360;

  return (
    <div
      className="donut-chart"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(
          var(--muted-sage) 0deg ${degrees}deg,
          var(--bone) ${degrees}deg 360deg
        )`,
      }}
    >
      <div className="donut-chart__inner">
        <div className="donut-chart__value">
          {clampedPercentage.toFixed(1).replace('.', ',')}%
        </div>
        <div className="donut-chart__label">{label}</div>
      </div>
    </div>
  );
}
