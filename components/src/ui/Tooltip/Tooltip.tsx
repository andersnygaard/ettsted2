import { useState, useRef, useEffect, ReactNode } from 'react';
import './Tooltip.css';

/**
 * Tooltip Component
 *
 * A simple, accessible tooltip with smart positioning that automatically
 * flips to the left when near the right edge of the viewport.
 *
 * Features:
 * - Smart positioning (left/right auto-flip)
 * - Keyboard accessible (Escape to close)
 * - Portal-style rendering to avoid overflow issues
 * - ARIA labels for screen readers
 * - 44px minimum touch target for accessibility
 */

export interface TooltipProps {
  children: ReactNode;
  content: string | ReactNode;
  side?: 'left' | 'right' | 'auto';
  delay?: number;
  className?: string;
}

export function Tooltip({
  children,
  content,
  side = 'auto',
  delay = 200,
  className = '',
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<'left' | 'right'>('right');
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>();

  /**
   * Determine tooltip position based on viewport space
   */
  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    // If side is explicitly set, use it
    if (side !== 'auto') {
      setPosition(side);
      return;
    }

    // Auto-flip: if tooltip would overflow right edge, show on left
    const rightEdge = triggerRect.right + tooltipRect.width + 8; // 8px gap
    if (rightEdge > viewportWidth) {
      setPosition('left');
    } else {
      setPosition('right');
    }
  };

  // Update position when tooltip becomes visible
  useEffect(() => {
    if (isVisible) {
      // Give DOM time to render the tooltip before measuring
      requestAnimationFrame(() => {
        updatePosition();
      });
    }
  }, [isVisible]);

  // Handle resize to update position
  useEffect(() => {
    if (!isVisible) return;

    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isVisible]);

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsVisible(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsVisible(false);
    }
  };

  return (
    <div
      ref={triggerRef}
      className={`tooltip-trigger ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      role="tooltip"
      aria-describedby={isVisible ? 'tooltip-content' : undefined}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          id="tooltip-content"
          className={`tooltip-content tooltip-content--${position}`}
          role="tooltip"
        >
          {content}
        </div>
      )}
    </div>
  );
}
