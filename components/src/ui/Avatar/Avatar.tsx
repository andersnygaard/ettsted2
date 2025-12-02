import './Avatar.css'

/**
 * Avatar Component
 *
 * Displays user initials in a circular badge.
 * Supports three size variants: small, medium, large.
 *
 * Based on Nordic Minimal design system.
 */
export interface AvatarProps {
  initials: string
  size?: 'small' | 'medium' | 'large'
}

export function Avatar({ initials, size = 'medium' }: AvatarProps) {
  // Display max 2 characters, uppercase
  const displayInitials = initials.slice(0, 2).toUpperCase()

  return (
    <div className={`avatar avatar--${size}`}>
      {displayInitials}
    </div>
  )
}
