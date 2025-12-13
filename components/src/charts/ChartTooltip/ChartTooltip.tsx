import React, { RefObject, useEffect, useState } from 'react';
import { formatCurrency, formatDate } from '@finans/components';
import './ChartTooltip.css';

export interface TooltipValue {
  label: string;
  value: number;
  color: string;
}

export interface ChartTooltipProps {
  visible: boolean;
  x: number;
  y: number;
  date: Date;
  values: TooltipValue[];
  total?: number;
  containerRef?: RefObject<HTMLElement>;
}

/**
 * ChartTooltip Component
 *
 * Displays hover information for D3 charts with date and value data.
 * Automatically positions itself to avoid overflow.
 *
 * Design: Nordic Minimal - dark charcoal background with warm white text.
 */
export function ChartTooltip({
  visible,
  x,
  y,
  date,
  values,
  total,
  containerRef,
}: ChartTooltipProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = React.useRef<HTMLDivElement>(null);

  // Calculate tooltip position to avoid overflow
  useEffect(() => {
    if (!visible || !tooltipRef.current) return;

    const tooltip = tooltipRef.current;
    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;

    let newX = x;
    let newY = y - tooltipHeight - 12; // 12px offset above cursor

    // Get container bounds if provided
    if (containerRef?.current) {
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const horizontalOffset = 12;

      // Determine if cursor is in right half of container
      const isRightHalf = x > containerWidth / 2;

      // Position horizontally: flip based on which half of chart cursor is in
      if (isRightHalf) {
        // Right half: position tooltip to LEFT of cursor
        newX = x - tooltipWidth - horizontalOffset;
      } else {
        // Left half: position tooltip to RIGHT of cursor
        newX = x + horizontalOffset;
      }

      // Check left overflow (clamp)
      if (newX < 8) {
        newX = 8;
      }

      // Check right overflow (clamp)
      if (newX + tooltipWidth > containerWidth) {
        newX = containerWidth - tooltipWidth - 8;
      }

      // Check top overflow (show below cursor if above doesn't fit)
      if (newY < 8) {
        newY = y + 12; // 12px offset below cursor
      }

      // Check bottom overflow
      if (newY + tooltipHeight > containerRect.height) {
        newY = containerRect.height - tooltipHeight - 8;
      }
    }

    setPosition({ x: newX, y: newY });
  }, [visible, x, y, containerRef]);

  if (!visible) return null;

  // Show total if provided (for stacked charts), otherwise show first value
  const displayValue = total !== undefined ? total : values[0]?.value || 0;

  return (
    <div
      ref={tooltipRef}
      className="chart-tooltip"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      role="tooltip"
      aria-live="polite"
    >
      <div className="chart-tooltip__value">{formatCurrency(displayValue)}</div>
      <div className="chart-tooltip__date">{formatDate(date)}</div>

      {/* Show breakdown for multiple values (stacked charts) */}
      {values.length > 1 && (
        <div className="chart-tooltip__breakdown">
          {values.map((item, index) => (
            <div key={index} className="chart-tooltip__breakdown-item">
              <span
                className="chart-tooltip__breakdown-color"
                style={{ backgroundColor: item.color }}
              />
              <span className="chart-tooltip__breakdown-label">{item.label}</span>
              <span className="chart-tooltip__breakdown-value">
                {formatCurrency(item.value)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
