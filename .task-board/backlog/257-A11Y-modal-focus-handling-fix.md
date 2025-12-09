# 257 - Fix Modal Close Button Focus Handling

## Type
Accessibility

## Priority
Low

## Description
Modal close button has a CSS issue where `:focus` removes outline before `:focus-visible` adds it. This can cause focus loss on some browsers.

## Source
Due Diligence Report - Design Issue #5

## Implementation

### File: `components/src/components/Modal/Modal.css`

Current problematic code:
```css
.modal__close:focus {
  outline: none; /* This clears focus before focus-visible runs */
}

.modal__close:focus-visible {
  outline: 2px solid var(--charcoal);
}
```

Fix:
```css
/* Remove the :focus rule entirely, use only focus-visible */
.modal__close:focus-visible {
  outline: 2px solid var(--charcoal);
  outline-offset: 2px;
}
```

## Acceptance Criteria
- [ ] Close button shows focus ring on keyboard navigation
- [ ] No outline flash/clear on focus
- [ ] Works in Chrome, Firefox, Safari
- [ ] Storybook stories verify behavior

## Effort
Low (15 min)
