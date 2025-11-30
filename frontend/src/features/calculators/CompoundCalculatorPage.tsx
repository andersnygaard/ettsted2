import { useState, useMemo } from 'react';
import { Breadcrumb, PageHeader, Card, NumberInput, AreaChart } from '@/shared/components';
import type { DataPoint } from '@/shared/components';
import { formatCurrency, formatNumber } from '@/shared/utils/numberFormat';
import './CompoundCalculatorPage.css';

/**
 * CompoundCalculatorPage Component
 *
 * Interactive compound interest calculator with Norwegian formatting.
 * Shows how savings grow over time with compound interest.
 *
 * Features:
 * - Input fields for initial amount, monthly deposit, interest rate, years
 * - Real-time calculation on input change
 * - Result display: final amount, total deposited, total interest
 * - Area chart showing growth over time
 *
 * Based on Nordic Minimal design system.
 */

interface CompoundInputs {
  initialAmount: number;
  monthlyDeposit: number;
  annualRate: number;
  years: number;
}

interface CompoundResult {
  finalAmount: number;
  totalDeposited: number;
  totalInterest: number;
  yearlyData: DataPoint[];
}

/**
 * Calculate compound interest with monthly contributions
 */
function calculateCompoundInterest(inputs: CompoundInputs): CompoundResult {
  const { initialAmount, monthlyDeposit, annualRate, years } = inputs;
  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;

  let balance = initialAmount;
  const yearlyData: DataPoint[] = [];

  // Add initial data point
  const startYear = new Date().getFullYear();
  yearlyData.push({ date: new Date(startYear, 0, 1), value: balance });

  for (let month = 1; month <= months; month++) {
    balance = balance * (1 + monthlyRate) + monthlyDeposit;
    if (month % 12 === 0) {
      yearlyData.push({
        date: new Date(startYear + month / 12, 0, 1),
        value: balance,
      });
    }
  }

  const totalDeposited = initialAmount + monthlyDeposit * months;
  const totalInterest = balance - totalDeposited;

  return { finalAmount: balance, totalDeposited, totalInterest, yearlyData };
}

function CompoundCalculatorPage() {
  const [inputs, setInputs] = useState<CompoundInputs>({
    initialAmount: 0,
    monthlyDeposit: 5000,
    annualRate: 7,
    years: 10,
  });

  const result = useMemo(() => calculateCompoundInterest(inputs), [inputs]);

  const updateInput = <K extends keyof CompoundInputs>(
    key: K,
    value: number | undefined
  ) => {
    setInputs((prev) => ({
      ...prev,
      [key]: value ?? 0,
    }));
  };

  // Calculate interest as percentage of final amount
  const interestPercentage = result.finalAmount > 0
    ? ((result.totalInterest / result.finalAmount) * 100).toFixed(1)
    : '0';

  return (
    <main className="calculator-page">
      <div className="container container--narrow">
        <Breadcrumb
          items={[
            { label: 'Kalkulatorer', path: '/kalkulatorer' },
            { label: 'Renters rente' },
          ]}
        />

        <PageHeader
          title="Renters rente"
          subtitle="Se hvordan sparingen din vokser over tid"
        />

        <div className="calculator-layout">
          <Card className="calculator-inputs animate-fade-up animate-delay-1">
            <NumberInput
              label="Startbeløp"
              value={inputs.initialAmount}
              onChange={(v) => updateInput('initialAmount', v)}
              suffix="kr"
            />
            <NumberInput
              label="Månedlig sparing"
              value={inputs.monthlyDeposit}
              onChange={(v) => updateInput('monthlyDeposit', v)}
              suffix="kr"
            />
            <NumberInput
              label="Årlig avkastning"
              value={inputs.annualRate}
              onChange={(v) => updateInput('annualRate', v)}
              suffix="%"
            />
            <NumberInput
              label="Antall år"
              value={inputs.years}
              onChange={(v) => updateInput('years', v)}
              suffix="år"
            />
          </Card>

          <Card className="calculator-results animate-fade-up animate-delay-2">
            <div className="result-hero">
              <div className="result-label">Sluttverdi</div>
              <div className="result-value">{formatCurrency(result.finalAmount)}</div>
            </div>
            <div className="result-breakdown">
              <div className="result-item">
                <span className="result-item__label">Total innskudd</span>
                <span className="result-item__value">{formatCurrency(result.totalDeposited)}</span>
              </div>
              <div className="result-item">
                <span className="result-item__label">Renteinntekt</span>
                <span className="result-item__value text-positive">
                  +{formatCurrency(result.totalInterest)}
                </span>
              </div>
              <div className="result-item">
                <span className="result-item__label">Avkastning av total</span>
                <span className="result-item__value text-positive">
                  {interestPercentage}%
                </span>
              </div>
            </div>
          </Card>
        </div>

        <div className="animate-fade-up animate-delay-3">
          <AreaChart
            data={result.yearlyData}
            title="Vekst over tid"
            color="var(--muted-sage)"
            height={240}
            xAxisFormat={(date) => {
              const year = date.getFullYear();
              const current = new Date().getFullYear();
              if (year === current) return 'Nå';
              return `${year - current} år`;
            }}
          />
        </div>

        <div className="calculator-info animate-fade-up animate-delay-4">
          <h3>Slik fungerer renters rente</h3>
          <p>
            Renters rente (compound interest) betyr at du tjener renter på både det
            opprinnelige beløpet og på rentene du allerede har tjent. Over tid kan
            dette gi en eksponentiell vekst i sparingen din.
          </p>
          <p>
            Med en månedlig sparing på {formatNumber(inputs.monthlyDeposit, 0)} kr
            og {formatNumber(inputs.annualRate, 1)}% årlig avkastning, vil du etter{' '}
            {inputs.years} år ha {formatCurrency(result.finalAmount)} totalt.
          </p>
        </div>
      </div>
    </main>
  );
}

export default CompoundCalculatorPage;
