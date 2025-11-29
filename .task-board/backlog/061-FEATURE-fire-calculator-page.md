# FEATURE: F.I.R.E. Calculator Page

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: High
**Labels**: page, calculators, frontend
**Estimated Effort**: Medium - 3-4 hours

## Context & Motivation

F.I.R.E. calculator to determine time to financial independence based on current savings, income, expenses, and expected returns.

## Reference

CLAUDE.md specification for F.I.R.E. planning

## Desired Outcome

Interactive F.I.R.E. calculator with projections.

## Acceptance Criteria

- [ ] Create `/frontend/src/features/calculators/FireCalculatorPage.tsx`
- [ ] Add route `/kalkulatorer/fire`
- [ ] Inputs: current savings, annual income, annual expenses, expected return rate
- [ ] Calculate: F.I.R.E. number (25x expenses), years to FI, earliest retirement age
- [ ] Show progress visualization
- [ ] Timeline chart showing projected wealth growth
- [ ] Different F.I.R.E. scenarios (Lean, Regular, Fat)

## Technical Approach

```tsx
// FireCalculatorPage.tsx
interface FireInputs {
  currentSavings: number;
  annualIncome: number;
  annualExpenses: number;
  currentAge: number;
  expectedReturn: number;
}

export function FireCalculatorPage() {
  const [inputs, setInputs] = useState<FireInputs>({
    currentSavings: 500000,
    annualIncome: 800000,
    annualExpenses: 500000,
    currentAge: 35,
    expectedReturn: 7
  });

  const result = useMemo(() => calculateFire(inputs), [inputs]);

  return (
    <main className="calculator-page">
      <div className="container container--narrow">
        <Breadcrumb items={[
          { label: 'Kalkulatorer', path: '/kalkulatorer' },
          { label: 'F.I.R.E. kalkulator' }
        ]} />

        <PageHeader
          title="F.I.R.E. kalkulator"
          subtitle="Beregn din vei til økonomisk uavhengighet"
        />

        <div className="calculator-layout">
          <Card className="calculator-inputs">
            <NumberInput label="Nåværende sparing" value={inputs.currentSavings} onChange={...} />
            <NumberInput label="Årlig inntekt" value={inputs.annualIncome} onChange={...} />
            <NumberInput label="Årlige utgifter" value={inputs.annualExpenses} onChange={...} />
            <NumberInput label="Din alder" value={inputs.currentAge} suffix="år" onChange={...} />
            <NumberInput label="Forventet avkastning" value={inputs.expectedReturn} suffix="%" onChange={...} />
          </Card>

          <Card className="calculator-results">
            <div className="fire-results">
              <div className="fire-result">
                <div className="fire-result__value">{formatCurrency(result.fireNumber)}</div>
                <div className="fire-result__label">F.I.R.E. tall (25x utgifter)</div>
              </div>
              <div className="fire-result">
                <div className="fire-result__value">{result.yearsToFire.toFixed(1)} år</div>
                <div className="fire-result__label">Tid til F.I.R.E.</div>
              </div>
              <div className="fire-result">
                <div className="fire-result__value">{result.fireAge} år</div>
                <div className="fire-result__label">Pensjonsalder</div>
              </div>
              <div className="fire-result">
                <div className="fire-result__value">{(result.savingsRate * 100).toFixed(0)}%</div>
                <div className="fire-result__label">Sparerate</div>
              </div>
            </div>
          </Card>
        </div>

        <AreaChart data={result.projection} title="Projeksjon mot F.I.R.E." />
      </div>
    </main>
  );
}
```

## Dependencies

- `028-FEATURE-breadcrumb-component.md`
- `044-FEATURE-number-input-component.md`
- `048-FEATURE-area-chart-component.md`

---

**Next Steps**: Implement after compound calculator
