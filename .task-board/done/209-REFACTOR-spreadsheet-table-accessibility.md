# REFACTOR: SpreadsheetTable Accessibility Enhancement

**Status**: Complete
**Created**: 2025-12-07
**Priority**: Low
**Labels**: accessibility, components, a11y
**Estimated Effort**: Medium - 3-4 hours

## Context & Motivation

SpreadsheetTable lacks proper semantic HTML for screen readers. Missing: table caption, scope attributes on headers, and aria-live regions for edit mode. Screen reader users have reduced context about table structure.

Identified in due diligence audit as an accessibility gap.

## Current State

The SpreadsheetTable component:
- Uses proper `<table>`, `<thead>`, `<tbody>` elements
- Has `<th>` elements for headers
- Missing `<caption>` element
- Missing `scope="col"` on column headers
- No aria-live announcement for edit mode

## Desired Outcome

SpreadsheetTable is fully accessible to screen reader users with proper semantic structure and live announcements.

## Acceptance Criteria

- [x] Table has `<caption>` element with descriptive text (can be visually hidden)
- [x] Column headers have `scope="col"` attribute
- [x] Row headers (if any) have `scope="row"` attribute
- [x] Edit mode changes announced via `aria-live="polite"` region
- [x] Action column properly labeled for screen readers
- [x] Storybook accessibility addon passes

## Affected Components

### Components
- **File**: `components/src/data/SpreadsheetTable/SpreadsheetTable.tsx`
- **File**: `components/src/data/SpreadsheetTable/SpreadsheetTable.css`
- **Stories**: `components/src/data/SpreadsheetTable/SpreadsheetTable.stories.tsx`

## Technical Approach

### Implementation Steps

1. **Add caption element**
   ```tsx
   <table>
     <caption className="sr-only">
       {caption || 'Monthly portfolio snapshots'}
     </caption>
     ...
   </table>
   ```

2. **Add scope attributes to headers**
   ```tsx
   <th scope="col">{columnName}</th>
   ```

3. **Add aria-live region for edit mode**
   ```tsx
   <div aria-live="polite" className="sr-only">
     {editingCell ? `Editing ${editingCell.column}` : ''}
   </div>
   ```

4. **Add sr-only CSS class if not exists**
   ```css
   .sr-only {
     position: absolute;
     width: 1px;
     height: 1px;
     padding: 0;
     margin: -1px;
     overflow: hidden;
     clip: rect(0, 0, 0, 0);
     border: 0;
   }
   ```

### Props Changes
- Add optional `caption?: string` prop

### Dependencies
- None

### Risks & Considerations
- **Risk**: Caption may be visible and affect layout
- **Mitigation**: Use visually hidden class (sr-only)

## Related Plans
- 001-REFACTOR-button-focus-states.md
- 002-REFACTOR-form-select-focus-states.md

---
## Implementation Summary

**Completed**: 2025-12-07

### Changes Made

1. **Added `sr-only` CSS class** (`SpreadsheetTable.css`)
   - Standard screen reader only hiding technique
   - Positioned absolutely with 1px dimensions
   - Proper clip and overflow settings

2. **Updated SpreadsheetTable component** (`SpreadsheetTable.tsx`)
   - Added `caption?: string` prop to interface
   - Implemented `<caption>` element with visually hidden class
   - Added `<div aria-live="polite">` region for edit mode announcements
   - Added `editAnnouncement` state for screen reader announcements
   - Announcement triggered on cell edit start with column name and date
   - Announcement cleared on save/cancel

3. **Added scope attributes**
   - Date column header: `scope="col"`
   - Column group headers: `scope="colgroup"`
   - Individual column headers: `scope="col"`
   - Action column header: `scope="col"`

4. **Added Storybook story** (`SpreadsheetTable.stories.tsx`)
   - AccessibilityDemo story with caption prop
   - Demonstrates full accessibility features
   - Includes documentation

### Build & Lint Results
- Components lint: ✓ PASS
- Frontend build: ✓ PASS
- Frontend lint: ✓ PASS (6 pre-existing warnings unrelated to changes)

### Notes
- All changes are backward compatible
- Caption prop is optional with sensible default
- Accessibility improvements are transparent to visual users
- Tested with real portfolio table structure
