# Design: Mobile-First Category Pages (Sparing, Gjeld, Pensjon)

**Status**: Backlog
**Created**: 2025-12-08
**Priority**: Medium
**Labels**: frontend, design, mobile, sparing, gjeld, pensjon
**Estimated Effort**: Medium - 3-4 hours

## Context & Motivation

Category pages (Sparing, Gjeld, Pensjon) share similar layouts: stats row, main section, historical chart. Each needs mobile optimization for their unique components while maintaining design consistency.

## Current State

### SparingPage
- Stats row: 3-column grid, collapses to 1 on mobile (good)
- FireSection: 4-column stats grid doesn't work well on small screens
- Padding values use desktop spacing

### GjeldPage
- Dekning section: Horizontal flex with large circle - problematic on mobile
- Loans list: Works reasonably but could be tighter
- Uses `max-width` queries

### PensjonPage
- Breakdown section: 2-column grid
- OTP section: Header flex layout
- Needs mobile-first refactor

## Desired Outcome

- All pages use mobile-first CSS pattern
- Consistent mobile experience across category pages
- FireSection: 2→4 column progression
- Dekning: Stacks vertically on mobile
- All touch targets 44px minimum

## Acceptance Criteria

- [ ] Refactor SparingPage.css to mobile-first
- [ ] Refactor GjeldPage.css to mobile-first
- [ ] Refactor PensjonPage.css to mobile-first
- [ ] FireSection stats: 1→2→4 column progression
- [ ] Dekning section stacks vertically on mobile
- [ ] Breakdown section stacks on mobile
- [ ] Works on 320px width screens

## Affected Components

### Frontend
- **Files**:
  - `frontend/src/features/sparing/SparingPage.css`
  - `frontend/src/features/sparing/FireSection.css`
  - `frontend/src/features/gjeld/GjeldPage.css`
  - `frontend/src/features/pensjon/PensjonPage.css`

### Components
- `components/src/data/StatsRow/StatsRow.css`

## Technical Approach

### Implementation Steps

1. **SparingPage - FireSection mobile-first**:
   ```css
   /* BASE: Mobile */
   .fire-section {
     padding: var(--space-lg);
   }

   .fire-stats {
     grid-template-columns: 1fr;
     gap: var(--space-md);
   }

   .fire-stat__value {
     font-size: 20px;
   }

   /* TABLET */
   @media (min-width: 768px) {
     .fire-section {
       padding: var(--space-xl);
     }
     .fire-stats {
       grid-template-columns: repeat(2, 1fr);
     }
     .fire-stat__value {
       font-size: 24px;
     }
   }

   /* DESKTOP */
   @media (min-width: 1024px) {
     .fire-section {
       padding: 40px;
     }
     .fire-stats {
       grid-template-columns: repeat(4, 1fr);
     }
     .fire-stat__value {
       font-size: 28px;
     }
   }
   ```

2. **GjeldPage - Dekning section mobile-first**:
   ```css
   /* BASE: Mobile - Stack vertically */
   .dekning-section {
     flex-direction: column;
     text-align: center;
     padding: var(--space-lg);
     gap: var(--space-lg);
   }

   .dekning-circle {
     width: 140px;
     height: 140px;
   }

   /* TABLET+ */
   @media (min-width: 768px) {
     .dekning-section {
       flex-direction: row;
       text-align: left;
       padding: var(--space-xl);
       gap: var(--space-xl);
     }
     .dekning-circle {
       width: 180px;
       height: 180px;
     }
   }
   ```

3. **PensjonPage - Breakdown section mobile-first**:
   ```css
   /* BASE: Mobile */
   .breakdown-section {
     grid-template-columns: 1fr;
   }

   /* TABLET+ */
   @media (min-width: 768px) {
     .breakdown-section {
       grid-template-columns: 1fr 1fr;
     }
   }
   ```

### Dependencies

- 238-DESIGN-mobile-first-refactor-foundation

### Risks & Considerations

- **Risk**: Dekning circle might be too small on mobile
- **Mitigation**: Test 140px, adjust if value text doesn't fit

## Code References

### Current Patterns
```css
/* FireSection.css:69-82 - Already has breakpoint but desktop-first */
@media (max-width: var(--bp-md)) {
  .fire-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* GjeldPage.css:26-31 - Desktop-first */
@media (max-width: var(--bp-sm)) {
  .dekning-section {
    flex-direction: column;
  }
}
```

---

**Next Steps**: Ready for implementation after 238 foundation task.
