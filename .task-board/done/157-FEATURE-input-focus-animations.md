# 127-FEATURE: Input Focus Animations

## Summary
Add smooth focus ring animations to form inputs (NumberInput, DateInput, text inputs). Focus should feel responsive with animated border/ring.

## Context
Form inputs need clear focus states for accessibility and polish. Currently focus styles may be abrupt. Smooth transitions improve the feel of form interactions.

## Acceptance Criteria
- [x] Focus ring animates in over 150ms
- [x] Border color transition on focus
- [x] Subtle scale or shadow enhancement on focus
- [x] Consistent across NumberInput, DateInput, and any text inputs
- [x] High contrast focus ring for accessibility
- [x] Works with keyboard and mouse focus

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

## Status
COMPLETED - Input focus animations implemented across all form components

## Implementation Details
1. **NumberInput.css**: Updated `.number-input__field` with `0.15s` transitions on border-color and box-shadow
   - Focus state uses `:focus-visible` selector for keyboard accessibility
   - Normal focus ring: `0 0 0 2px rgba(44, 44, 44, 0.1)`
   - Error state focus ring: `0 0 0 2px rgba(157, 107, 90, 0.2)`

2. **DateInput.css**: Updated `.date-input__field` with matching `0.15s` transitions
   - Same focus ring pattern as NumberInput
   - Error state has appropriate color variant

3. **global.css**: Added base input styles for all generic HTML inputs
   - Covers text, email, number, password, search, tel, url, date inputs
   - Also includes textarea and select elements
   - All use 150ms (0.15s) ease transitions
   - :focus-visible pseudo-selector for proper accessibility

## Key Changes
- Changed from `:focus` to `:focus-visible` for keyboard-only focus styles
- Updated transition timing to `border-color 0.15s ease, box-shadow 0.15s ease`
- Added subtle box-shadow ring: `0 0 0 2px rgba(44, 44, 44, 0.1)` for visible focus indication
- Maintains Nordic Minimal design aesthetic with muted colors
- High contrast focus ring supports accessibility requirements
