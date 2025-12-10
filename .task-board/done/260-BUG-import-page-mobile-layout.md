# 260 - BUG: Import page mobile layout broken

## Priority
High

## Type
Bug

## Description
Import page chatbot layout breaks on mobile. The chatbot input has `min-height:100px` (line 312 in ImportPage.css) which should be `min-height: 100px` (space missing).

## Root Cause
CSS syntax error - missing space between property value and unit in mobile media query.

## Acceptance Criteria
- [x] Fix CSS spacing in ImportPage.css line 312
- [x] Verify chatbot textarea displays correctly on mobile (320px-768px)
- [x] Test that textarea auto-resize still works
- [x] No horizontal scroll on mobile

## Files to Change
- `frontend/src/features/import/ImportPage.css`

## Technical Notes
Line 312 currently:
```css
min-height:100px;
```

Should be:
```css
min-height: 100px;
```

This is within the `@media (max-width: 640px)` block for `.chatbot__input`.

## Testing
- Test on mobile viewport (360px, 640px)
- Verify textarea expands when typing multiple lines
- Check send button alignment
