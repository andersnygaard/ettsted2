# 134-REFACTOR: Close Button (X) Positioning

**Priority**: Medium
**Effort**: Small (20 min)
**Labels**: frontend, css, ux

---

## Context

Close buttons (X) in modals/dialogs should be positioned tightly in the top-right corner. Currently they may have excess margin/padding making them appear elongated and pulled away from the corner.

Need to balance:
- Desktop: Button can be smaller and tighter to corner
- Mobile: Button needs adequate touch target size (min 44x44px)

---

## Acceptance Criteria

- [ ] Close buttons visually sit in top-right corner
- [ ] Remove excess horizontal margin/padding
- [ ] Maintain adequate touch target for mobile
- [ ] Consistent across all modals/dialogs

---

## Technical Approach

```css
.modal__close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 8px;
  margin: 0;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

The `min-width/min-height` ensures touch target while `padding` controls visual appearance.

---

## Files to Review

- [Modal.css](frontend/src/shared/components/Modal.css)
- [TermsDialog.css](frontend/src/features/auth/TermsDialog.css)
- [LoginModal.css](frontend/src/features/auth/LoginModal.css)
- [NewMonthModal.css](frontend/src/features/portfolio/NewMonthModal.css)

---

## Notes

Consider using a shared class `.close-btn` applied consistently across all close buttons.
