# FEATURE: Card Component

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: High
**Labels**: component, ui
**Estimated Effort**: Simple - 1 hour

## Context & Motivation

Cards are the primary container for content throughout the app. They have warm-white background with subtle styling.

## Reference

Design file: `.docs/design-drafts/draft-1-nordic-minimal.html` (lines 153-166)

## Desired Outcome

Flexible card component for content containers.

## Acceptance Criteria

- [ ] Create `/frontend/src/shared/components/Card.tsx`
- [ ] Props: `children`, `className`, `hoverable`, `onClick`
- [ ] Warm-white background (`--warm-white`)
- [ ] Border-radius 2px
- [ ] Optional hover effect (lift + shadow)
- [ ] Can be clickable (link-like)

## Technical Approach

```tsx
// Card.tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hoverable, onClick }: CardProps) {
  return (
    <div
      className={`card ${hoverable ? 'card--hoverable' : ''} ${className || ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      {children}
    </div>
  );
}
```

```css
.card {
  background: var(--warm-white);
  border-radius: 2px;
  padding: 28px;
}

.card--hoverable {
  cursor: pointer;
  transition: transform var(--transition-medium), box-shadow var(--transition-medium);
}

.card--hoverable:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(0,0,0,0.06);
}
```

## Dependencies

- `021-FEATURE-design-tokens.md`

---

**Next Steps**: Core UI component, implement early
