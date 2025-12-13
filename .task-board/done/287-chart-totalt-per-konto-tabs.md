# Chart Tabs: Totalt vs Per Konto

**Status**: Done
**Completed**: 2025-12-10

## Problem
All historical charts (Sparing, Gjeld, Pensjon) only show aggregated totals. Users want to see breakdown per account.

## Requirements

### Reusable ChartWithTabs component
Create a shared component that wraps existing charts and adds tab switching:

**Tabs:**
- "Totalt" - current aggregated line chart (default)
- "Per konto" - stacked area or multi-line showing each account

### Apply to all pages
- **Sparing**: Total savings vs per savings account
- **Gjeld**: Total debt vs per loan
- **Pensjon**: Total pension vs per pension account

## Implementation

### Component structure
```tsx
<ChartWithTabs
  data={snapshots}
  accounts={accounts}
  valueKey="value"  // or filter function
  title="Spareutvikling"
/>
```

### Chart types
- **Totalt tab**: Single line (existing behavior)
- **Per konto tab**:
  - Option A: Stacked area chart (shows contribution of each account)
  - Option B: Multi-line chart (easier to compare individual accounts)
  - Recommend: Stacked area for composition, multi-line toggle optional

### Legend
Per konto view needs legend showing:
- Account name
- Color mapping
- Current value (optional)

## Files to Create/Update
- `components/src/data/ChartWithTabs/` - new shared component
- `frontend/src/features/sparing/SparingChart.tsx` - use ChartWithTabs
- `frontend/src/features/gjeld/GjeldChart.tsx` - use ChartWithTabs
- `frontend/src/features/pensjon/PensjonChart.tsx` - use ChartWithTabs

## Acceptance Criteria
- [x] ChartWithTabs component created and reusable
- [x] Sparing page chart has Totalt/Per konto tabs
- [x] Gjeld page chart has Totalt/Per konto tabs
- [x] Pensjon page chart has Totalt/Per konto tabs
- [x] Per konto view shows stacked area or multi-line
- [x] Legend visible in Per konto view
- [x] Tabs work on mobile (touch-friendly)

## Implementation Summary

### Created Files
1. **`components/src/data/ChartWithTabs/ChartWithTabs.tsx`** - Main component with tab switching logic
2. **`components/src/data/ChartWithTabs/ChartWithTabs.css`** - Mobile-first responsive styles
3. **`components/src/data/ChartWithTabs/index.ts`** - Barrel export

### Modified Files

**Components Package:**
- `components/src/index.ts` - Added ChartWithTabs export

**Data Hooks:**
- `frontend/src/features/sparing/useSparingData.ts` - Added accountHistory and accounts arrays
- `frontend/src/features/gjeld/useGjeldData.ts` - Added accountHistory and accounts arrays
- `frontend/src/features/pensjon/usePensjonData.ts` - Added accountHistory and accounts arrays with privatePension/publicPension aggregates

**Pages:**
- `frontend/src/features/sparing/SparingPage.tsx` - Replaced AreaChart with ChartWithTabs
- `frontend/src/features/gjeld/GjeldPage.tsx` - Replaced AreaChart with ChartWithTabs
- `frontend/src/features/pensjon/PensjonPage.tsx` - Replaced StackedAreaChart with ChartWithTabs (using totalStacked mode)

### Features Implemented
- **Tab Switching**: "Totalt" and "Per konto" tabs with proper ARIA attributes
- **Totalt View**: Shows aggregated line chart (or stacked for Pensjon showing private vs public)
- **Per Konto View**: Shows stacked area chart with each account as a series
- **Legend**: Automatically displayed in stacked area charts showing account names and colors
- **Mobile Support**: Touch-friendly 44px min-height tabs, responsive breakpoints
- **Accessibility**: Proper tablist/tab/tabpanel roles, aria-selected, aria-controls
- **Animation**: Smooth fade-in on tab switch, respects prefers-reduced-motion

### Special Handling

**Pensjon Page**:
- Uses `totalStacked={true}` and `totalStackedSeries` props
- Totalt view shows private vs public pension (2 series stacked)
- Per konto view shows all individual pension accounts
- Data structure includes both aggregated keys (privatePension, publicPension) and individual account keys

**Color Palette**:
- Default colors: pale-blue, muted-sage, soft-terracotta, orange, gold
- Custom colors can be passed via `accountColors` prop
- Totalt view color customizable via `totalColor` prop
