# 154-FEATURE: Modal Transition Improvements

## Summary
Enhance modal open/close animations with smoother transitions. Current modals appear/disappear abruptly.

## Context
The Modal component and LoginModal need polished entrance/exit animations:
- Backdrop fade in/out
- Modal scale + fade entrance
- Smooth exit animation (not just instant removal)

## Acceptance Criteria
- [x] Backdrop fades in over 200ms
- [x] Modal scales from 95% to 100% while fading in
- [x] Exit animation plays before DOM removal
- [x] Animation duration: 200-300ms
- [x] Keyboard close (Escape) triggers exit animation
- [x] Click outside triggers exit animation

## Status
COMPLETED

## Technical Approach
1. Add CSS transitions to Modal component
2. Use `useState` for exit animation timing
3. Delay `onClose` callback until animation completes

### CSS
```css
.modal-backdrop {
  opacity: 0;
  transition: opacity 0.2s ease;
}
.modal-backdrop.open { opacity: 1; }

.modal-content {
  transform: scale(0.95);
  opacity: 0;
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-content.open {
  transform: scale(1);
  opacity: 1;
}
```

## Files to Modify
- [Modal.tsx](components/src/ui/Modal/Modal.tsx)
- [Modal.css](components/src/ui/Modal/Modal.css)
- [LoginModal.tsx](frontend/src/features/auth/LoginModal.tsx)
- [LoginModal.css](frontend/src/features/auth/LoginModal.css)

## Priority
Medium

## Effort
Medium (3-4 hours)

## Labels
design, animation, component, ux
