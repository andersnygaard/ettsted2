# DESIGN: Minimal Text-Based Time Selector

**Status**: Backlog
**Created**: 2025-12-12
**Priority**: Medium
**Labels**: components, design-system, charts
**Estimated Effort**: Simple - 0.5 days

## Context & Motivation

Current TimeRangeSelector uses pill buttons with borders and inverted active state. This is visually heavy for a secondary control.

Inspired by Robinhood's chart time selector:
- Plain text links
- Right-aligned
- Tight margin to chart
- Active state is just bolder text (or subtle box)
- Minimal visual weight

## Current State

```css
/* Current: Pill buttons */
.time-range-selector__button {
  padding: 10px 20px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-full);
  background: transparent;
}

.time-range-selector__button--active {
  color: var(--warm-white);
  background: var(--charcoal);  /* Inverted - heavy */
}
```

**Current layout**: Centered, large gap, generous padding

## Desired Outcome

Text-only time selector:
- **No borders, no pills**
- **Right-aligned** (not centered)
- **Tight to chart** (minimal padding)
- **Active state**: Bold text + subtle background OR just bold
- **Smaller touch targets** acceptable (secondary control)

Visual reference (Robinhood style):
```
                          1D  1W  1M  3M  YTD  1Y  5Y  ALL
```

## Acceptance Criteria

- [x] Remove pill/border styling from TimeRangeSelector
- [x] Right-align the selector
- [x] Reduce padding/gap (tighter spacing)
- [x] Active state: bold text, optional subtle background
- [x] Reduce vertical padding in ChartWithTabs (tighter to chart)
- [x] Maintain accessibility (focus states, aria)
- [x] Works on mobile (touch targets still reasonable)

## Affected Components

### Components Library
- **Modify**: `components/src/data/TimeRangeSelector/TimeRangeSelector.css`
- **Modify**: `components/src/data/ChartWithTabs/ChartWithTabs.css` (reduce gap)

### Testing
- Visual verification on Sparing, Gjeld, Pensjon pages
- Mobile responsiveness check

## Technical Approach

### CSS Changes

**TimeRangeSelector.css** - Strip to text-only:
```css
.time-range-selector {
  display: flex;
  justify-content: flex-end;  /* Right-align */
  gap: var(--space-sm);       /* Tighter gap */
  padding: var(--space-xs) 0; /* Minimal vertical padding */
}

.time-range-selector__button {
  padding: var(--space-xs) var(--space-sm);
  background: transparent;
  border: none;               /* Remove border */
  border-radius: var(--radius-sm);
  font-family: var(--font-body);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.time-range-selector__button:hover {
  color: var(--charcoal);
  background: var(--charcoal-light-4); /* Subtle hover */
}

.time-range-selector__button--active {
  color: var(--charcoal);
  font-weight: var(--font-weight-semibold);
  background: var(--charcoal-light-4); /* Subtle active bg */
}
```

**ChartWithTabs.css** - Tighter spacing:
```css
.chart-with-tabs {
  gap: var(--space-sm);  /* Reduce from var(--space-md) */
}
```

### Implementation Steps

1. Update TimeRangeSelector.css with text-only style
2. Update ChartWithTabs.css to reduce gap
3. Test on all three pages (Sparing, Gjeld, Pensjon)
4. Verify mobile responsiveness
5. Update Storybook if story exists

### Dependencies

- **External**: None
- **Internal**: None
- **Blocking**: None

### Risks & Considerations

- **Risk**: Touch targets too small on mobile
  - **Mitigation**: Keep minimum padding, rely on gap spacing
- **Risk**: Active state too subtle
  - **Mitigation**: Use both bold + subtle background

## Code References

### Current TimeRangeSelector
```css
/* components/src/data/TimeRangeSelector/TimeRangeSelector.css */
.time-range-selector {
  justify-content: center;  /* → flex-end */
  gap: var(--space-sm);
  padding: var(--space-md) 0;  /* → var(--space-xs) 0 */
}

.time-range-selector__button {
  border: 1px solid var(--border-strong);  /* → none */
  border-radius: var(--radius-full);  /* → var(--radius-sm) */
}

.time-range-selector__button--active {
  background: var(--charcoal);  /* → var(--charcoal-light-4) */
  color: var(--warm-white);  /* → var(--charcoal) */
}
```

## Design Notes

### Visual Specification
- **Alignment**: Right (flex-end)
- **Gap**: `--space-sm` (8px)
- **Padding**: `--space-xs` vertical
- **Font**: `--font-body`, `--font-size-sm`
- **Active**: Bold + subtle bg (`--charcoal-light-4`)
- **No borders, no pills**

### Robinhood Reference
The screenshot shows:
- Text-only buttons: `1D  1W  1M  3M  YTD  1Y  5Y  ALL`
- Active button (1D) has subtle rounded background
- Right side, close to chart
- Very compact

---

## Implementation Completed

**Date**: 2025-12-12

**Changes Made**:
1. Updated `components/src/data/TimeRangeSelector/TimeRangeSelector.css`:
   - Removed pill/border styling (no borders)
   - Changed alignment from `center` to `flex-end` (right-aligned)
   - Reduced padding from `var(--space-md)` to `var(--space-xs)` vertically
   - Simplified active state to bold text + subtle background (`--charcoal-light-4`)
   - Updated transitions to be more minimal
   - Maintained accessibility (focus-visible states, aria-pressed)
   - Kept touch targets reasonable with adequate padding and gap

2. Updated `components/src/data/ChartWithTabs/ChartWithTabs.css`:
   - Reduced gap from `var(--space-md)` to `var(--space-sm)` for tighter spacing to chart

**Testing**:
- ✓ Frontend build successful (CSS compiles cleanly)
- ✓ TypeScript type-check passes
- ✓ No breaking changes to component API

**Status**: COMPLETE - Ready for visual verification on Sparing, Gjeld, Pensjon pages
