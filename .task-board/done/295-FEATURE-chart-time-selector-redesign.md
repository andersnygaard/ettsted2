# Chart Time Selector Redesign

## Problem

Current TimeRangeSelector is positioned above charts and uses a traditional button row. The reference design (VOO stock chart) shows a more elegant approach: time range buttons positioned **below** the chart with a refined pill-button style.

## Design Direction

**Aesthetic**: Nordic Minimal meets Financial Terminal

Inspired by modern trading platforms but adapted to the warm Nordic palette. The selector should feel sophisticated and purposeful - like a professional financial tool, not a generic UI element.

### Key Design Decisions

1. **Position**: Move time selector to **below** the chart
2. **Style**: Pill buttons with subtle borders, smooth hover transitions
3. **Active State**: Filled pill (charcoal) with inverted text
4. **Inactive State**: Transparent with subtle border
5. **Layout**: Centered row with controlled spacing

### Visual Reference

```
┌─────────────────────────────────────────────────┐
│                                                 │
│              [Chart Area]                       │
│                                                 │
│                                                 │
└─────────────────────────────────────────────────┘

    ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐
    │ YTD │  │ 1 År│  │ 3 År│  │ 5 År│  │ Alle│  ← Pill buttons, centered
    └─────┘  └─────┘  └─────┘  └─────┘  └─────┘
```

## Design Specifications

### Button Style (Inactive)
```css
background: transparent;
border: 1px solid var(--border-strong);
border-radius: var(--radius-full);  /* Full pill shape */
color: var(--text-secondary);
font-family: var(--font-body);
font-size: var(--font-size-sm);
font-weight: var(--font-weight-medium);
text-transform: uppercase;
letter-spacing: 0.5px;
padding: 10px 20px;
```

### Button Style (Active)
```css
background: var(--charcoal);
border-color: var(--charcoal);
color: var(--warm-white);
font-weight: var(--font-weight-semibold);
```

### Hover Animation
```css
transition: all 200ms ease-out;
/* Hover: subtle background tint, border darkens */
```

### Container
```css
display: flex;
justify-content: center;
gap: var(--space-sm);
margin-top: var(--space-lg);
padding: var(--space-md) 0;
```

## Implementation

### 1. Update TimeRangeSelector Component

Minimal changes to the component itself - mostly CSS updates:
- Change border-radius to full pill
- Adjust padding for pill proportions
- Refine transitions

### 2. Update ChartWithTabs Layout

Move `<TimeRangeSelector>` from above tabs to below chart content:

```tsx
// Before (current):
<section className="chart-with-tabs">
  <TimeRangeSelector ... />      {/* Above tabs */}
  <div className="tabs">...</div>
  <div className="chart-content">...</div>
</section>

// After (new):
<section className="chart-with-tabs">
  <div className="tabs">...</div>
  <div className="chart-content">...</div>
  <TimeRangeSelector ... />      {/* Below chart */}
</section>
```

### 3. CSS Updates

**TimeRangeSelector.css:**
- Full border-radius for pill shape
- Refined padding (taller, more horizontal space)
- Smoother transitions
- Centered container with justify-content: center

**ChartWithTabs.css:**
- Adjust layout to accommodate selector below chart
- Add proper spacing between chart and selector

## Affected Components

### Components Package
- `components/src/data/TimeRangeSelector/TimeRangeSelector.css` - Pill button styling
- `components/src/data/ChartWithTabs/ChartWithTabs.tsx` - Move selector position
- `components/src/data/ChartWithTabs/ChartWithTabs.css` - Layout adjustments

### Pages Using Charts
No changes needed - they consume ChartWithTabs which handles the layout.
- **Sparing page** ✓
- **Gjeld page** ✓
- **Pensjon page** ✓

## Acceptance Criteria

- [x] Time selector appears **below** all charts
- [x] Buttons are pill-shaped (fully rounded corners)
- [x] Active button is filled charcoal with white text
- [x] Inactive buttons have subtle border, transparent background
- [x] Smooth hover transition (200ms)
- [x] Buttons are centered below chart
- [x] Mobile: Full-width pills, stacked if needed
- [x] Maintains touch-friendly target size (44px height)
- [x] Consistent across all chart pages

## Mobile Considerations

On mobile (< 640px):
- Buttons can be slightly smaller but maintain 44px touch target
- May need to wrap to 2 rows if all 5 options shown
- Consider horizontal scroll as alternative to wrapping

## Priority

Medium - UX enhancement for chart interactions.
