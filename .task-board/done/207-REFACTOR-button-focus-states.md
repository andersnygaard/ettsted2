# REFACTOR: Button Focus States for Accessibility

**Status**: Completed
**Created**: 2025-12-07
**Priority**: Low
**Labels**: accessibility, components, a11y
**Estimated Effort**: Simple - 1 hour

## Context & Motivation

The Button component lacks `focus-visible` styling, violating WCAG 2.4.7 (Focus Visible). Keyboard users cannot see which button has focus, making the application inaccessible to keyboard-only users.

This was identified in the due diligence audit as a high-priority accessibility issue.

## Current State

The Button component in `components/src/ui/Button/Button.css` has hover states but no focus-visible styles. When users tab through the interface, there's no visual indication of which button is focused.

## Desired Outcome

All buttons show a clear, visible focus indicator when focused via keyboard navigation, compliant with WCAG 2.4.7.

## Acceptance Criteria

- [x] Button component has `:focus-visible` styles
- [x] Focus indicator uses design system colors (--charcoal)
- [x] Focus indicator is visible on all button variants (primary, secondary, text)
- [x] Focus indicator doesn't interfere with button's visual design
- [x] Storybook stories updated to show focus states

## Affected Components

### Components
- **File**: `components/src/ui/Button/Button.css`
- **Stories**: `components/src/ui/Button/Button.stories.tsx`

## Technical Approach

### Implementation Steps

1. **Add focus-visible styles to Button.css**
   ```css
   .btn:focus-visible {
     outline: 2px solid var(--charcoal);
     outline-offset: 2px;
   }
   ```

2. **Test all button variants**
   - Primary button
   - Secondary button
   - Text button
   - Disabled button (should NOT show focus)

3. **Update Storybook**
   - Add focus state demonstration
   - Document keyboard navigation

### Dependencies
- None

### Risks & Considerations
- **Risk**: Outline may clash with some backgrounds
- **Mitigation**: Use `outline-offset` to provide spacing

## Code References

### Current Button CSS
```css
/* components/src/ui/Button/Button.css */
.btn {
  /* existing styles */
}

.btn:hover {
  /* hover styles exist */
}

/* Missing: .btn:focus-visible */
```

## Related Plans
- 002-REFACTOR-form-select-focus-states.md

---
**Next Steps**: Ready for implementation. Move to in-progress/ when starting.
