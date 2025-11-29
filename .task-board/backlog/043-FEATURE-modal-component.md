# FEATURE: Modal Component

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: High
**Labels**: component, ui, forms
**Estimated Effort**: Simple - 1 hour

## Context & Motivation

Modals are needed for forms (new month, edit account) and confirmations. A reusable modal component with Nordic Minimal styling.

## Reference

General modal pattern following Nordic Minimal design system.

## Desired Outcome

Reusable modal component with header, body, and footer sections.

## Acceptance Criteria

- [ ] Create `/frontend/src/shared/components/Modal.tsx`
- [ ] Props: `isOpen`, `onClose`, `title`, `children`, `footer`
- [ ] Overlay with backdrop blur
- [ ] Centered modal with max-width
- [ ] Close button in header
- [ ] Escape key closes modal
- [ ] Click outside closes modal (optional)
- [ ] Fade-in animation
- [ ] Focus trap for accessibility

## Technical Approach

```tsx
// Modal.tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnOverlay?: boolean;
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
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={closeOnOverlay ? onClose : undefined}
    >
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button className="modal__close" onClick={onClose}>×</button>
        </div>
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>
  );
}
```

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(44, 44, 44, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal {
  background: var(--warm-white);
  border-radius: 2px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  animation: fadeUp 0.3s ease;
}

.modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid var(--border);
}

.modal__title {
  font-family: var(--font-heading);
  font-size: 24px;
  font-weight: 400;
}

.modal__body { padding: 24px; }
.modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--border);
}
```

## Dependencies

- `021-FEATURE-design-tokens.md`
- `024-FEATURE-animation-utilities.md`

---

**Next Steps**: Core UI component, implement early
