import './Avatar.css'

/**
 * Avatar Component
 *
 * Displays user initials in a circular badge.
 * Supports three size variants: small, medium, large.
 *
 * Based on Nordic Minimal design system.
 * Accessible with ARIA labels for screen readers.
 */
export interface AvatarProps {
  name: string
  size?: 'small' | 'medium' | 'large'
}

export function Avatar({ name, size = 'medium' }: AvatarProps) {
  // Extract initials from name: take first char of first and second word
  // Fallback: take first 2 chars if no space
  const parts = name.trim().split(/\s+/)
  const displayInitials =
    parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase()

  return (
    <div
      className={`avatar avatar--${size}`}
      role="img"
      aria-label={`${name} avatar`}
    >
      {displayInitials}
    </div>
  )
}
