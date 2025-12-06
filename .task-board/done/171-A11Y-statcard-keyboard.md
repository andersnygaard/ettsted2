# 171 - A11Y: Add Keyboard Handler to StatCard Clickable

**Type**: Accessibility
**Priority**: MEDIUM
**Effort**: Simple

---

## Problem

StatCard with onClick has role="button" and tabIndex but no keyboard handler.

```tsx
// components/src/data/StatCard/StatCard.tsx:21-24
<div
  className={`stat-card ${onClick ? 'stat-card--clickable' : ''}`}
  onClick={onClick}
  role={onClick ? 'button' : undefined}
  tabIndex={onClick ? 0 : undefined}
>
```

Keyboard users can focus the card but cannot activate it with Enter or Space.

---

## Solution

Add onKeyDown handler for Enter and Space keys.

---

## Tasks

- [x] Add keyboard handler to StatCard.tsx:
  ```typescript
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };
  ```
- [x] Add onKeyDown to div:
  ```tsx
  <div
    className={...}
    onClick={onClick}
    onKeyDown={handleKeyDown}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
  >
  ```
- [x] Build components: `pnpm --filter @finans/components build` (actually built frontend which includes components)
- [x] Test keyboard activation in browser

---

## Acceptance Criteria

- [x] Enter key activates clickable StatCard
- [x] Space key activates clickable StatCard
- [x] Non-clickable StatCards unaffected
- [x] No duplicate clicks when using keyboard

**Status**: COMPLETED

---

## References

- Due Diligence Report: .docs/DUE-DILIGENCE-REPORT.md (Accessibility Issues)
- WCAG 2.1.1: Keyboard Accessible
