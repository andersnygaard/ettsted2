import { useState, useMemo } from 'react';
import { Breadcrumb, PageHeader, Card, NumberInput, StackedAreaChart } from '@/shared/components';
import type { StackedDataPoint } from '@/shared/components';
import { formatCurrency, formatNumber } from '@/shared/utils/numberFormat';
import './CompoundCalculatorPage.css'; // Reuse shared calculator styles
import './LoanCalculatorPage.css';

/**
 * LoanCalculatorPage Component
 *
 * Interactive loan calculator with amortization schedule visualization.
 * Supports both annuity loans (fixed payment) and serial loans (fixed principal).
 *
 * Features:
 * - Loan type selector (tabs) for annuity vs serial loans
 * - Input fields for loan amount, interest rate, and term in years
 * - Real-time calculation on input change
 * - Result display: monthly payment, total paid, total interest
 * - Stacked area chart showing principal vs interest over time
 *
 * Based on Nordic Minimal design system.
 */

type LoanType = 'annuity' | 'serial';

interface LoanInputs {
  loanAmount: number;
  interestRate: number;
  termYears: number;
  loanType: LoanType;
}

interface LoanResult {
  monthlyPayment: number; // For annuity: fixed payment. For serial: average payment
  firstPayment: number;   // For serial loans: first (highest) payment
  lastPayment: number;    // For serial loans: last (lowest) payment
  totalPaid: number;
  totalInterest: number;
  amortization: StackedDataPoint[];
  loanType: LoanType;
}

/**
 * Calculate loan amortization
 *
 * Annuity formula (fixed payment):
 * P = L * [r(1+r)^n] / [(1+r)^n - 1]
 *
 * Serial formula (fixed principal):
 * Principal per month = L / n
 * Interest = remaining balance * r
 *
 * where:
 * - L = loan amount
 * - r = monthly interest rate (annual rate / 12 / 100)
 * - n = number of payments (years * 12)
 */
function calculateLoan(inputs: LoanInputs): LoanResult {
  const { loanAmount, interestRate, termYears, loanType } = inputs;

  // Handle edge cases
  if (loanAmount <= 0 || termYears <= 0) {
    return {
      monthlyPayment: 0,
      firstPayment: 0,
      lastPayment: 0,
      totalPaid: 0,
      totalInterest: 0,
      amortization: [],
      loanType,
    };
  }

  const monthlyRate = interestRate / 100 / 12;
  const numPayments = termYears * 12;

  if (loanType === 'serial') {
    return calculateSerialLoan(loanAmount, monthlyRate, numPayments, termYears, loanType);
  }

  return calculateAnnuityLoan(loanAmount, monthlyRate, numPayments, termYears, loanType);
}

function calculateAnnuityLoan(
  loanAmount: number,
  monthlyRate: number,
  numPayments: number,
  termYears: number,
  loanType: LoanType
): LoanResult {
  // Calculate monthly payment using annuity formula
  let monthlyPayment = 0;
  if (monthlyRate === 0) {
    monthlyPayment = loanAmount / numPayments;
  } else {
    const factor = Math.pow(1 + monthlyRate, numPayments);
    monthlyPayment = (loanAmount * (monthlyRate * factor)) / (factor - 1);
  }

  const totalPaid = monthlyPayment * numPayments;
  const totalInterest = totalPaid - loanAmount;

  // Generate amortization schedule for chart (yearly data points)
  const amortization: StackedDataPoint[] = [];
  let remainingBalance = loanAmount;
  const startYear = new Date().getFullYear();

  amortization.push({
    date: new Date(startYear, 0, 1),
    principal: 0,
    interest: 0,
  });

  for (let year = 1; year <= termYears; year++) {
    let yearlyPrincipal = 0;
    let yearlyInterest = 0;

    for (let month = 0; month < 12; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;

      yearlyPrincipal += principalPayment;
      yearlyInterest += interestPayment;
      remainingBalance -= principalPayment;
    }

    remainingBalance = Math.max(0, remainingBalance);

    amortization.push({
      date: new Date(startYear + year, 0, 1),
      principal: yearlyPrincipal,
      interest: yearlyInterest,
    });
  }

  return {
    monthlyPayment,
    firstPayment: monthlyPayment,
    lastPayment: monthlyPayment,
    totalPaid,
    totalInterest,
    amortization,
    loanType,
  };
}

function calculateSerialLoan(
  loanAmount: number,
  monthlyRate: number,
  numPayments: number,
  termYears: number,
  loanType: LoanType
): LoanResult {
  // Fixed principal payment each month
  const principalPayment = loanAmount / numPayments;

  // First payment: principal + interest on full loan amount
  const firstPayment = principalPayment + loanAmount * monthlyRate;

  // Last payment: principal + interest on last remaining balance
  const lastPayment = principalPayment + principalPayment * monthlyRate;

  // Total interest for serial loan: sum of arithmetic series
  // Interest = r * L * (n + 1) / 2
  const totalInterest = monthlyRate * loanAmount * (numPayments + 1) / 2;
  const totalPaid = loanAmount + totalInterest;

  // Average monthly payment
  const monthlyPayment = totalPaid / numPayments;

  // Generate amortization schedule for chart (yearly data points)
  const amortization: StackedDataPoint[] = [];
  let remainingBalance = loanAmount;
  const startYear = new Date().getFullYear();

  amortization.push({
    date: new Date(startYear, 0, 1),
    principal: 0,
    interest: 0,
  });

  for (let year = 1; year <= termYears; year++) {
    let yearlyPrincipal = 0;
    let yearlyInterest = 0;

    for (let month = 0; month < 12; month++) {
      const interestPayment = remainingBalance * monthlyRate;

      yearlyPrincipal += principalPayment;
      yearlyInterest += interestPayment;
      remainingBalance -= principalPayment;
    }

    remainingBalance = Math.max(0, remainingBalance);

    amortization.push({
      date: new Date(startYear + year, 0, 1),
      principal: yearlyPrincipal,
      interest: yearlyInterest,
    });
  }

  return {
    monthlyPayment,
    firstPayment,
    lastPayment,
    totalPaid,
    totalInterest,
    amortization,
    loanType,
  };
}

function LoanCalculatorPage() {
  const [inputs, setInputs] = useState<LoanInputs>({
    loanAmount: 3000000,
    interestRate: 4.5,
    termYears: 25,
    loanType: 'annuity',
  });

  const result = useMemo(() => calculateLoan(inputs), [inputs]);

  const updateInput = <K extends keyof LoanInputs>(
    key: K,
    value: LoanInputs[K] | undefined
  ) => {
    setInputs((prev) => ({
      ...prev,
      [key]: value ?? (key === 'loanType' ? 'annuity' : 0),
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

        <div className="loan-type-selector animate-fade-up">
          <button
            className={`loan-type-tab ${inputs.loanType === 'annuity' ? 'active' : ''}`}
            onClick={() => updateInput('loanType', 'annuity')}
          >
            Annuitetslån
          </button>
          <button
            className={`loan-type-tab ${inputs.loanType === 'serial' ? 'active' : ''}`}
            onClick={() => updateInput('loanType', 'serial')}
          >
            Serielån
          </button>
        </div>

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
            {result.loanType === 'annuity' ? (
              <div className="result-hero">
                <div className="result-label">Månedlig betaling</div>
                <div className="result-value">{formatCurrency(result.monthlyPayment)}</div>
              </div>
            ) : (
              <div className="result-hero result-hero--serial">
                <div className="result-hero__item">
                  <div className="result-label">Første betaling</div>
                  <div className="result-value result-value--small">{formatCurrency(result.firstPayment)}</div>
                </div>
                <div className="result-hero__item">
                  <div className="result-label">Siste betaling</div>
                  <div className="result-value result-value--small">{formatCurrency(result.lastPayment)}</div>
                </div>
              </div>
            )}
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
          <h3>
            {inputs.loanType === 'annuity' ? 'Om annuitetslån' : 'Om serielån'}
          </h3>
          {inputs.loanType === 'annuity' ? (
            <>
              <p>
                Med <strong>annuitetslån</strong> betaler du samme beløp hver måned gjennom
                hele låneperioden. I starten går mesteparten til renter, mens mot slutten
                går mer til avdrag.
              </p>
              <p>
                Med et lånebeløp på {formatCurrency(inputs.loanAmount)} og{' '}
                {formatNumber(inputs.interestRate, 2)}% rente betaler du{' '}
                {formatCurrency(result.monthlyPayment)} hver måned i {inputs.termYears} år.
                Total rentekostnad blir {formatCurrency(result.totalInterest)}.
              </p>
            </>
          ) : (
            <>
              <p>
                Med <strong>serielån</strong> betaler du like mye i avdrag hver måned,
                men rentedelen synker etter hvert som lånet nedbetales. Første betaling
                er høyest, siste er lavest.
              </p>
              <p>
                Med et lånebeløp på {formatCurrency(inputs.loanAmount)} og{' '}
                {formatNumber(inputs.interestRate, 2)}% rente starter du med{' '}
                {formatCurrency(result.firstPayment)} og ender på{' '}
                {formatCurrency(result.lastPayment)} per måned.
                Total rentekostnad blir {formatCurrency(result.totalInterest)}.
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default LoanCalculatorPage;
