# 127-FEATURE: Input Focus Animations

## Summary
Add smooth focus ring animations to form inputs (NumberInput, DateInput, text inputs). Focus should feel responsive with animated border/ring.

## Context
Form inputs need clear focus states for accessibility and polish. Currently focus styles may be abrupt. Smooth transitions improve the feel of form interactions.

## Acceptance Criteria
- [ ] Focus ring animates in over 150ms
- [ ] Border color transition on focus
- [ ] Subtle scale or shadow enhancement on focus
- [ ] Consistent across NumberInput, DateInput, and any text inputs
- [ ] High contrast focus ring for accessibility
- [ ] Works with keyboard and mouse focus

## Technical Approach
1. Add `transition` to border/box-shadow properties
2. Use `focus-visible` for keyboard-only focus styles
3. Consider subtle scale (`1.01`) on focus

### CSS Pattern
```css
.input {
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.input:focus-visible {
  border-color: var(--charcoal);
  box-shadow: 0 0 0 2px rgba(44, 44, 44, 0.1);
}
```

## Files to Modify
- [NumberInput.css](components/src/forms/NumberInput/NumberInput.css)
- [DateInput.css](components/src/forms/DateInput/DateInput.css)
- [global.css](frontend/src/styles/global.css) - base input styles

## Priority
Low

## Effort
Simple (1-2 hours)

## Labels
design, animation, forms, accessibility
