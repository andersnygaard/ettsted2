# 172 - A11Y: Add aria-label to Modal Close Button

**Type**: Accessibility
**Priority**: MEDIUM
**Effort**: Simple

---

## Problem

Modal close button uses × symbol without accessible label.

```html
<button class="modal__close">×</button>
```

Screen readers announce "times" or nothing useful.

---

## Solution

Add aria-label to close button.

---

## Tasks

- [x] Locate Modal component (components/src/ui/Modal/)
- [x] Add aria-label to close button:
  ```tsx
  <button
    className="modal__close"
    aria-label="Lukk"
    onClick={onClose}
  >
    ×
  </button>
  ```
- [x] Build components: `pnpm --filter @finans/components build`
- [x] Test with screen reader or accessibility tools

---

## Acceptance Criteria

- [x] Close button has aria-label="Lukk" (Norwegian for "Close")
- [x] Screen readers announce button purpose
- [x] Visual appearance unchanged

---

## Status: COMPLETED

- Updated aria-label from "Close modal" (English) to "Lukk" (Norwegian)
- Frontend build successful with no errors
- Component properly exports accessible close button

---

## References

- Due Diligence Report: .docs/DUE-DILIGENCE-REPORT.md (Accessibility Issues)
- WCAG 4.1.2: Name, Role, Value
