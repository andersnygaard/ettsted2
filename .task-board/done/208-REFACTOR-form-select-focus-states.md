# REFACTOR: Form Select Focus States

**Status**: Completed
**Created**: 2025-12-07
**Priority**: Low
**Labels**: accessibility, components, a11y
**Estimated Effort**: Simple - 1 hour

## Context & Motivation

The TableHeader dropdown (year selector) lacks focus-visible styling. This is part of the broader accessibility improvements needed for WCAG compliance.

## Current State

The select element in TableHeader uses browser default focus styles, which may not meet design standards or be visible enough.

## Desired Outcome

All form select elements have consistent, visible focus indicators that match the design system.

## Acceptance Criteria

- [x] TableHeader select has `:focus-visible` styles
- [x] Focus indicator matches Button focus style for consistency
- [x] Focus indicator uses design system colors
- [x] Works on all browsers (Chrome, Firefox, Safari, Edge)

## Affected Components

### Components
- **File**: `components/src/data/TableHeader/TableHeader.css`

## Technical Approach

### Implementation Steps

1. **Add focus-visible styles to TableHeader.css**
   ```css
   .table-header__select:focus-visible {
     outline: 2px solid var(--charcoal);
     outline-offset: 2px;
   }
   ```

2. **Test in Storybook**
   - Verify focus is visible
   - Check keyboard navigation works

### Dependencies
- Should follow same pattern as 001-REFACTOR-button-focus-states.md

### Risks & Considerations
- **Risk**: Select styling varies by browser
- **Mitigation**: Test across browsers, use outline (most consistent)

## Related Plans
- 001-REFACTOR-button-focus-states.md

---
**Next Steps**: Ready for implementation. Move to in-progress/ when starting.
