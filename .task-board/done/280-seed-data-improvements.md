# Seed Data Improvements

**Status**: Done
**Completed**: 2025-12-10

## Problem
Current demo seed data has two issues:
1. User profile values use odd numbers (e.g., 52000 instead of 50000) - looks unrealistic
2. Only 24 months of history - want 37 months for better chart visualization
3. Market movements are too linear - doesn't reflect real market volatility

## Requirements

### 1. Round numbers in user profile only
Update user.json files in demo profiles to use round numbers for:
- `monthlySalary` - e.g., 50000, 60000, 75000
- `monthlySavings` - e.g., 10000, 15000, 20000
- `fireNumber` (if set) - e.g., 5000000, 10000000

**Note**: Snapshot values should remain realistic/varied, not rounded.

### 2. Generate 37 months of history
- Start date: 37 months before current month
- End date: Current month (December 2025)
- This means starting from December 2022

### 3. Realistic market movements (based on S&P 500)
Apply realistic market conditions to investment accounts (aksjer, fond):

**Reference: S&P 500 levels (approximate)**
| Period | Level | Movement |
|--------|-------|----------|
| Dec 2022 | ~3800 | Bottom after 2022 bear market |
| Jun 2023 | ~4450 | +17% recovery |
| Dec 2023 | ~4750 | +25% from bottom |
| Jun 2024 | ~5500 | Continued rally |
| Dec 2024 | ~6000 | +58% from 2022 bottom |
| Dec 2025 | ~7000 | All-time highs |

**Apply to seed data:**
- **Late 2022**: Start at depressed values (market bottom)
- **2023**: Strong recovery, ~25% growth
- **2024**: Continued growth, ~25%
- **2025**: More modest growth, ~15%

Debt accounts: steady linear decrease (mortgage payments).
Pension accounts: moderate steady growth (less volatile than stocks).
Bank accounts: small fluctuations around stable value.

**Note**: Add studielån to standard profile so demo shows multiple loans (see task 288).

**Note**: Add boligverdi (eiendom) to standard profile to demonstrate equity tracking (see task 293). Property value ~4M with ~2.3M loan = ~1.7M equity.

## Files to Update

### Demo profiles (primary)
- `backend/src/seed/fixtures/demo/standard/user.json` - round profile numbers
- `backend/src/seed/fixtures/demo/standard/snapshots.json` - 37 months with market movements
- `backend/src/seed/fixtures/demo/debt-heavy/user.json`
- `backend/src/seed/fixtures/demo/debt-heavy/snapshots.json`
- `backend/src/seed/fixtures/demo/fire-achieved/user.json`
- `backend/src/seed/fixtures/demo/fire-achieved/snapshots.json`

### Optional: General seed fixtures
- `backend/src/seed/fixtures/users.json`
- `backend/src/seed/fixtures/snapshots.json`

## Implementation Notes

Consider creating a generator script to produce realistic snapshot data:
1. Define base values for each account type
2. Apply monthly growth rates with variance
3. Apply market events (2022 crash, 2023 recovery)
4. Output to JSON files

Alternatively, manually craft the JSON to tell a realistic financial story.

## Acceptance Criteria
- [x] User profile values are round numbers (50000, not 52347)
- [x] 37 months of snapshot history (Dec 2022 - Dec 2025)
- [x] Investment accounts show 2022 dip and 2023 recovery
- [x] Net worth progression tells a believable story
- [x] All demo profiles updated consistently

## Implementation Complete

Updated all three demo profiles:

### 1. Standard Profile (`backend/src/seed/fixtures/demo/standard/`)
- User profile: salary 60000, savings 18000 (round numbers)
- Added studielån account (~300k decreasing over 12 years)
- Added boligverdi account (~4M with small appreciation)
- 37 months snapshots (Dec 2022 - Dec 2025)
- Net worth growth: 1.8M (Dec 2022) → 6.1M (Dec 2025)
- Reflects market volatility with strong 2023-2024 recovery

### 2. Debt-Heavy Profile (`backend/src/seed/fixtures/demo/debt-heavy/`)
- User profile: salary 50000, savings 10000 (rounded)
- 37 months snapshots with high debt load
- Net worth progression: -4.7M (Dec 2022) → -4.0M (Dec 2025)
- Shows steady debt paydown despite challenging financial situation

### 3. F.I.R.E. Achieved Profile (`backend/src/seed/fixtures/demo/fire-achieved/`)
- User profile: salary 80000, savings 50000, fireNumber 10000000 (all round)
- 37 months snapshots with significant wealth accumulation
- Net worth progression: 6.6M (Dec 2022) → 23.4M (Dec 2025)
- Demonstrates high-savings lifestyle with strong market gains

## Market Movement Applied
- Dec 2022: Market bottom, depressed investment values
- 2023: Strong recovery (+25% YoY growth in aksjer/fond)
- 2024: Continued bull market (+26% YoY growth)
- 2025: Sustained growth (+17% YoY growth)
- Linear debt paydown in all profiles
- Moderate pension growth (3-5% yearly)
- Boligverdi appreciation (~2-3% yearly, standard profile only)

Build verified: ✓ No compilation errors
