# FEATURE: Compound Interest Calculator Page

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: High
**Labels**: page, calculators, frontend
**Estimated Effort**: Medium - 3-4 hours

## Context & Motivation

Detailed compound interest calculator with inputs, result display, and growth chart visualization.

## Reference

CLAUDE.md specification for calculators

## Desired Outcome

Interactive compound interest calculator with Norwegian formatting.

## Acceptance Criteria

- [ ] Create `/frontend/src/features/calculators/CompoundCalculatorPage.tsx`
- [ ] Add route `/kalkulatorer/compound`
- [ ] Input form: initial amount, monthly deposit, interest rate, years
- [ ] Norwegian number formatting for all inputs
- [ ] Real-time calculation on input change
- [ ] Result display: final amount, total deposited, total interest earned
- [ ] Line chart showing growth over time
- [ ] Breakdown of contributions vs interest
- [ ] Share/export results (optional)

## Technical Approach

```tsx
// CompoundCalculatorPage.tsx
interface CompoundInputs {
  initialAmount: number;
  monthlyDeposit: number;
  annualRate: number;
  years: number;
}

export function CompoundCalculatorPage() {
  const [inputs, setInputs] = useState<CompoundInputs>({
    initialAmount: 0,
    monthlyDeposit: 5000,
    annualRate: 7,
    years: 10
  });

  const result = useMemo(() => calculateCompoundInterest(inputs), [inputs]);

  return (
    <main className="calculator-page">
      <div className="container container--narrow">
        <Breadcrumb items={[
          { label: 'Kalkulatorer', path: '/kalkulatorer' },
          { label: 'Renters rente' }
        ]} />

        <PageHeader
          title="Renters rente"
          subtitle="Se hvordan sparingen din vokser over tid"
        />

        <div className="calculator-layout">
          <Card className="calculator-inputs">
            <NumberInput
              label="Startbeløp"
              value={inputs.initialAmount}
              onChange={v => setInputs(p => ({ ...p, initialAmount: v || 0 }))}
            />
            <NumberInput
              label="Månedlig sparing"
              value={inputs.monthlyDeposit}
              onChange={v => setInputs(p => ({ ...p, monthlyDeposit: v || 0 }))}
            />
            <NumberInput
              label="Årlig avkastning (%)"
              value={inputs.annualRate}
              suffix="%"
              onChange={v => setInputs(p => ({ ...p, annualRate: v || 0 }))}
            />
            <NumberInput
              label="Antall år"
              value={inputs.years}
              suffix="år"
              onChange={v => setInputs(p => ({ ...p, years: v || 1 }))}
            />
          </Card>

          <Card className="calculator-results">
            <div className="result-hero">
              <div className="result-label">Sluttverdi</div>
              <div className="result-value">{formatCurrency(result.finalAmount)}</div>
            </div>
            <div className="result-breakdown">
              <div className="result-item">
                <span>Total innskudd</span>
                <span>{formatCurrency(result.totalDeposited)}</span>
              </div>
              <div className="result-item">
                <span>Renteinntekt</span>
                <span className="text-positive">{formatCurrency(result.totalInterest)}</span>
              </div>
            </div>
          </Card>
        </div>

        <AreaChart
          data={result.yearlyData}
          title="Vekst over tid"
          color="var(--muted-sage)"
        />
      </div>
    </main>
  );
}

function calculateCompoundInterest(inputs: CompoundInputs) {
  const { initialAmount, monthlyDeposit, annualRate, years } = inputs;
  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;

  let balance = initialAmount;
  const yearlyData: { year: number; value: number }[] = [];

  for (let month = 1; month <= months; month++) {
    balance = balance * (1 + monthlyRate) + monthlyDeposit;
    if (month % 12 === 0) {
      yearlyData.push({ year: month / 12, value: balance });
    }
  }

  const totalDeposited = initialAmount + monthlyDeposit * months;
  const totalInterest = balance - totalDeposited;

  return { finalAmount: balance, totalDeposited, totalInterest, yearlyData };
}
```

## Dependencies

- `028-FEATURE-breadcrumb-component.md`
- `027-FEATURE-page-header-component.md`
- `030-FEATURE-card-component.md`
- `044-FEATURE-number-input-component.md`
- `048-FEATURE-area-chart-component.md`

---

**Next Steps**: Implement after input components
