# 262 - FEATURE: Portfolio table mobile card view

## Priority
High

## Type
Feature

## Description
SpreadsheetTable is not mobile-friendly. On small screens (< 768px), the table should transform into a card-based layout with swipeable months.

## User Story
As a mobile user, I want to view and edit my portfolio data in a card format so that I don't have to scroll horizontally through a wide table.

## Acceptance Criteria
- [ ] Mobile view (<768px) shows card layout instead of table
- [ ] Each card represents one month of data
- [ ] Cards are swipeable/scrollable horizontally
- [ ] Card shows: Date, all account values, category totals
- [ ] Inline editing works in card view (tap value to edit)
- [ ] Delete button accessible in card view
- [ ] Milestone highlights visible on cards (gold border/badge)
- [ ] Column group toggles still work (hide/show categories)
- [ ] Desktop view (>=768px) unchanged - shows table

## Design Requirements
Card layout:
- Stack vertically with horizontal scroll container
- Card header: Month/Year + Delete button
- Card body: Account values grouped by category
- Category totals prominent
- Touch targets minimum 44x44px

## Files to Change
- `components/src/data/SpreadsheetTable/SpreadsheetTable.tsx`
- `components/src/data/SpreadsheetTable/SpreadsheetTable.css`
- `frontend/src/features/portfolio/PortfolioPage.css` (responsive adjustments)

## Technical Notes
Implementation approach:
1. Add responsive layout CSS with mobile-first approach
2. Use flexbox for card layout
3. Transform table data into card format in component
4. Maintain same editing interface (NumberInput on tap)
5. Use CSS media queries at 768px breakpoint

Consider creating separate components:
- `SpreadsheetTable` (desktop)
- `PortfolioCardView` (mobile)

And conditionally render based on viewport.

## Testing
- Test card view on mobile (360px, 640px)
- Test editing values in card view
- Test delete in card view
- Test category toggles
- Test milestone highlights on cards
- Verify smooth transition at 768px breakpoint
