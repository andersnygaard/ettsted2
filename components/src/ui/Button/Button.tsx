import './Button.css'

/**
 * Button Component
 *
 * A versatile button component with primary and secondary variants.
 * Supports icons, disabled state, and custom styling.
 *
 * Based on Nordic Minimal design system.
 */
export interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  onClick?: () => void
  disabled?: boolean
  icon?: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

export function Button({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
  icon,
  type = 'button',
  className = ''
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="btn__icon">{icon}</span>}
      {children}
    </button>
  )
}
