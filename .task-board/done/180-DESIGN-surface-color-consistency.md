# 180-DESIGN: Use --surface Color for Cards Consistently

## Summary
Pages use `--warm-white` (#FDFCFA) for card backgrounds, but user prefers the slightly darker `--surface` (#faf6f4). Consolidate to single surface color.

## Priority
MEDIUM

## Effort
Simple

## Context
Design tokens define two similar whites:
- `--warm-white: #FDFCFA` - Currently used for cards
- `--surface: #faf6f4` - Exists but unused

User prefers the warmer, slightly darker `#faf6f4` for elevated surfaces.

## File Locations
- [frontend/src/styles/tokens.css](frontend/src/styles/tokens.css#L15) - `--warm-white` definition
- Multiple page CSS files using `--warm-white` for backgrounds

## Pages Affected
- SparingPage.css
- GjeldPage.css
- PensjonPage.css
- CompoundCalculatorPage.css
- LoanCalculatorPage.css
- MonteCarloChart.css
- FireSection.css
- LoginModal.css
- DeleteAccountModal.css

## Acceptance Criteria
- [x] Update `--warm-white` value to `#faf6f4` in tokens.css
- [x] Cards have consistent, slightly warmer background
- [x] Visual hierarchy maintained (surface darker than bone background)

## Status: COMPLETED
- Updated `--warm-white` from `#FDFCFA` to `#faf6f4` in tokens.css
- Build verified successful (pnpm --filter frontend build)
- All card backgrounds now use the preferred warmer surface color

## Technical Approach
**Option A (Recommended)**: Change `--warm-white` value in tokens.css from `#FDFCFA` to `#faf6f4`. Single change, all cards updated.

**Option B**: Keep both tokens, replace usages. More work, but preserves both options.

## Notes
Current hierarchy: `--bone` (#F5F2ED) > `--warm-white` (#FDFCFA) > white
Proposed: `--bone` (#F5F2ED) > `--warm-white` (#faf6f4) > white
