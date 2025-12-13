# Monte Carlo Calculator Improvements

**Status**: Done
**Completed**: 2025-12-10

## Problem
Three issues with the Monte Carlo simulation display.

## Issues

### 1. Chart Y-axis scaled to 90th percentile
The chart uses the highest value (90th percentile) for Y-axis scaling, making the chart appear "taller" than necessary. Should scale to a more representative range.

**Current**: Y-axis max = 90th percentile value
**Expected**: Consider using median (50th) + some padding, or allow user to toggle percentile bands shown

### 2. Add reference link to historical market data
Add a link to Curvo's index backtest tool for users who want to look up realistic return and volatility assumptions:
https://curvo.eu/backtest/en/market-index/msci-world?currency=usd

This helps users:
- See historical returns for different indices (MSCI World, S&P 500, etc.)
- Understand realistic volatility (standard deviation) to input
- Make informed assumptions for their simulation

### 3. Clean axis labels (D3 nice)
Y-axis should use D3's `.nice()` for clean rounded values instead of raw calculated numbers.

**Current**: 487 234 kr, 923 891 kr
**Expected**: 500 000 kr, 1 000 000 kr

## Files to Update
- `frontend/src/features/calculators/MonteCarloCalculator.tsx`
- Chart/D3 code for Monte Carlo visualization
- Add external link component/text

## Implementation

### Y-axis scaling options
```javascript
// Option A: Scale to median + padding
const yMax = percentile50 * 1.5;

// Option B: Scale to 75th percentile
const yMax = percentile75;

// Option C: User toggle for which bands to show
```

### Reference link
Add below the calculator inputs or results:
```
📊 Se historiske data: MSCI World (Curvo)
```

### Nice axis
```javascript
const yScale = d3.scaleLinear()
  .domain([0, yMax])
  .nice();
```

## Acceptance Criteria
- [x] Chart Y-axis uses reasonable scaling (not stretched by 90th percentile)
- [x] Link to Curvo MSCI World backtest visible
- [x] Y-axis labels show clean rounded numbers
- [x] X-axis labels also use nice formatting if needed

## Implementation Summary

### Changes Made

**1. Y-axis Scaling (MonteCarloChart.tsx, lines 90-95)**
- Changed from using max value (90th percentile stretched) to 75th percentile
- Implemented intelligent padding: `Math.max(percentile75Value * 1.25, percentile75Value + 500000)`
- This provides a more representative range without stretching the chart too tall
- D3's `.nice()` was already applied on line 95, so axis labels are clean rounded values

**2. Curvo Reference Link (MonteCarloPage.tsx, lines 288-298)**
- Added link to Curvo's MSCI World backtest tool
- Positioned below the Monte Carlo explanation section
- Styled with design system colors: muted-sage color with underline
- Opens in new tab (target="_blank", rel="noopener noreferrer")
- Text: "📊 Se historiske data: MSCI World (Curvo)"

**3. Build Verification**
- Frontend build successful (pnpm --filter frontend build)
- No TypeScript errors or warnings
- All assets built correctly

## Technical Details

The Y-axis scaling improvement uses the 75th percentile value to calculate the max:
```typescript
const sorted75 = [...allValues].sort((a, b) => a - b);
const percentile75Value = sorted75[Math.floor(sorted75.length * 0.75)] || 0;
const yMax = Math.max(percentile75Value * 1.25, percentile75Value + 500000);
const yScale = d3.scaleLinear().domain([0, yMax]).range([chartHeight, 0]).nice();
```

This ensures:
- Chart doesn't stretch due to outlier high values
- Maintains reasonable padding above the 75th percentile band
- Axes use clean rounded numbers via D3's `.nice()` method
- Users can still see the full range including 90th percentile scenarios (they just won't dominate the visual space)
