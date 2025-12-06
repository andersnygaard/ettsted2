/**
 * ProgressBar Component
 *
 * Displays a horizontal progress bar with multiple style variants.
 * Animates from 0% to target width on mount and value changes.
 * Used for showing progress toward milestones, savings goals, debt coverage, etc.
 *
 * Based on Nordic Minimal design system.
 */

import { useLayoutEffect, useRef } from 'react';
import './ProgressBar.css';

export interface ProgressBarProps {
  value: number;           // 0-100, percentage value
  variant?: 'default' | 'gold' | 'blue';
  height?: number;         // Height in pixels
  leftLabel?: string;      // Optional label on the left
  rightLabel?: string;     // Optional label on the right
  animate?: boolean;       // Enable/disable animation (default: true)
  delay?: number;          // Animation delay in milliseconds (default: 0)
}

export function ProgressBar({
  value,
  variant = 'default',
  height = 8,
  leftLabel,
  rightLabel,
  animate = true,
  delay = 0
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const fillRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!animate || !fillRef.current) return;

    // Reset to 0 width before animation starts
    fillRef.current.style.width = '0%';

    // Trigger animation after a frame to ensure transition is applied
    const timeoutId = setTimeout(() => {
      if (fillRef.current) {
        fillRef.current.style.width = `${clampedValue}%`;
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [clampedValue, animate, delay]);

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
          ref={fillRef}
          className="progress-bar__fill"
          style={{
            width: animate ? '0%' : `${clampedValue}%`,
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
