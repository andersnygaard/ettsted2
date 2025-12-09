# 267 - FEATURE: Portfolio export button mobile-friendly positioning

## Priority
Low

## Type
Feature

## Description
Portfolio page action buttons (Eksporter, Importer data, + Ny måned) stack vertically on mobile but could use better spacing and full-width touch targets.

## User Story
As a mobile user, I want to easily tap action buttons on the portfolio page so that I can export data or add new months without mis-taps.

## Acceptance Criteria
- [ ] Action buttons full-width on mobile (<768px)
- [ ] Buttons stack vertically with proper spacing
- [ ] Touch targets minimum 44px height
- [ ] Button order preserved (Export, Import, New Month)
- [ ] Desktop layout unchanged (horizontal row)
- [ ] Focus indicators visible on all breakpoints

## Files to Change
- `frontend/src/features/portfolio/PortfolioPage.css`

## Technical Notes
Current CSS for `.portfolio-page__actions` needs mobile responsive rules.

Add:
```css
@media (max-width: 768px) {
  .portfolio-page__actions {
    flex-direction: column;
    gap: var(--space-sm);
  }

  .portfolio-page__actions button {
    width: 100%;
    min-height: 44px;
  }
}
```

## Testing
- Test on mobile viewport (360px, 640px)
- Verify buttons are easy to tap
- Verify no horizontal scroll
- Test focus indicators with keyboard
