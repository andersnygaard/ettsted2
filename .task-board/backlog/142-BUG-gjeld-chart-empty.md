# 142-BUG: Gjeld Page Chart Shows No Data

## Summary
The "Gjeldsutvikling" (debt development) chart on the Gjeld page renders the chart container and axes but displays no data line. The chart area is completely empty.

## Context
Screenshot shows:
- Chart title "Gjeldsutvikling" present
- Subtitle "Nedgang over tid" present
- X-axis labels (Des 2021 - Nov 2025) present
- NO data line or area fill visible

The Pensjon page's similar chart works correctly, suggesting an issue specific to Gjeld data or chart configuration.

## Acceptance Criteria
- [ ] Debt history line/area renders in the chart
- [ ] Chart shows historical debt values correctly
- [ ] Legend matches the data displayed

## Technical Approach
1. Check `useGjeldData` hook returns valid history array
2. Verify `debtHistory` data transformation in GjeldPage
3. Compare with working PensjonPage chart implementation
4. Check AreaChart component handling of empty/null values

## Files to Investigate
- [GjeldPage.tsx](frontend/src/features/gjeld/GjeldPage.tsx)
- [useGjeldData.ts](frontend/src/features/gjeld/useGjeldData.ts)
- [AreaChart.tsx](components/src/charts/AreaChart/AreaChart.tsx)
- Backend /gjeld endpoint

## Priority
High

## Effort
Simple (1-2 hours)

## Labels
bug, chart, data-viz
