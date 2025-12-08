# Design: Mobile-First Dashboard Page

**Status**: Backlog
**Created**: 2025-12-08
**Priority**: High
**Labels**: frontend, design, mobile, dashboard
**Estimated Effort**: Medium - 3-4 hours

## Context & Motivation

Dashboard is the primary page users see after login. Current mobile experience has oversized hero text, cramped milestone section, and stats grid that doesn't stack properly. Critical for first impressions.

## Current State

- Hero value: 84px font doesn't scale well on 320px screens
- Stats grid: 2-column on desktop, single column breakpoint too late
- Milestone section: Padding too large on mobile, value text overflows
- Links grid: 3-column doesn't collapse gracefully
- Uses `max-width` media queries (desktop-first)

## Desired Outcome

- Hero text scales smoothly with `clamp()` or proper breakpoints
- Stats grid: 1 column on mobile, 2 on tablet, 4 on desktop
- Milestone section: Compact mobile layout with proper padding
- Links: Stack vertically on mobile
- All touch targets 44px minimum

## Acceptance Criteria

- [ ] Refactor to mobile-first CSS pattern
- [ ] Hero value uses responsive font sizing (clamp or breakpoints)
- [ ] Stats grid responsive: 1→2→4 columns
- [ ] Milestone section padding scales properly
- [ ] Section links stack on mobile
- [ ] Works on 320px width screens
- [ ] Touch targets meet 44px minimum

## Affected Components

### Frontend
- **Files**:
  - `frontend/src/features/dashboard/DashboardPage.css`
  - `frontend/src/features/dashboard/QuickStatsGrid.css`

### Components
- `components/src/cards/StatCard/StatCard.css`
- `components/src/data/HeroNumber/HeroNumber.css`

## Technical Approach

### Implementation Steps

1. **Refactor DashboardPage.css to mobile-first**:
   ```css
   /* BASE: Mobile */
   .dashboard-hero__value {
     font-size: clamp(36px, 10vw, 84px);
   }

   .dashboard-stats {
     grid-template-columns: 1fr;
   }

   .dashboard-links {
     grid-template-columns: 1fr;
   }

   .dashboard-milestone {
     padding: var(--space-lg);
   }

   /* TABLET */
   @media (min-width: 768px) {
     .dashboard-stats {
       grid-template-columns: repeat(2, 1fr);
     }
   }

   /* DESKTOP */
   @media (min-width: 1024px) {
     .dashboard-stats {
       grid-template-columns: repeat(4, 1fr);
     }
     .dashboard-links {
       grid-template-columns: repeat(3, 1fr);
     }
     .dashboard-milestone {
       padding: var(--space-3xl);
     }
   }
   ```

2. **Update QuickStatsGrid.css** - Already has good breakpoints, verify mobile-first

3. **Test on mobile viewport**

### Dependencies

- 238-DESIGN-mobile-first-refactor-foundation (tokens)

### Risks & Considerations

- **Risk**: Hero number might wrap awkwardly with very large values
- **Mitigation**: Use `text-overflow: ellipsis` and test with max realistic values

## Code References

### Current CSS Pattern
```css
/* DashboardPage.css:143-163 - CURRENT (desktop-first) */
@media (max-width: var(--bp-md)) {
  .dashboard-hero__value {
    font-size: 48px;
  }
  .dashboard-stats {
    grid-template-columns: 1fr;
  }
}
```

---

**Next Steps**: Ready for implementation after 238 foundation task.
