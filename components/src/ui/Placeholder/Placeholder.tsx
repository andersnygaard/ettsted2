/**
 * Placeholder Component
 *
 * Empty space-taking element. Default 32px tall.
 */

export interface PlaceholderProps {
  height?: string | number
  className?: string
}

export function Placeholder({ height = 32, className = '' }: PlaceholderProps) {
  return (
    <div
      className={className}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
      aria-hidden="true"
    />
  )
}
