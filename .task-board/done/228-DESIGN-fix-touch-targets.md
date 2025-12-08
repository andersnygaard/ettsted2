# Task 228: Fix Small Touch Targets

**Priority**: Low
**Category**: Design/A11Y
**Effort**: Low (20 min)
**Impact**: Design +1 point (UX)

## Problem

Touch targets below 44px:
- Avatar small (28px)
- Checkbox (16px)
- Delete icons (18px)

## Files

- `components/src/ui/Avatar/Avatar.css`
- `frontend/src/styles/global.css`
- Account list delete buttons

## Implementation

Increase padding/size to meet 44px minimum:
```css
.avatar--small {
  min-width: 44px;
  min-height: 44px;
}
```

## Acceptance Criteria

- [x] All interactive elements >= 44px touch target
- [x] Visual appearance maintained
- [x] Mobile usability improved
