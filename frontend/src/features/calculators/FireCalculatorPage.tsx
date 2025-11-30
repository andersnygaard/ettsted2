import { useState, useMemo } from 'react';
import { Breadcrumb, PageHeader, Card, NumberInput, AreaChart, ProgressBar } from '@/shared/components';
import type { DataPoint } from '@/shared/components';
import { formatCurrency, formatNumber } from '@/shared/utils/numberFormat';
import './CompoundCalculatorPage.css'; // Reuse shared calculator styles

/**
 * FireCalculatorPage Component
 *
 * F.I.R.E. (Financial Independence, Retire Early) calculator.
 * Calculates time to financial independence based on savings, income, expenses, and returns.
 *
 * Features:
 * - Input fields for current savings, income, expenses, age, return rate
 * - Calculate F.I.R.E. number (25x annual expenses)
 * - Years to F.I.R.E. and retirement age
 * - Savings rate calculation
 * - Progress visualization
 * - Projection chart
 *
 * Based on Nordic Minimal design system.
 */

interface FireInputs {
  currentSavings: number;
  annualIncome: number;
  annualExpenses: number;
  currentAge: number;
  expectedReturn: number;
}

interface FireResult {
  fireNumber: number;
  yearsToFire: number;
  fireAge: number;
  savingsRate: number;
  currentProgress: number;
  annualSavings: number;
  projection: DataPoint[];
}

/**
 * Calculate F.I.R.E. metrics
 */
function calculateFire(inputs: FireInputs): FireResult {
  const { currentSavings, annualIncome, annualExpenses, currentAge, expectedReturn } = inputs;

  // F.I.R.E. number is 25x annual expenses (4% withdrawal rule)
  const fireNumber = annualExpenses * 25;

  // Annual savings
  const annualSavings = annualIncome - annualExpenses;

  // Savings rate
  const savingsRate = annualIncome > 0 ? annualSavings / annualIncome : 0;

  // Current progress towards F.I.R.E.
  const currentProgress = fireNumber > 0 ? (currentSavings / fireNumber) * 100 : 0;

  // Calculate years to F.I.R.E. using compound growth formula
  // FV = PV * (1 + r)^n + PMT * (((1 + r)^n - 1) / r)
  // Solving for n when FV = fireNumber
  const rate = expectedReturn / 100;
  let yearsToFire = 0;

  if (currentSavings >= fireNumber) {
    yearsToFire = 0;
  } else if (annualSavings <= 0 && rate <= 0) {
    yearsToFire = Infinity;
  } else {
    // Iterate to find years to F.I.R.E.
    let balance = currentSavings;
    const maxYears = 100;

    for (let year = 1; year <= maxYears; year++) {
      balance = balance * (1 + rate) + annualSavings;
      if (balance >= fireNumber) {
        // Interpolate for partial year
        const prevBalance = (balance - annualSavings) / (1 + rate);
        const needed = fireNumber - prevBalance;
        const gained = balance - prevBalance;
        const fraction = gained > 0 ? needed / gained : 1;
        yearsToFire = year - 1 + fraction;
        break;
      }
      if (year === maxYears) {
        yearsToFire = maxYears;
      }
    }
  }

  const fireAge = currentAge + yearsToFire;

  // Generate projection data
  const projection: DataPoint[] = [];
  const startYear = new Date().getFullYear();
  let balance = currentSavings;

  projection.push({ date: new Date(startYear, 0, 1), value: balance });

  const projectionYears = Math.min(Math.ceil(yearsToFire) + 5, 50);
  for (let year = 1; year <= projectionYears; year++) {
    balance = balance * (1 + rate) + annualSavings;
    projection.push({ date: new Date(startYear + year, 0, 1), value: balance });
  }

  return {
    fireNumber,
    yearsToFire: Math.min(yearsToFire, 100),
    fireAge: Math.min(fireAge, currentAge + 100),
    savingsRate,
    currentProgress: Math.min(currentProgress, 100),
    annualSavings,
    projection,
  };
}

function FireCalculatorPage() {
  const [inputs, setInputs] = useState<FireInputs>({
    currentSavings: 500000,
    annualIncome: 800000,
    annualExpenses: 500000,
    currentAge: 35,
    expectedReturn: 7,
  });

  const result = useMemo(() => calculateFire(inputs), [inputs]);

  const updateInput = <K extends keyof FireInputs>(
    key: K,
    value: number | undefined
  ) => {
    setInputs((prev) => ({
      ...prev,
      [key]: value ?? 0,
    }));
  };

  const formatYears = (years: number): string => {
    if (years >= 100 || !isFinite(years)) return '100+ år';
    if (years < 1) return 'Allerede oppnådd!';
    return `${formatNumber(years, 1)} år`;
  };

  const formatAge = (age: number): string => {
    if (age >= 135 || !isFinite(age)) return '100+';
    return `${Math.round(age)}`;
  };

  return (
    <main className="calculator-page">
      <div className="container container--narrow">
        <Breadcrumb
          items={[
            { label: 'Kalkulatorer', path: '/kalkulatorer' },
            { label: 'F.I.R.E. kalkulator' },
          ]}
        />

        <PageHeader
          title="F.I.R.E. kalkulator"
          subtitle="Beregn din vei til økonomisk uavhengighet"
        />

        <div className="calculator-layout">
          <Card className="calculator-inputs animate-fade-up animate-delay-1">
            <NumberInput
              label="Nåværende sparing"
              value={inputs.currentSavings}
              onChange={(v) => updateInput('currentSavings', v)}
              suffix="kr"
            />
            <NumberInput
              label="Årlig inntekt"
              value={inputs.annualIncome}
              onChange={(v) => updateInput('annualIncome', v)}
              suffix="kr"
            />
            <NumberInput
              label="Årlige utgifter"
              value={inputs.annualExpenses}
              onChange={(v) => updateInput('annualExpenses', v)}
              suffix="kr"
            />
            <NumberInput
              label="Din alder"
              value={inputs.currentAge}
              onChange={(v) => updateInput('currentAge', v)}
              suffix="år"
            />
            <NumberInput
              label="Forventet avkastning"
              value={inputs.expectedReturn}
              onChange={(v) => updateInput('expectedReturn', v)}
              suffix="%"
            />
          </Card>

          <Card className="calculator-results animate-fade-up animate-delay-2">
            <div className="fire-results">
              <div className="fire-result">
                <div className="fire-result__value">{formatCurrency(result.fireNumber)}</div>
                <div className="fire-result__label">F.I.R.E. tall (25x utgifter)</div>
              </div>
              <div className="fire-result">
                <div className="fire-result__value">{formatYears(result.yearsToFire)}</div>
                <div className="fire-result__label">Tid til F.I.R.E.</div>
              </div>
              <div className="fire-result">
                <div className="fire-result__value">{formatAge(result.fireAge)} år</div>
                <div className="fire-result__label">Pensjonsalder</div>
              </div>
              <div className="fire-result">
                <div className="fire-result__value">{(result.savingsRate * 100).toFixed(0)}%</div>
                <div className="fire-result__label">Sparerate</div>
              </div>
            </div>

            <div className="fire-progress">
              <div className="fire-progress__header">
                <span>Fremgang mot F.I.R.E.</span>
                <span>{result.currentProgress.toFixed(1)}%</span>
              </div>
              <ProgressBar
                value={result.currentProgress}
                variant="default"
                height={12}
              />
            </div>
          </Card>
        </div>

        <div className="animate-fade-up animate-delay-3">
          <AreaChart
            data={result.projection}
            title="Projeksjon mot F.I.R.E."
            subtitle={`Mål: ${formatCurrency(result.fireNumber)}`}
            color="var(--muted-sage)"
            height={240}
            xAxisFormat={(date) => date.getFullYear().toString()}
          />
        </div>

        <div className="calculator-info animate-fade-up animate-delay-4">
          <h3>Hva er F.I.R.E.?</h3>
          <p>
            F.I.R.E. (Financial Independence, Retire Early) handler om å spare nok
            til å leve av avkastningen. Med 4%-regelen trenger du 25 ganger dine
            årlige utgifter for å være økonomisk uavhengig.
          </p>
          <p>
            Med en sparerate på {(result.savingsRate * 100).toFixed(0)}% og{' '}
            {formatCurrency(result.annualSavings)} i årlig sparing, kan du nå
            F.I.R.E. om {formatYears(result.yearsToFire)}.
          </p>
        </div>
      </div>
    </main>
  );
}

export default FireCalculatorPage;
