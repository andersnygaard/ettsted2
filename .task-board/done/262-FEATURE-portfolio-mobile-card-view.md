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
- [x] Mobile view (<768px) shows card layout instead of table
- [x] Each card represents one month of data
- [x] Cards are swipeable/scrollable horizontally
- [x] Card shows: Date, all account values, category totals
- [x] Inline editing works in card view (tap value to edit)
- [x] Delete button accessible in card view
- [x] Milestone highlights visible on cards (gold border/badge)
- [x] Column group toggles still work (hide/show categories)
- [x] Desktop view (>=768px) unchanged - shows table

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

## Resolution

Successfully implemented mobile card view for SpreadsheetTable component with horizontal scrolling, category toggles, and full editing functionality.

### Implementation Details

**Files Modified:**
- `components/src/data/SpreadsheetTable/SpreadsheetTable.tsx` - Added `renderCardView()` function with card-based rendering logic
- `components/src/data/SpreadsheetTable/SpreadsheetTable.css` - Added comprehensive mobile card view styles with horizontal scroll

**Key Features Implemented:**

1. **Horizontal Swipeable Cards** - Cards scroll horizontally using flexbox with `overflow-x: auto`, `scroll-snap-type: x mandatory` for smooth swiping on mobile devices

2. **Responsive Layout** - Mobile-first CSS approach with media query at 768px breakpoint:
   - Mobile (<768px): Shows horizontal scrolling cards
   - Desktop (>=768px): Shows traditional table view

3. **Category Group Toggles** - Category headers in card view are fully interactive:
   - Tap to expand/collapse account groups
   - Visual toggle indicator (▼ arrow rotates)
   - Color-coded by category (sparing, gjeld, pensjon)
   - 44px minimum touch target size

4. **Inline Editing** - Full editing functionality preserved in card view:
   - Tap any account value to edit
   - Same number input as table view
   - Blur to save, Enter to confirm, Escape to cancel
   - Visual feedback with background color change

5. **Milestone Highlights** - Gold styling for milestone values:
   - Gold star (★) prefix on milestone values
   - Gold border on cards containing milestones
   - Uses shared `formatCell` function for consistency

6. **Delete Functionality** - Delete button accessible in card header with proper touch target size (44x44px)

7. **Accessibility** - Maintained ARIA labels, roles, and keyboard navigation support

### CSS Architecture

Mobile card styles use CSS custom properties from the Nordic Minimal design system:
- Spacing: `--space-*` tokens
- Colors: Category-specific colors (`--category-sparing`, etc.)
- Typography: `--font-body`, `--font-mono`
- Touch targets: `--touch-target-min` (44px)

### Build Verification

Frontend build completed successfully with no TypeScript or compilation errors. All components compile cleanly and bundle sizes are reasonable.
