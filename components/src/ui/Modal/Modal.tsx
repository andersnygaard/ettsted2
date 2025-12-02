import { useEffect } from 'react'
import './Modal.css'

/**
 * Modal Component
 *
 * A reusable modal dialog with header, body, and optional footer sections.
 * Includes overlay backdrop, keyboard navigation, and focus trap for accessibility.
 *
 * Based on Nordic Minimal design system.
 */
export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  closeOnOverlay?: boolean
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  closeOnOverlay = true
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return

    // Handle Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    // Lock body scroll
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Add event listener
    document.addEventListener('keydown', handleEscape)

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen, onClose])

  // Focus trap implementation
  useEffect(() => {
    if (!isOpen) return

    const modalElement = document.querySelector('.modal') as HTMLElement
    if (!modalElement) return

    // Get all focusable elements
    const focusableElements = modalElement.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Focus first element when modal opens
    firstElement?.focus()

    // Trap focus within modal
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleTab)

    return () => {
      document.removeEventListener('keydown', handleTab)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleOverlayClick = () => {
    if (closeOnOverlay) {
      onClose()
    }
  }

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal" onClick={handleModalClick}>
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button
            className="modal__close"
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            ×
          </button>
        </div>
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>
  )
}
