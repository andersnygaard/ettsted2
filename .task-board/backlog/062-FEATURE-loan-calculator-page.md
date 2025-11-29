# FEATURE: Loan Calculator Page

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: Medium
**Labels**: page, calculators, frontend
**Estimated Effort**: Medium - 2-3 hours

## Context & Motivation

Loan calculator for mortgage/loan planning, showing monthly payments, total cost, and amortization schedule.

## Reference

CLAUDE.md specification for calculators

## Desired Outcome

Interactive loan calculator with amortization details.

## Acceptance Criteria

- [ ] Create `/frontend/src/features/calculators/LoanCalculatorPage.tsx`
- [ ] Add route `/kalkulatorer/loan`
- [ ] Inputs: loan amount, interest rate, loan term (years)
- [ ] Calculate: monthly payment, total paid, total interest
- [ ] Show amortization schedule table
- [ ] Chart showing principal vs interest over time
- [ ] Extra payment scenario (optional)

## Technical Approach

```tsx
// LoanCalculatorPage.tsx
interface LoanInputs {
  loanAmount: number;
  interestRate: number;
  termYears: number;
}

export function LoanCalculatorPage() {
  const [inputs, setInputs] = useState<LoanInputs>({
    loanAmount: 3000000,
    interestRate: 4.5,
    termYears: 25
  });

  const result = useMemo(() => calculateLoan(inputs), [inputs]);

  return (
    <main className="calculator-page">
      <div className="container container--narrow">
        <PageHeader title="Lånekalkulator" subtitle="Beregn månedlige avdrag og total rentekostnad" />

        <div className="calculator-layout">
          <Card className="calculator-inputs">
            <NumberInput label="Lånebeløp" value={inputs.loanAmount} onChange={...} />
            <NumberInput label="Rente (%)" value={inputs.interestRate} suffix="%" onChange={...} />
            <NumberInput label="Nedbetalingstid" value={inputs.termYears} suffix="år" onChange={...} />
          </Card>

          <Card className="calculator-results">
            <div className="result-hero">
              <div className="result-label">Månedlig betaling</div>
              <div className="result-value">{formatCurrency(result.monthlyPayment)}</div>
            </div>
            <div className="result-breakdown">
              <div className="result-item">
                <span>Total betalt</span>
                <span>{formatCurrency(result.totalPaid)}</span>
              </div>
              <div className="result-item">
                <span>Total rente</span>
                <span className="text-negative">{formatCurrency(result.totalInterest)}</span>
              </div>
            </div>
          </Card>
        </div>

        <StackedAreaChart
          data={result.amortization}
          series={[
            { key: 'principal', color: 'var(--muted-sage)', label: 'Avdrag' },
            { key: 'interest', color: 'var(--soft-terracotta)', label: 'Rente' }
          ]}
          title="Avdragsprofil"
        />
      </div>
    </main>
  );
}
```

## Dependencies

- `044-FEATURE-number-input-component.md`
- `056-FEATURE-stacked-area-chart.md`

---

**Next Steps**: Implement after F.I.R.E. calculator
