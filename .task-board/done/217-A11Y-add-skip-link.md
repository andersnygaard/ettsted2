# Task 217: Add Skip-to-Content Link

**Priority**: High
**Category**: Accessibility
**Effort**: Low (20 min)
**Impact**: Design +2 points (Accessibility)

## Problem

No skip link for keyboard users to bypass navigation.

## Files

- `components/src/layout/PageSkeleton/PageSkeleton.tsx`
- `components/src/layout/PageSkeleton/PageSkeleton.css`

## Implementation

Add at top of PageSkeleton:
```tsx
<a href="#main-content" className="skip-link">
  Hopp til hovedinnhold
</a>
<main id="main-content">
```

CSS:
```css
.skip-link {
  position: absolute;
  left: -9999px;
}
.skip-link:focus {
  left: 16px;
  top: 16px;
  z-index: 9999;
}
```

## Acceptance Criteria

- [x] Skip link appears on Tab key
- [x] Clicking skips to main content
- [x] Works on all pages
