# Design: Mobile-First Calculator Pages

**Status**: Backlog
**Created**: 2025-12-08
**Priority**: Medium
**Labels**: frontend, design, mobile, calculators
**Estimated Effort**: Medium - 3-4 hours

## Context & Motivation

Calculator pages have complex two-column layouts (inputs + results) that need to stack on mobile. Formula displays, slider inputs, and result grids all need mobile optimization.

## Current State

### CalculatorsPage
- 2x2 grid of calculator cards - collapses to 1 column (good)
- Uses `max-width` (desktop-first)

### Calculator Detail Pages (Compound, FIRE, Loan, Monte Carlo)
- Two-column layout: inputs left, results right
- Stacks on mobile but spacing/padding issues remain
- Result values can overflow on small screens
- FIRE formula calculation wraps awkwardly
- Slider inputs work but could be larger touch targets
- Monte Carlo chart needs responsive sizing

## Desired Outcome

- All calculator pages use mobile-first CSS
- Input/result columns stack naturally on mobile
- Result values scale or wrap gracefully
- FIRE formula readable on mobile (may need different layout)
- Slider touch targets 44px minimum
- Charts responsive and readable on mobile

## Acceptance Criteria

- [ ] Refactor CalculatorsPage.css to mobile-first
- [ ] Refactor CompoundCalculatorPage.css to mobile-first
- [ ] Refactor LoanCalculatorPage.css to mobile-first
- [ ] Result values use responsive font sizing
- [ ] FIRE formula wraps or stacks on mobile
- [ ] Slider thumb touch targets 44px minimum
- [ ] Monte Carlo chart readable on mobile
- [ ] Works on 320px width screens

## Affected Components

### Frontend
- **Files**:
  - `frontend/src/features/calculators/CalculatorsPage.css`
  - `frontend/src/features/calculators/CompoundCalculatorPage.css`
  - `frontend/src/features/calculators/LoanCalculatorPage.css`
  - `frontend/src/features/calculators/MonteCarloChart.css`

### Components
- `components/src/cards/CalculatorCard/CalculatorCard.css`

## Technical Approach

### Implementation Steps

1. **Calculator grid mobile-first**:
   ```css
   /* BASE: Mobile */
   .calc-grid {
     grid-template-columns: 1fr;
     gap: var(--space-md);
   }

   /* TABLET+ */
   @media (min-width: 768px) {
     .calc-grid {
       grid-template-columns: repeat(2, 1fr);
       gap: 20px;
     }
   }
   ```

2. **Calculator layout mobile-first**:
   ```css
   /* BASE: Mobile - Stack */
   .calculator-layout {
     grid-template-columns: 1fr;
     gap: var(--space-lg);
   }

   .calculator-inputs,
   .calculator-results {
     padding: var(--space-lg);
   }

   .result-value {
     font-size: 28px;
     word-break: break-word;
   }

   /* TABLET+ */
   @media (min-width: 768px) {
     .calculator-layout {
       grid-template-columns: 1fr 1fr;
       gap: 24px;
     }
     .calculator-inputs,
     .calculator-results {
       padding: 32px;
     }
     .result-value {
       font-size: 42px;
       white-space: nowrap;
     }
   }
   ```

3. **FIRE formula mobile layout**:
   ```css
   /* BASE: Mobile - Stack formula vertically */
   .fire-formula__calculation {
     flex-direction: column;
     gap: var(--space-xs);
     font-size: 14px;
   }

   .fire-formula__operator {
     display: none;  /* Hide × and = on mobile */
   }

   /* TABLET+ */
   @media (min-width: 768px) {
     .fire-formula__calculation {
       flex-direction: row;
       gap: 12px;
       font-size: 16px;
     }
     .fire-formula__operator {
       display: inline;
     }
   }
   ```

4. **Slider touch targets**:
   ```css
   .slider-input__track::-webkit-slider-thumb {
     width: 28px;
     height: 28px;
   }

   @media (min-width: 768px) {
     .slider-input__track::-webkit-slider-thumb {
       width: 20px;
       height: 20px;
     }
   }
   ```

5. **Loan type tabs mobile**:
   ```css
   /* BASE: Mobile - Full width tabs */
   .loan-type-selector {
     width: 100%;
   }

   .loan-type-tab {
     flex: 1;
     padding: var(--space-sm) var(--space-md);
     font-size: 13px;
   }

   /* TABLET+ */
   @media (min-width: 768px) {
     .loan-type-selector {
       width: fit-content;
     }
     .loan-type-tab {
       flex: none;
       padding: 12px 24px;
       font-size: 14px;
     }
   }
   ```

### Dependencies

- 238-DESIGN-mobile-first-refactor-foundation

### Risks & Considerations

- **Risk**: FIRE formula vertical layout might look odd
- **Mitigation**: Alternative - use smaller font and keep horizontal, test both
- **Risk**: Monte Carlo chart might be too detailed for mobile
- **Mitigation**: Consider simplified view or horizontal scroll

## Code References

### Current Pattern
```css
/* CompoundCalculatorPage.css:25-35 - Desktop-first */
@media (max-width: var(--bp-md)) {
  .calculator-layout {
    grid-template-columns: 1fr;
  }
}

/* CompoundCalculatorPage.css:332-345 - Desktop-first */
@media (max-width: var(--bp-sm)) {
  .fire-results {
    grid-template-columns: 1fr;
  }
}
```

---

**Next Steps**: Ready for implementation after 238 foundation task.
