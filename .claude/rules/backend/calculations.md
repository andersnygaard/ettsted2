---
paths:
  - backend/**/*
---

# Calculations Rules

## Stack
Pure TypeScript, no external math libs

## Structure
- `/services/calculatorService.ts` - Complex calculators (Monte Carlo, compound, FIRE, loan)
- `/services/calculationService.ts` - Simple derived values (net worth, coverage, savings rate)

## Formulas

### Monte Carlo
- Box-Muller transform for normal distribution
- Each sim: apply random return, withdraw, track balance
- Result: success rate, percentile bands (10/25/50/75/90), 100 sample scenarios

### Compound Interest
```
A = P(1 + r/n)^(nt) + PMT * (((1 + r/n)^(nt) - 1) / (r/n))
```
Returns yearly breakdown with interest/contributions.

### F.I.R.E.
- FIRE number = annual expenses × 25 (4% rule)
- Progress = current savings / FIRE number × 100
- Projection stops 10 years after reaching target

### Loan Amortization
Standard formula with extra payment support.
Safety limit: 2x total months to prevent infinite loops.

## Decisions
- All monetary values rounded to 2 decimals
- Monte Carlo capped at 10,000 simulations
- Percentages as whole numbers (7 not 0.07) in API input
- Services convert to decimals internally

## Gotchas
- Monte Carlo stores first 100 scenarios only (memory constraint)
- FIRE projection stops 10 years after FI reached
- Loan extra payments reduce principal, recalculate amortization
- Box-Muller returns two values, we use one
