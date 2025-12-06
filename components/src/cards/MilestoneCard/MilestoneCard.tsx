/**
 * MilestoneCard Component
 *
 * Displays progress toward a financial milestone with a dark background,
 * target value, and progress bar.
 *
 * Based on Nordic Minimal design system.
 */

import { ProgressBar } from '../../forms/ProgressBar';
import './MilestoneCard.css';

export interface MilestoneCardProps {
  label: string;
  target: number;
  current: number;
  formatValue?: (value: number) => string;
}

export function MilestoneCard({
  label,
  target,
  current,
  formatValue
}: MilestoneCardProps) {
  const percentage = Math.min(100, (current / target) * 100);
  const remaining = Math.max(0, target - current);

  // Default formatter uses Norwegian locale
  const format = formatValue || ((v: number) => {
    return v.toLocaleString('nb-NO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  });

  return (
    <div className="milestone-card">
      <div className="milestone-label">{label}</div>
      <div className="milestone-target">{format(target)} kr</div>
      <ProgressBar
        value={percentage}
        variant="gold"
        height={8}
        leftLabel={`Gjenstår: ${format(remaining)} kr`}
        rightLabel={`${percentage.toFixed(0)}%`}
      />
    </div>
  );
}
