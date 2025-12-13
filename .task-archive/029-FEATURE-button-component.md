# FEATURE: Button Component

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: High
**Labels**: component, ui, forms
**Estimated Effort**: Simple - 1 hour

## Context & Motivation

Buttons are used throughout the app for actions. The design has two variants: primary (dark) and secondary (outlined).

## Reference

Design file: `.docs/design-drafts/draft-1-portfolio.html` (lines 137-167)

## Desired Outcome

Styled button component matching Nordic Minimal design.

## Acceptance Criteria

- [ ] Create `/frontend/src/shared/components/Button.tsx`
- [ ] Variants: `primary` (dark bg), `secondary` (outlined)
- [ ] Props: `children`, `variant`, `onClick`, `disabled`, `icon`
- [ ] Uppercase text, 11px, letter-spacing 0.08em
- [ ] Border-radius 2px (minimal)
- [ ] Hover states (lift, color change)
- [ ] Optional icon before text

## Technical Approach

```tsx
// Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function Button({ children, variant = 'primary', onClick, disabled, icon }: ButtonProps) {
  return (
    <button
      className={`btn btn--${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="btn__icon">{icon}</span>}
      {children}
    </button>
  );
}
```

```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  font-size: 11px;
  font-family: var(--font-body);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  border-radius: 2px;
  transition: all var(--transition-fast);
}

.btn--primary {
  background: var(--charcoal);
  color: var(--warm-white);
  border: 1px solid var(--charcoal);
}

.btn--primary:hover { background: #1a1a1a; }

.btn--secondary {
  background: transparent;
  border: 1px solid var(--border-strong);
  color: var(--charcoal);
}

.btn--secondary:hover { background: var(--warm-white); }
```

## Dependencies

- `021-FEATURE-design-tokens.md`

---

**Next Steps**: Core UI component, implement early
