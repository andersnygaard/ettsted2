# Advanced Monte Carlo Simulation

## Problem
Current Monte Carlo uses a single "expected return" input. More sophisticated users want to separate nominal return from inflation to see real (inflation-adjusted) results.

## Current vs Advanced

### Current (Simple)
- Input: Expected return (7%)
- Output: Nominal future value

### Advanced
- Input: Expected nominal return (7%)
- Input: Expected inflation (2%)
- Output: Real (inflation-adjusted) future value
- Derived: Real return = nominal - inflation (≈5%)

## Why This Matters
- Nominal values can be misleading over long time horizons
- 1M kr in 30 years is worth much less in today's money
- Users planning for retirement need to think in real terms
- Helps answer: "What will my money actually buy?"

## Requirements

### Tabs at top: "Enkel" | "Avansert"
Location: Kalkulatorer → Monte Carlo

```
┌──────────┬────────────┐
│  Enkel   │  Avansert  │  ← Top tabs
└──────────┴────────────┘
```

- **Enkel**: Current behavior (single return input)
- **Avansert**: Separate nominal return and inflation inputs

### Additional inputs
- `expectedReturn`: Nominal return % (default: 7%)
- `expectedInflation`: Inflation % (default: 2%)

### Additional outputs
- `realFinalValue`: Inflation-adjusted final value
- `purchasingPower`: What the money is worth in today's terms
- Both nominal and real percentiles in results

### Chart visualization
Option to toggle between:
- Nominal values (current)
- Real (inflation-adjusted) values

## Implementation

### Real value calculation
```typescript
// Each year, discount by inflation
const realValue = nominalValue / Math.pow(1 + inflation, years);

// Or use real return directly
const realReturn = nominalReturn - inflation; // Approximate
const realReturn = (1 + nominalReturn) / (1 + inflation) - 1; // Exact
```

### API extension
`POST /api/v1/kalkulatorer/monte-carlo`

Add optional fields:
```json
{
  "portfolioValue": 1000000,
  "annualWithdrawal": 40000,
  "years": 30,
  "expectedReturn": 7,
  "volatility": 15,
  "inflation": 2,        // NEW: optional
  "showRealValues": true // NEW: optional
}
```

## Files to Update
- `backend/src/controllers/calculatorController.ts` - add inflation handling
- `backend/src/validators/schemas.ts` - add inflation field
- `frontend/src/features/calculators/MonteCarloCalculator.tsx` - add advanced mode/tab

## Acceptance Criteria
- [x] Can input expected inflation separately from return
- [x] Results show both nominal and real values
- [x] Chart can toggle between nominal/real view
- [x] Default inflation is 2%
- [x] Backward compatible (inflation optional)
