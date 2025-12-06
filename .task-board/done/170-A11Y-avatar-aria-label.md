# 170 - A11Y: Add aria-label to Avatar Component

**Type**: Accessibility
**Priority**: MEDIUM
**Effort**: Simple

---

## Problem

Avatar component displays user initials but provides no accessible text for screen readers.

```tsx
// components/src/ui/Avatar/Avatar.tsx
<div className={`avatar avatar--${size}`}>
  {displayInitials}
</div>
```

Screen reader users cannot identify whose avatar is displayed.

---

## Solution

Add aria-label and role="img" to Avatar.

---

## Tasks

- [x] Update Avatar.tsx props interface:
  ```typescript
  interface AvatarProps {
    name: string;
    size?: 'small' | 'medium' | 'large';
  }
  ```
- [x] Add ARIA attributes:
  ```tsx
  <div
    className={`avatar avatar--${size}`}
    role="img"
    aria-label={`${name} avatar`}
  >
    {displayInitials}
  </div>
  ```
- [x] Update Storybook story with new prop
- [x] Build frontend: `pnpm --filter frontend build`
- [x] Updated all usages in AppHeader and AvatarMenu

---

## Acceptance Criteria

- [x] Avatar has role="img"
- [x] Avatar has aria-label with user name
- [x] Screen readers announce avatar properly
- [x] Storybook updated
- [x] Frontend builds successfully with no TypeScript errors

---

## References

- Due Diligence Report: .docs/DUE-DILIGENCE-REPORT.md (Accessibility Issues)
- WCAG 1.1.1: Non-text Content
