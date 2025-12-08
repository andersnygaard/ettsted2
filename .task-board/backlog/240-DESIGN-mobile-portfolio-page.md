# Design: Mobile-First Portfolio Page & SpreadsheetTable

**Status**: Backlog
**Created**: 2025-12-08
**Priority**: High
**Labels**: frontend, design, mobile, portfolio, table
**Estimated Effort**: Complex - 4-6 hours

## Context & Motivation

Portfolio page contains the SpreadsheetTable - the most complex component for mobile. Tables with many columns are inherently challenging on small screens. Need a clear mobile strategy: horizontal scroll with visual affordances, or a card-based alternate view.

## Current State

- SpreadsheetTable has horizontal scroll but no visual indicator that more content exists
- Action buttons don't stretch full width on mobile
- Sticky first column works but takes significant screen width
- Font sizes already reduce on mobile but may still be cramped
- Delete buttons hidden until hover (no hover on touch devices)

## Desired Outcome

- Clear horizontal scroll affordance (shadow/gradient fade on edges)
- Action buttons stack or stretch full-width on mobile
- Touch-friendly delete buttons (visible, not hover-dependent)
- Consider swipe-to-delete gesture for rows
- Optimized cell padding and font sizes

## Acceptance Criteria

- [ ] Refactor to mobile-first CSS pattern
- [ ] Add horizontal scroll shadow/gradient indicators
- [ ] Action buttons full-width on mobile
- [ ] Delete buttons visible on mobile (not hover-only)
- [ ] Touch targets 44px minimum on interactive elements
- [ ] Works on 320px width without breaking
- [ ] Sticky column doesn't consume >30% of mobile screen

## Affected Components

### Frontend
- **Files**:
  - `frontend/src/features/portfolio/PortfolioPage.css`

### Components
- **Files**:
  - `components/src/data/SpreadsheetTable/SpreadsheetTable.css`
  - `components/src/data/SpreadsheetTable/SpreadsheetTable.tsx`
  - `components/src/data/TableHeader/TableHeader.css`
  - `components/src/data/TableFooter/TableFooter.css`

## Technical Approach

### Implementation Steps

1. **Add scroll shadows to SpreadsheetTable**:
   ```css
   .spreadsheet-wrapper {
     position: relative;
   }

   .spreadsheet-wrapper::after {
     content: '';
     position: absolute;
     top: 0;
     right: 0;
     bottom: 0;
     width: 24px;
     background: linear-gradient(to left, var(--bone), transparent);
     pointer-events: none;
     opacity: 1;
     transition: opacity 0.2s;
   }

   .spreadsheet-wrapper.scrolled-right::after {
     opacity: 0;
   }
   ```

2. **Make delete buttons always visible on touch devices**:
   ```css
   @media (hover: none) {
     .delete-button {
       visibility: visible;
       opacity: 0.5;
     }
   }
   ```

3. **Stack action buttons on mobile**:
   ```css
   .portfolio-page__actions {
     flex-direction: column;
     gap: var(--space-sm);
   }

   .portfolio-page__actions .btn {
     width: 100%;
   }

   @media (min-width: 768px) {
     .portfolio-page__actions {
       flex-direction: row;
       justify-content: flex-end;
     }
     .portfolio-page__actions .btn {
       width: auto;
     }
   }
   ```

4. **Optimize sticky column width**:
   ```css
   /* Mobile: narrower date column */
   .spreadsheet .group-header-row th.date-header {
     width: 80px;
   }

   @media (min-width: 768px) {
     .spreadsheet .group-header-row th.date-header {
       width: 100px;
     }
   }
   ```

5. **Add JS for scroll detection** (if needed for shadow toggle)

### Dependencies

- 238-DESIGN-mobile-first-refactor-foundation

### Risks & Considerations

- **Risk**: Scroll shadows might interfere with last column visibility
- **Mitigation**: Use pointer-events: none and test thoroughly
- **Risk**: Touch delete might cause accidental deletions
- **Mitigation**: Keep confirmation dialog

## Code References

### Current Pattern
```css
/* SpreadsheetTable.css:446-477 - Has some mobile styles */
@media (max-width: var(--bp-md)) {
  .spreadsheet {
    font-size: 11px;
  }
  /* ... */
}
```

---

**Next Steps**: Ready for implementation after 238 foundation task.
