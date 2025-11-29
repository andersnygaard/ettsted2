# FEATURE: Monte Carlo Simulator Page

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: Medium
**Labels**: page, calculators, frontend, backend
**Estimated Effort**: Complex - 5-6 hours

## Context & Motivation

Monte Carlo retirement simulator running thousands of scenarios to show probability of success for different retirement strategies.

## Reference

CLAUDE.md specification for Monte Carlo simulations

## Desired Outcome

Interactive Monte Carlo simulator with probability analysis.

## Acceptance Criteria

- [ ] Create `/frontend/src/features/calculators/MonteCarloPage.tsx`
- [ ] Add route `/kalkulatorer/monte-carlo`
- [ ] Inputs: portfolio value, annual withdrawal, years, expected return, volatility
- [ ] Run 1000+ simulations (backend or web worker)
- [ ] Show success probability percentage
- [ ] Percentile bands visualization (10th, 25th, 50th, 75th, 90th)
- [ ] Individual scenario paths (sample of 100)
- [ ] Sensitivity analysis for different withdrawal rates

## Technical Approach

```tsx
// MonteCarloPage.tsx
interface MonteCarloInputs {
  portfolioValue: number;
  annualWithdrawal: number;
  years: number;
  expectedReturn: number;
  volatility: number;
  simulations: number;
}

export function MonteCarloPage() {
  const [inputs, setInputs] = useState<MonteCarloInputs>({
    portfolioValue: 5000000,
    annualWithdrawal: 200000,
    years: 30,
    expectedReturn: 7,
    volatility: 15,
    simulations: 1000
  });

  const { mutate, data: result, isPending } = useMutation({
    mutationFn: runMonteCarloSimulation
  });

  return (
    <main className="calculator-page">
      <div className="container container--narrow">
        <PageHeader
          title="Monte Carlo"
          subtitle="Simuler tusenvis av scenarioer for å teste pensjonsplanen din"
        />

        <div className="calculator-layout">
          <Card className="calculator-inputs">
            <NumberInput label="Porteføljeverdi" value={inputs.portfolioValue} onChange={...} />
            <NumberInput label="Årlig uttak" value={inputs.annualWithdrawal} onChange={...} />
            <NumberInput label="Antall år" value={inputs.years} suffix="år" onChange={...} />
            <NumberInput label="Forventet avkastning" value={inputs.expectedReturn} suffix="%" onChange={...} />
            <NumberInput label="Volatilitet" value={inputs.volatility} suffix="%" onChange={...} />
            <Button onClick={() => mutate(inputs)} disabled={isPending}>
              {isPending ? 'Simulerer...' : 'Kjør simulering'}
            </Button>
          </Card>

          {result && (
            <Card className="calculator-results">
              <div className="success-rate">
                <div className="success-rate__value">{result.successRate}%</div>
                <div className="success-rate__label">Sannsynlighet for suksess</div>
              </div>
              <div className="percentiles">
                <div>10th: {formatCurrency(result.percentile10)}</div>
                <div>50th: {formatCurrency(result.percentile50)}</div>
                <div>90th: {formatCurrency(result.percentile90)}</div>
              </div>
            </Card>
          )}
        </div>

        {result && (
          <MonteCarloChart
            scenarios={result.scenarios}
            percentiles={result.percentileBands}
          />
        )}
      </div>
    </main>
  );
}
```

## Dependencies

- `044-FEATURE-number-input-component.md`
- `029-FEATURE-button-component.md`
- `064-FEATURE-monte-carlo-backend.md`

---

**Next Steps**: Implement after simpler calculators
