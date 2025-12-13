# Chart Hover Tooltip

## Problem

Charts across the application lack interactive hover functionality. Users cannot see exact values at specific points in time - they can only see the overall trend.

## Chart Inventory

All charts that need hover tooltip:

### Components Package (D3-based)
| Component | Location | Used By |
|-----------|----------|---------|
| **AreaChart** | `components/src/charts/AreaChart/` | ChartWithTabs (Totalt view) |
| **StackedAreaChart** | `components/src/charts/StackedAreaChart/` | ChartWithTabs (Per Konto view), Pensjon (stacked totalt) |

### Frontend (D3-based)
| Component | Location | Used By |
|-----------|----------|---------|
| **MonteCarloChart** | `frontend/src/features/calculators/MonteCarloChart.tsx` | Monte Carlo page |

### Pages Using Charts
- **Sparing** - via ChartWithTabs (AreaChart + StackedAreaChart)
- **Gjeld** - via ChartWithTabs (AreaChart + StackedAreaChart)
- **Pensjon** - via ChartWithTabs (StackedAreaChart for both views)
- **Compound Calculator** - AreaChart
- **FIRE Calculator** - AreaChart
- **Loan Calculator** - AreaChart
- **Monte Carlo** - MonteCarloChart (already has some hover)

## Expected Behavior

### Hover Interaction
1. User hovers over chart area
2. Vertical line appears at cursor x-position
3. Tooltip shows:
   - Date at that point
   - Value(s) at that point
   - For stacked charts: breakdown of each series

### Tooltip Design

**Simple, elegant indicator** - NOT a complex multi-line tooltip:

```
┌─────────────────────┐
│  450 000 kr         │  ← Value only, white text
│  Jun 2024           │  ← Date below, muted
└─────────────────────┘
```

For stacked charts (optional expansion on click/long-press):
```
┌─────────────────────┐
│  450 000 kr         │
│  Jun 2024           │
└─────────────────────┘
```

### Visual Styling

```css
.chart-tooltip {
  background: var(--charcoal);           /* Dark background */
  color: var(--warm-white);              /* White text */
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);         /* Monospace for numbers */
  font-size: var(--font-size-sm);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  pointer-events: none;
}

.chart-tooltip__value {
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
}

.chart-tooltip__date {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  opacity: 0.7;
  margin-top: 2px;
}
```

### Visual Elements
- **Vertical line**: Thin solid line, charcoal at 30% opacity
- **Dot**: Small circle (6px) at data point, filled with series color
- **Tooltip**: Compact dark pill, positioned above cursor

## Implementation Approach

### Shared Tooltip Component
Create reusable tooltip for all charts:

```
components/src/charts/ChartTooltip/
├── ChartTooltip.tsx
├── ChartTooltip.css
└── index.ts
```

### Props Interface
```typescript
interface ChartTooltipProps {
  visible: boolean;
  x: number;
  y: number;
  date: Date;
  values: Array<{
    label: string;
    value: number;
    color: string;
  }>;
  total?: number;
}
```

### Integration Pattern
Each chart component adds:
1. Mouse event handlers (mousemove, mouseleave)
2. State for tooltip position and data
3. D3 bisector to find nearest data point
4. Render ChartTooltip component

### D3 Bisector Example
```typescript
const bisect = d3.bisector((d: DataPoint) => d.date).left;

const handleMouseMove = (event: MouseEvent) => {
  const [mx] = d3.pointer(event);
  const x0 = xScale.invert(mx);
  const i = bisect(data, x0);
  const d = data[i];
  // Update tooltip state with d
};
```

## Affected Components

### New Files
- `components/src/charts/ChartTooltip/ChartTooltip.tsx`
- `components/src/charts/ChartTooltip/ChartTooltip.css`

### Modified Files
- `components/src/charts/AreaChart/AreaChart.tsx` - Add hover handling
- `components/src/charts/StackedAreaChart/StackedAreaChart.tsx` - Add hover handling
- `frontend/src/features/calculators/MonteCarloChart.tsx` - Improve existing hover

### Exports
- `components/src/index.ts` - Export ChartTooltip

## Acceptance Criteria

- [x] AreaChart shows tooltip on hover with date and value
- [x] StackedAreaChart shows tooltip with breakdown per series
- [x] Vertical hover line tracks cursor position
- [x] Dots appear at data points on hover
- [x] Tooltip follows Nordic Minimal design (charcoal bg, warm-white text)
- [x] Tooltip positions intelligently (doesn't overflow container)
- [x] Works on touch devices (tap to show, tap elsewhere to hide)
- [x] Smooth appearance/disappearance (fade transition)
- [x] Values formatted with Norwegian currency (formatCurrency)
- [x] Dates formatted with Norwegian locale (formatDate)

## Mobile Considerations

- Touch: Show tooltip on tap, hide on tap elsewhere
- Position: Ensure tooltip doesn't go off-screen
- Size: Slightly larger touch target for accuracy

## Priority

Medium - Improves data exploration and chart usability.
