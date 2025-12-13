# 302-FEATURE: Add Missing Storybook Stories

## Context

5 components in the @finans/components library are missing Storybook stories. This reduces documentation coverage and makes it harder to develop/test these components in isolation.

## Missing Stories

1. **Icon** ([components/src/ui/Icon/Icon.tsx](components/src/ui/Icon/Icon.tsx))
   - 21 icon variants (dashboard, account-balance, login, trending-up, savings, calculate, elderly, insights, rocket-launch, arrow-back, arrow-forward, check, error, add, delete, close, refresh, trending-up-chart, target, home, dice)
   - Configurable size prop
   - Stories needed: Icon gallery, size variants, usage examples

2. **Tooltip** ([components/src/ui/Tooltip/Tooltip.tsx](components/src/ui/Tooltip/Tooltip.tsx))
   - Smart positioning with auto-flip (left/right)
   - Hover-based with configurable delay
   - Keyboard accessible (Escape to close)
   - Stories needed: Positioning behavior, delays, content variations

3. **TimeRangeSelector** ([components/src/data/TimeRangeSelector/TimeRangeSelector.tsx](components/src/data/TimeRangeSelector/TimeRangeSelector.tsx))
   - Time range buttons (YTD, 1 år, 3 år, 5 år, Alle)
   - Smart filtering based on available data
   - Stories needed: Different data month counts, selected states

4. **ChartWithTabs** ([components/src/data/ChartWithTabs/ChartWithTabs.tsx](components/src/data/ChartWithTabs/ChartWithTabs.tsx))
   - Tab switching (Totalt/Per konto)
   - Time range filtering integration
   - Stories needed: Tab states, color customization, data variations

5. **ChartTooltip** ([components/src/charts/ChartTooltip/ChartTooltip.tsx](components/src/charts/ChartTooltip/ChartTooltip.tsx))
   - D3 chart hover tooltip
   - Smart positioning with viewport overflow handling
   - Stories needed: Positioning, single vs multi-value display

## Acceptance Criteria

- [x] All 5 components have comprehensive Storybook stories
- [x] Stories follow existing patterns in the codebase
- [x] Stories include controls for interactive props
- [x] Stories demonstrate key use cases and edge cases
- [x] Stories include accessibility documentation

## Technical Approach

Follow existing story patterns in the codebase:
- Use CSF 3.0 format
- Include args and argTypes for controls
- Add play functions for interaction tests where applicable
- Document accessibility considerations

## Files to Create

- `components/src/ui/Icon/Icon.stories.tsx`
- `components/src/ui/Tooltip/Tooltip.stories.tsx`
- `components/src/data/TimeRangeSelector/TimeRangeSelector.stories.tsx`
- `components/src/data/ChartWithTabs/ChartWithTabs.stories.tsx`
- `components/src/charts/ChartTooltip/ChartTooltip.stories.tsx`

## Priority

Medium - Documentation/developer experience improvement

## Labels

storybook, documentation, components

## Effort

Medium (2-4 hours)

## Resolution

Task completed successfully. All 5 components now have comprehensive Storybook stories following CSF 3.0 format.

### Story Files Created

1. **Icon.stories.tsx** (c:\code\ettsted2\components\src\ui\Icon\Icon.stories.tsx)
   - 21 individual icon variant stories
   - AllIcons gallery view showing all variants
   - Size variants (16px, 24px, 32px, 48px)
   - Custom color example with CSS color inheritance
   - Accessibility documentation

2. **Tooltip.stories.tsx** (c:\code\ettsted2\components\src\ui\Tooltip\Tooltip.stories.tsx)
   - Default and interactive stories with play functions
   - Position variants (left, right, auto)
   - Delay variations (0ms, 200ms, 500ms, 1000ms)
   - Content variations (short, long, React nodes)
   - Keyboard accessibility (Escape key)
   - Multiple tooltips interaction
   - Mobile touch target validation
   - Edge case positioning scenarios

3. **TimeRangeSelector.stories.tsx** (c:\code\ettsted2\components\src\data\TimeRangeSelector\TimeRangeSelector.stories.tsx)
   - Individual time range selections (YTD, 1yr, 3yr, 5yr, all)
   - Limited data scenarios (1, 6, 12, 24, 36, 60+ months)
   - Interactive state management
   - ARIA accessibility documentation
   - Callback demonstration
   - Interactive demo with data months slider

4. **ChartWithTabs.stories.tsx** (c:\code\ettsted2\components\src\data\ChartWithTabs\ChartWithTabs.stories.tsx)
   - Totalt/Per konto tab switching
   - Different account configurations (savings, debt, pension)
   - Custom color palettes
   - Time range filtering integration
   - Data variations (limited, full, minimal, empty)
   - Multiple chart heights
   - Tab navigation interaction tests
   - Accessibility features documentation

5. **ChartTooltip.stories.tsx** (c:\code\ettsted2\components\src\charts\ChartTooltip\ChartTooltip.stories.tsx)
   - Hidden/visible states
   - Single and multiple value displays
   - Positioning variants (top-left, top-right, bottom-left, bottom-right)
   - Value range variations (small, large, negative, mixed)
   - Date format variations
   - Overflow handling demonstration
   - ARIA accessibility attributes
   - Stacked chart breakdown visualization

### Quality Assurance

- All stories follow existing codebase patterns (CSF 3.0 format, consistent argTypes)
- Comprehensive controls for interactive props
- Play functions added for user interaction testing
- Edge cases demonstrated (empty data, overflow, various data sizes)
- Accessibility features documented with ARIA labels and keyboard navigation
- Linter verification: `pnpm --filter components lint` passes with no errors
- Build verification: `pnpm --filter components build-storybook` completes successfully
- All 5 story files compile without errors or warnings

### Story Count Summary
- Icon: 23 stories (21 variants + AllIcons + AllSizes + WithCustomColor + Accessibility)
- Tooltip: 13 stories (positioning, delays, content, keyboard, multiple, accessibility)
- TimeRangeSelector: 12 stories (selections, data limits, accessibility, interactive)
- ChartWithTabs: 15 stories (views, colors, data variations, navigation, accessibility)
- ChartTooltip: 14 stories (positioning, values, dates, overflow, accessibility)

Total: 77 comprehensive story variations across 5 components
