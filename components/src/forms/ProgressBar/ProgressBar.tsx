/**
 * ProgressBar Component
 *
 * Displays a horizontal progress bar with multiple style variants.
 * Used for showing progress toward milestones, savings goals, debt coverage, etc.
 *
 * Based on Nordic Minimal design system.
 */

import './ProgressBar.css';

export interface ProgressBarProps {
  value: number;           // 0-100, percentage value
  variant?: 'default' | 'gold' | 'blue';
  height?: number;         // Height in pixels
  leftLabel?: string;      // Optional label on the left
  rightLabel?: string;     // Optional label on the right
}

export function ProgressBar({
  value,
  variant = 'default',
  height = 8,
  leftLabel,
  rightLabel
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="progress-bar-container">
      <div
        className={`progress-bar progress-bar--${variant}`}
        style={{
          height: `${height}px`,
          borderRadius: `${height / 2}px`
        }}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="progress-bar__fill"
          style={{
            width: `${clampedValue}%`,
            borderRadius: `${height / 2}px`
          }}
        />
      </div>
      {(leftLabel || rightLabel) && (
        <div className="progress-bar__labels">
          <span className="progress-bar__label-left">{leftLabel}</span>
          <span className="progress-bar__label-right">{rightLabel}</span>
        </div>
      )}
    </div>
  );
}
