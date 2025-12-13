# FEATURE: Avatar Component

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: Medium
**Labels**: component, ui
**Estimated Effort**: Simple - 30 minutes

## Context & Motivation

User avatar showing initials in a circular badge. Used in header and potentially elsewhere.

## Reference

Design file: `.docs/design-drafts/draft-1-nordic-minimal.html` (lines 79-90, 307)

## Desired Outcome

Simple avatar component displaying user initials.

## Acceptance Criteria

- [ ] Create `/frontend/src/shared/components/Avatar.tsx`
- [ ] Props: `initials`, `size` (small/medium/large)
- [ ] Circular shape with `--pale-blue` background
- [ ] Initials centered, 14px font size (medium)
- [ ] Sizes: 28px (small), 36px (medium), 48px (large)

## Technical Approach

```tsx
// Avatar.tsx
interface AvatarProps {
  initials: string;
  size?: 'small' | 'medium' | 'large';
}

export function Avatar({ initials, size = 'medium' }: AvatarProps) {
  const sizeClass = `avatar--${size}`;
  return (
    <div className={`avatar ${sizeClass}`}>
      {initials.slice(0, 2).toUpperCase()}
    </div>
  );
}
```

```css
.avatar {
  border-radius: 50%;
  background: var(--pale-blue);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

.avatar--small { width: 28px; height: 28px; font-size: 11px; }
.avatar--medium { width: 36px; height: 36px; font-size: 14px; }
.avatar--large { width: 48px; height: 48px; font-size: 18px; }
```

## Dependencies

- `021-FEATURE-design-tokens.md`

---

**Next Steps**: Implement with header component
