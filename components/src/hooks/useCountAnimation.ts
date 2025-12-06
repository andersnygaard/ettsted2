/**
 * useCountAnimation Hook
 *
 * Animates a number from 0 to target value using requestAnimationFrame.
 * Respects prefers-reduced-motion user preference.
 *
 * @param target - The final value to count to
 * @param options - Animation options (duration, enabled)
 * @returns Current animated value
 *
 * @example
 * const animatedValue = useCountAnimation(123456.78, { duration: 1000 });
 * return <div>{formatCurrency(animatedValue)}</div>
 */

import { useState, useEffect, useRef } from 'react';

export interface UseCountAnimationOptions {
  /**
   * Animation duration in milliseconds
   * @default 1000
   */
  duration?: number;

  /**
   * Enable or disable animation
   * @default true
   */
  enabled?: boolean;
}

export function useCountAnimation(
  target: number,
  options: UseCountAnimationOptions = {}
): number {
  const { duration = 1000, enabled = true } = options;
  const [current, setCurrent] = useState(enabled ? 0 : target);
  const startTime = useRef<number | null>(null);
  const frameRef = useRef<number>();

  useEffect(() => {
    // If animation is disabled, immediately set to target
    if (!enabled) {
      setCurrent(target);
      return;
    }

    // Check prefers-reduced-motion user preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCurrent(target);
      return;
    }

    // Reset start time for new animation
    startTime.current = null;

    const animate = (timestamp: number) => {
      if (!startTime.current) {
        startTime.current = timestamp;
      }

      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for natural feel
      // Formula: 1 - (1 - x)^3
      const eased = 1 - Math.pow(1 - progress, 3);

      // Apply easing to target value
      setCurrent(target * eased);

      // Continue animation if not complete
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    // Start animation
    frameRef.current = requestAnimationFrame(animate);

    // Cleanup on unmount or dependency change
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [target, duration, enabled]);

  return current;
}
