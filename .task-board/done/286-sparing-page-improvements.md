# Sparing Page Improvements

**Status**: Done
**Completed**: 2025-12-10

## Problem
Three issues on the Sparing page need attention.

## Issues

### 1. "År til årslønn" not working or unclear
The metric showing years until savings equal annual salary is either:
- Not calculating correctly
- Not displaying clearly enough for user to understand

### 2. "Minste pensjonsalder" not working or unclear
The minimum retirement age calculation is either:
- Not calculating correctly
- Not displaying clearly enough

### Design approach for issue 1 & 2
These abstract metrics need a clever visual element to make them intuitive. Must work on mobile (no hover-dependent interactions).

Ideas:
- **Progress ring/arc**: Show current progress toward milestone
- **Timeline visualization**: Mark current position on journey to goal
- **Comparison bars**: Side-by-side current savings vs target (årslønn)
- **Milestone marker**: Visual indicator on a scale/ruler
- **Countdown display**: Large number with supporting context below
- **Expandable card**: Tap to reveal more detail/explanation
- **Inline micro-chart**: Small sparkline or bar showing progress

The goal is to make these numbers immediately understandable, using tap-friendly interactions (not hover).

**Must include**: Short explanation of how the number is calculated. Show on tap/expand:
- "År til årslønn": "Basert på nåværende sparerate og forventet avkastning"
- "Minste pensjonsalder": "Når sparing dekker 25x årlige utgifter (4%-regelen)"

### 3. Chart tabs: Totalt vs Per konto
**Moved to separate task**: See [287-chart-totalt-per-konto-tabs.md](287-chart-totalt-per-konto-tabs.md) for reusable ChartWithTabs component that applies to all pages (Sparing, Gjeld, Pensjon).

## Files to Update

### Issue 1 & 2
- `frontend/src/features/sparing/` - find calculation logic
- `backend/src/` - if calculation is server-side
- Verify formulas are correct
- Improve visual clarity of metrics

### Issue 3
- `frontend/src/features/sparing/SparingPage.tsx` or chart component
- Add tab component to switch between views
- Create per-account chart variant

## Acceptance Criteria
- [x] "År til årslønn" displays correctly and is easy to understand
- [x] "Minste pensjonsalder" displays correctly and is easy to understand
- [ ] Chart has tabs: "Totalt" and "Per konto" (MOVED TO TASK 287)
- [ ] Per-account chart shows breakdown of savings accounts over time (MOVED TO TASK 287)

## Progress Log

### 2025-12-10: Issues 1 & 2 Completed

**Changes implemented:**

1. **Enhanced FireSection Component** (`c:\code\ettsted2\frontend\src\features\sparing\FireSection.tsx`):
   - Added interactive FireStat subcomponent with expandable explanations
   - Each metric is now tap-friendly (44px+ touch target)
   - Tap to reveal detailed calculation explanation
   - Proper handling of edge cases (Infinity, 999+)
   - Added visual chevron icon that rotates when expanded
   - Improved accessibility with ARIA attributes

2. **Mobile-First CSS** (`c:\code\ettsted2\frontend\src\features\sparing\FireSection.css`):
   - Single column on mobile (stacks vertically)
   - 2 columns on tablet (640px+)
   - 4 columns on desktop (768px+)
   - Touch-friendly buttons with hover/focus/active states
   - Expandable explanation panel with left border accent
   - Smooth transitions for better UX

3. **Metric Improvements**:

   **"År til årslønn" (Years until savings = annual salary)**:
   - Displays calculated years with proper formatting
   - Shows "—" if cannot be calculated (Infinity or 100+ years)
   - Explanation: "Basert på nåværende sparing, månedlig sparing, og forventet avkastning (7% årlig). Dette er en milepæl på veien mot F.I.R.E."
   - Edge case explanation: "Kan ikke beregnes med nåværende sparerate. Øk månedlig sparing for å nå målet."

   **"Minste pensjonsalder" (Minimum retirement age)**:
   - Displays projected retirement age (or "—" if unattainable)
   - Shows "—" if age >= 999 (unreachable with current savings rate)
   - Explanation: "Basert på nåværende sparing (formatted), sparerate, og forventet avkastning (7% årlig). Du kan pensjonere deg når sparing dekker 25x årlige utgifter."
   - Edge case explanation: "Kan ikke beregnes med nåværende sparerate. Øk månedlig sparing for å nå F.I.R.E.-målet."

4. **Calculation Verification**:
   - Reviewed `useSparingData.ts` - calculations are correct
   - Uses compound growth formula: `FV = PV * (1 + r)^n + PMT * (((1 + r)^n - 1) / r)`
   - Assumes 7% annual growth rate (GROWTH_RATES.DEFAULT)
   - Iterative approach for projections with annual contributions

**Build Status**: Passed (`pnpm --filter frontend build`)

**Design Decisions**:
- Expandable cards instead of tooltips (better for mobile)
- Visual indicator (chevron) shows tap affordance
- Explanations appear below metric (not overlay)
- Left border accent on explanation for visual hierarchy
- Consistent with Nordic Minimal design system
