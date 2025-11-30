import { useState, useMemo } from 'react';
import { Breadcrumb, PageHeader, Card, NumberInput, StackedAreaChart } from '@/shared/components';
import type { StackedDataPoint } from '@/shared/components';
import { formatCurrency, formatNumber } from '@/shared/utils/numberFormat';
import './CompoundCalculatorPage.css'; // Reuse shared calculator styles

/**
 * LoanCalculatorPage Component
 *
 * Interactive loan calculator with amortization schedule visualization.
 * Shows monthly payments, total cost, and principal vs interest breakdown over time.
 *
 * Features:
 * - Input fields for loan amount, interest rate, and term in years
 * - Real-time calculation on input change
 * - Result display: monthly payment, total paid, total interest
 * - Stacked area chart showing principal vs interest over time
 *
 * Based on Nordic Minimal design system.
 */

interface LoanInputs {
  loanAmount: number;
  interestRate: number;
  termYears: number;
}

interface LoanResult {
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
  amortization: StackedDataPoint[];
}

/**
 * Calculate loan amortization using annuity formula
 *
 * Monthly payment formula:
 * P = L * [r(1+r)^n] / [(1+r)^n - 1]
 * where:
 * - L = loan amount
 * - r = monthly interest rate (annual rate / 12 / 100)
 * - n = number of payments (years * 12)
 */
function calculateLoan(inputs: LoanInputs): LoanResult {
  const { loanAmount, interestRate, termYears } = inputs;

  // Handle edge cases
  if (loanAmount <= 0 || termYears <= 0) {
    return {
      monthlyPayment: 0,
      totalPaid: 0,
      totalInterest: 0,
      amortization: [],
    };
  }

  const monthlyRate = interestRate / 100 / 12;
  const numPayments = termYears * 12;

  // Calculate monthly payment using annuity formula
  let monthlyPayment = 0;
  if (monthlyRate === 0) {
    // No interest - simple division
    monthlyPayment = loanAmount / numPayments;
  } else {
    // Standard annuity formula
    const factor = Math.pow(1 + monthlyRate, numPayments);
    monthlyPayment = (loanAmount * (monthlyRate * factor)) / (factor - 1);
  }

  const totalPaid = monthlyPayment * numPayments;
  const totalInterest = totalPaid - loanAmount;

  // Generate amortization schedule for chart (yearly data points)
  const amortization: StackedDataPoint[] = [];
  let remainingBalance = loanAmount;
  const startYear = new Date().getFullYear();

  // Add initial data point
  amortization.push({
    date: new Date(startYear, 0, 1),
    principal: 0,
    interest: 0,
  });

  // Calculate yearly totals
  for (let year = 1; year <= termYears; year++) {
    let yearlyPrincipal = 0;
    let yearlyInterest = 0;

    // Calculate 12 months of payments for this year
    for (let month = 0; month < 12; month++) {
      // Interest portion of this payment
      const interestPayment = remainingBalance * monthlyRate;

      // Principal portion of this payment
      const principalPayment = monthlyPayment - interestPayment;

      yearlyPrincipal += principalPayment;
      yearlyInterest += interestPayment;

      // Update remaining balance
      remainingBalance -= principalPayment;
    }

    // Ensure we don't go negative due to rounding
    remainingBalance = Math.max(0, remainingBalance);

    amortization.push({
      date: new Date(startYear + year, 0, 1),
      principal: yearlyPrincipal,
      interest: yearlyInterest,
    });
  }

  return {
    monthlyPayment,
    totalPaid,
    totalInterest,
    amortization,
  };
}

function LoanCalculatorPage() {
  const [inputs, setInputs] = useState<LoanInputs>({
    loanAmount: 3000000,
    interestRate: 4.5,
    termYears: 25,
  });

  const result = useMemo(() => calculateLoan(inputs), [inputs]);

  const updateInput = <K extends keyof LoanInputs>(
    key: K,
    value: number | undefined
  ) => {
    setInputs((prev) => ({
      ...prev,
      [key]: value ?? 0,
    }));
  };

  // Calculate interest as percentage of total paid
  const interestPercentage =
    result.totalPaid > 0
      ? ((result.totalInterest / result.totalPaid) * 100).toFixed(1)
      : '0';

  return (
    <main className="calculator-page">
      <div className="container container--narrow">
        <Breadcrumb
          items={[
            { label: 'Kalkulatorer', path: '/kalkulatorer' },
            { label: 'Lånekalkulator' },
          ]}
        />

        <PageHeader
          title="Lånekalkulator"
          subtitle="Beregn månedlige avdrag og total rentekostnad"
        />

        <div className="calculator-layout">
          <Card className="calculator-inputs animate-fade-up animate-delay-1">
            <NumberInput
              label="Lånebeløp"
              value={inputs.loanAmount}
              onChange={(v) => updateInput('loanAmount', v)}
              suffix="kr"
            />
            <NumberInput
              label="Årlig rente"
              value={inputs.interestRate}
              onChange={(v) => updateInput('interestRate', v)}
              suffix="%"
            />
            <NumberInput
              label="Nedbetalingstid"
              value={inputs.termYears}
              onChange={(v) => updateInput('termYears', v)}
              suffix="år"
            />
          </Card>

          <Card className="calculator-results animate-fade-up animate-delay-2">
            <div className="result-hero">
              <div className="result-label">Månedlig betaling</div>
              <div className="result-value">{formatCurrency(result.monthlyPayment)}</div>
            </div>
            <div className="result-breakdown">
              <div className="result-item">
                <span className="result-item__label">Total betalt</span>
                <span className="result-item__value">{formatCurrency(result.totalPaid)}</span>
              </div>
              <div className="result-item">
                <span className="result-item__label">Total rente</span>
                <span className="result-item__value text-negative">
                  +{formatCurrency(result.totalInterest)}
                </span>
              </div>
              <div className="result-item">
                <span className="result-item__label">Rente av total</span>
                <span className="result-item__value text-negative">
                  {interestPercentage}%
                </span>
              </div>
            </div>
          </Card>
        </div>

        <div className="animate-fade-up animate-delay-3">
          <StackedAreaChart
            data={result.amortization}
            series={[
              { key: 'principal', color: 'var(--muted-sage)', label: 'Avdrag' },
              { key: 'interest', color: 'var(--soft-terracotta)', label: 'Rente' },
            ]}
            title="Avdragsprofil over tid"
            height={240}
            xAxisFormat={(date) => {
              const year = date.getFullYear();
              const current = new Date().getFullYear();
              if (year === current) return 'År 0';
              const yearOffset = year - current;
              return `År ${yearOffset}`;
            }}
          />
        </div>

        <div className="calculator-info animate-fade-up animate-delay-4">
          <h3>Slik fungerer lånekalkulator</h3>
          <p>
            Lånekalkulator hjelper deg med å forstå kostnadene ved lån. Den viser hvor
            mye du betaler hver måned, hvor mye av det som går til rente versus avdrag,
            og total kostnad over lånets løpetid.
          </p>
          <p>
            Med et lånebeløp på {formatCurrency(inputs.loanAmount)} og{' '}
            {formatNumber(inputs.interestRate, 2)}% rente betaler du{' '}
            {formatCurrency(result.monthlyPayment)} hver måned i {inputs.termYears} år.
            Total rentekostnad blir {formatCurrency(result.totalInterest)}.
          </p>
        </div>
      </div>
    </main>
  );
}

export default LoanCalculatorPage;
