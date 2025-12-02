/**
 * Skeleton Loading Component
 *
 * Base skeleton component with shimmer animation.
 * Used as building block for page-specific skeleton loaders.
 */

import './Skeleton.css'

export interface SkeletonProps {
  width?: string | number
  height?: string | number
  variant?: 'text' | 'rectangular' | 'circular'
  className?: string
  style?: React.CSSProperties
}

export function Skeleton({
  width,
  height,
  variant = 'rectangular',
  className = '',
  style,
}: SkeletonProps) {
  return (
    <div
      className={`skeleton skeleton--${variant} ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
      aria-busy="true"
      aria-live="polite"
    />
  )
}
