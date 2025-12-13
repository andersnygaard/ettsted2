# A11Y: Modal ARIA Attributes

**Status**: Backlog
**Created**: 2025-12-10
**Priority**: High
**Labels**: accessibility, components
**Estimated Effort**: Simple - 1 hour

## Context & Motivation

Due diligence audit identified that the Modal component is missing critical ARIA attributes for screen reader users. This is a WCAG 2.1 Level A violation.

## Current State

Modal component in `components/src/ui/Modal/Modal.tsx` lacks:
- `role="dialog"` attribute
- `aria-modal="true"` attribute
- `aria-labelledby` linking modal title to modal element

The modal has good focus trap implementation but screen readers cannot properly announce it as a dialog.

## Desired Outcome

Modal component properly announces as a dialog to screen readers with linked title.

## Acceptance Criteria

- [x] Modal element has `role="dialog"`
- [x] Modal element has `aria-modal="true"`
- [x] Modal element has `aria-labelledby` pointing to title element
- [x] Title element has matching `id` attribute
- [x] Screen reader testing confirms proper announcement

## Affected Components

### Components
- `components/src/ui/Modal/Modal.tsx` - Add ARIA attributes
- `components/src/ui/Modal/Modal.css` - No changes needed

## Technical Approach

### Implementation Steps

1. Add `id` prop or generate unique ID for modal title
2. Add `role="dialog"` to modal container
3. Add `aria-modal="true"` to modal container
4. Add `aria-labelledby={titleId}` to modal container
5. Add `id={titleId}` to title element

### Code Pattern

```tsx
// Modal.tsx
const titleId = `modal-title-${useId()}`;

return (
  <div
    className="modal"
    role="dialog"
    aria-modal="true"
    aria-labelledby={titleId}
  >
    <h2 id={titleId} className="modal-title">{title}</h2>
    {/* ... */}
  </div>
);
```

## Code References

- File: `components/src/ui/Modal/Modal.tsx`
- WCAG: 4.1.2 Name, Role, Value (Level A)

---

**Next Steps**: Ready for implementation. Move to `.task-board/in-progress/` when starting work.
