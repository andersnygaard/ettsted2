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
- [x] Action buttons full-width on mobile (<768px)
- [x] Buttons stack vertically with proper spacing
- [x] Touch targets minimum 44px height
- [x] Button order preserved (Export, Import, New Month)
- [x] Desktop layout unchanged (horizontal row)
- [x] Focus indicators visible on all breakpoints

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

## Resolution

**Completed**: December 9, 2025

**Implementation**:
- Updated `.portfolio-page__actions` base styles to use flexbox column layout with full-width buttons
- Added `.portfolio-page__actions button` with `width: 100%` and `min-height: 44px` for accessibility
- Added desktop media query `@media (min-width: 768px)` to restore horizontal row layout on 768px+
- Followed mobile-first CSS pattern per CLAUDE.md (using `min-width` instead of `max-width`)

**Changes Made**:
1. **Base styles** (mobile): Buttons stack vertically with full width and proper 44px touch targets
2. **Desktop styles** (768px+): Buttons layout horizontally with `flex-direction: row` and right-aligned positioning
3. Removed outdated `flex-wrap` and `flex: 1 1 auto` rules that conflicted with new approach

**Build Result**: ✓ Successful (no errors, pre-existing circular dependency warnings unrelated to this change)
