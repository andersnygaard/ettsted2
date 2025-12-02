import './Container.css'

/**
 * Container Component
 *
 * Provides consistent max-width and padding for page layouts.
 * Supports three width variants for different page types.
 *
 * Based on Nordic Minimal design system.
 */
export interface ContainerProps {
  children: React.ReactNode
  width?: 'default' | 'narrow' | 'wide'
  className?: string
}

export function Container({
  children,
  width = 'default',
  className = ''
}: ContainerProps) {
  return (
    <div className={`container container--${width} ${className}`}>
      {children}
    </div>
  )
}
