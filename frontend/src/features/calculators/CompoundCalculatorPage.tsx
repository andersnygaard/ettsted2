import { useState, useMemo, useEffect } from 'react';
import { Breadcrumb, PageHeader, Card, NumberInput, StackedAreaChart } from '@/shared/components';
import type { StackedDataPoint, Series } from '@/shared/components';
import { formatCurrency, formatNumber } from '@/shared/utils/numberFormat';
import { useSparingData } from '@/features/sparing/useSparingData';
import { useUser } from '@/shared/hooks/useUser';
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
  yearlyData: StackedDataPoint[];
}

/**
 * Calculate compound interest with monthly contributions
 * Returns stacked data with deposits and interest breakdown per year
 */
function calculateCompoundInterest(inputs: CompoundInputs): CompoundResult {
  const { initialAmount, monthlyDeposit, annualRate, years } = inputs;
  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;

  let balance = initialAmount;
  let totalDeposits = initialAmount;
  const yearlyData: StackedDataPoint[] = [];

  // Add initial data point
  const startYear = new Date().getFullYear();
  yearlyData.push({
    date: new Date(startYear, 0, 1),
    deposits: initialAmount,
    interest: 0,
  });

  for (let month = 1; month <= months; month++) {
    balance = balance * (1 + monthlyRate) + monthlyDeposit;
    totalDeposits += monthlyDeposit;

    if (month % 12 === 0) {
      const interest = balance - totalDeposits;
      yearlyData.push({
        date: new Date(startYear + month / 12, 0, 1),
        deposits: totalDeposits,
        interest: Math.max(0, interest),
      });
    }
  }

  const totalDeposited = initialAmount + monthlyDeposit * months;
  const totalInterest = balance - totalDeposited;

  return { finalAmount: balance, totalDeposited, totalInterest, yearlyData };
}

function CompoundCalculatorPage() {
  const { data: sparingData } = useSparingData();
  const { data: user } = useUser();

  const [inputs, setInputs] = useState<CompoundInputs>({
    initialAmount: 0,
    monthlyDeposit: 0,
    annualRate: 7,
    years: 10,
  });

  // Set defaults from user profile and portfolio data when loaded
  useEffect(() => {
    const updates: Partial<CompoundInputs> = {};

    // Set initial amount from sum sparing (0 if no portfolio data)
    if (sparingData && inputs.initialAmount === 0) {
      updates.initialAmount = sparingData.sumSparing ?? 0;
    }

    // Set monthly deposit from user profile, fallback to 5000
    if (inputs.monthlyDeposit === 0) {
      updates.monthlyDeposit = user?.profile?.monthlySavings || 5000;
    }

    if (Object.keys(updates).length > 0) {
      setInputs((prev) => ({ ...prev, ...updates }));
    }
  }, [sparingData?.sumSparing, user?.profile?.monthlySavings]);

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

  // Chart series configuration
  const chartSeries: Series[] = [
    { key: 'deposits', color: 'var(--pale-blue)', label: 'Innskudd' },
    { key: 'interest', color: 'var(--muted-sage)', label: 'Avkastning' },
  ];

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
            <div className="slider-input">
              <div className="slider-input__header">
                <span className="slider-input__label">Årlig avkastning</span>
                <span className="slider-input__value">{formatNumber(inputs.annualRate, 1)}%</span>
              </div>
              <input
                type="range"
                className="slider-input__track"
                min={2}
                max={20}
                step={0.1}
                value={inputs.annualRate}
                onChange={(e) => updateInput('annualRate', parseFloat(e.target.value))}
              />
              <div className="slider-input__range">
                <span>2%</span>
                <span>20%</span>
              </div>
            </div>
            <div className="slider-input">
              <div className="slider-input__header">
                <span className="slider-input__label">Antall år</span>
                <span className="slider-input__value">{inputs.years} år</span>
              </div>
              <input
                type="range"
                className="slider-input__track"
                min={1}
                max={30}
                step={1}
                value={inputs.years}
                onChange={(e) => updateInput('years', parseInt(e.target.value, 10))}
              />
              <div className="slider-input__range">
                <span>1 år</span>
                <span>30 år</span>
              </div>
            </div>
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
          <StackedAreaChart
            data={result.yearlyData}
            series={chartSeries}
            title="Vekst over tid"
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
