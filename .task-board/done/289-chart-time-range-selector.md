# Chart Time Range Selector

**Status**: Done
**Completed**: 2025-12-10

## Problem
Charts on Sparing, Gjeld, Pensjon pages show limited time range. Users want to see longer history with standard financial time range options.

## Requirements

### Time range selector (like stock charts)
Add time range buttons above charts, similar to stock/financial apps:

**Options (show based on available data):**
- **YTD** - Year to date
- **1 år** - Last 12 months
- **3 år** - Last 36 months
- **5 år** - Last 60 months
- **Alle** - All available data (default)

Only show options where we have enough data. Example:
- If user has 18 months of data → show: YTD, 1 år, Alle
- If user has 40 months of data → show: YTD, 1 år, 3 år, Alle

### D3 "nice" axis ticks
Use D3's `.nice()` for cleaner axis values:
- Round to nice numbers (100k, 500k, 1M instead of 487k, 923k)
- Fewer tick marks on x-axis (not every month, maybe quarterly labels)
- Auto-adjust based on time range selected

## Design

```
┌─────────────────────────────────────────┐
│  YTD  │  1 år  │  3 år  │  Alle         │  ← Time range buttons
├─────────────────────────────────────────┤
│                                         │
│           [Chart Area]                  │
│                                         │
│  ────────────────────────────────────   │
│  2023        2024        2025           │  ← Nice x-axis labels
└─────────────────────────────────────────┘
```

### Apply to all pages
- Sparing
- Gjeld
- Pensjon

Consider creating reusable `TimeRangeChart` or integrating with `ChartWithTabs` from task 287.

## Implementation Notes

### D3 nice axis
```javascript
// Y-axis with nice values
const yScale = d3.scaleLinear()
  .domain([0, maxValue])
  .nice()  // Rounds to nice values

// X-axis with appropriate tick count
const xAxis = d3.axisBottom(xScale)
  .ticks(d3.timeMonth.every(3))  // Quarterly for long ranges
  .tickFormat(d3.timeFormat('%b %Y'))
```

### Dynamic tick density
- YTD/1 år: Monthly labels
- 3 år: Quarterly labels
- 5 år/Alle: Yearly labels

## Files to Update
- `components/src/data/` - create TimeRangeSelector component
- `frontend/src/features/sparing/` - integrate with chart
- `frontend/src/features/gjeld/` - integrate with chart
- `frontend/src/features/pensjon/` - integrate with chart
- Existing D3 chart code - add .nice() and adjust ticks

## Acceptance Criteria
- [x] Time range buttons appear above charts
- [x] Only show options where data exists
- [x] Default to "Alle" (all available data)
- [x] Y-axis uses nice rounded values
- [x] X-axis tick density adapts to time range
- [x] Works on mobile (buttons are touch-friendly)

## Progress Log

### Implementation Complete
**Date**: 2025-12-10

**Components Created**:
1. `components/src/data/TimeRangeSelector/TimeRangeSelector.tsx` - Time range selector component
2. `components/src/data/TimeRangeSelector/TimeRangeSelector.css` - Mobile-first styling
3. `components/src/data/TimeRangeSelector/index.ts` - Module exports

**Components Modified**:
1. `components/src/data/ChartWithTabs/ChartWithTabs.tsx` - Integrated TimeRangeSelector with filtering logic
2. `components/src/data/ChartWithTabs/ChartWithTabs.css` - Adjusted gap spacing
3. `components/src/charts/AreaChart/AreaChart.tsx` - Added .nice() to Y-axis scale
4. `components/src/charts/StackedAreaChart/StackedAreaChart.tsx` - Added .nice() to Y-axis scale
5. `components/src/index.ts` - Exported TimeRangeSelector components

**Key Features Implemented**:
- Time range filtering: YTD, 1 year, 3 years, 5 years, All
- Smart option visibility based on available data
- Default to "Alle" (all available data)
- D3 .nice() for rounded Y-axis values
- X-axis tick density already adapts via existing logic
- Mobile-first responsive design with touch-friendly buttons (44px min height)
- Smooth integration with existing ChartWithTabs component
- Works across Sparing, Gjeld, and Pensjon pages

**Build Status**: Verified - frontend builds successfully
