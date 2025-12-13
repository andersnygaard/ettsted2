import { useState, useMemo, useEffect } from 'react';
import { Breadcrumb, PageHeader, Card, NumberInput, StackedAreaChart, Tabs, formatCurrency, formatNumber, formatPercentage } from '@finans/components';
import type { StackedDataPoint } from '@finans/components';
import { useGjeldData } from '@/features/gjeld/useGjeldData';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
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

type LoanType = 'annuity' | 'serial' | 'flexi';

interface LoanInputs {
  loanAmount: number;
  interestRate: number;
  termYears: number;
  monthlyPayment: number; // For flexi loans
  loanType: LoanType;
}

interface LoanResult {
  monthlyPayment: number; // For annuity: fixed payment. For serial: average payment. For flexi: user input
  firstPayment: number;   // For serial loans: first (highest) payment
  lastPayment: number;    // For serial loans: last (lowest) payment
  totalPaid: number;
  totalInterest: number;
  amortization: StackedDataPoint[];
  loanType: LoanType;
  monthsToPayoff?: number; // For flexi loans
  yearsToPayoff?: string;  // For flexi loans (formatted)
  payoffDate?: string;     // For flexi loans
  warning?: string;        // For flexi loans
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
  const { loanAmount, interestRate, termYears, monthlyPayment, loanType } = inputs;

  // Handle edge cases
  if (loanAmount <= 0 || (loanType !== 'flexi' && termYears <= 0)) {
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

  if (loanType === 'flexi') {
    return calculateFlexiLoan(loanAmount, monthlyRate, monthlyPayment, loanType);
  }

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
  if (monthlyRate === 0 || numPayments === 0) {
    monthlyPayment = numPayments > 0 ? loanAmount / numPayments : 0;
  } else {
    const factor = Math.pow(1 + monthlyRate, numPayments);
    monthlyPayment = (factor - 1) !== 0
      ? (loanAmount * (monthlyRate * factor)) / (factor - 1)
      : 0;
  }

  const totalPaid = monthlyPayment * numPayments;
  const totalInterest = totalPaid - loanAmount;

  // Generate amortization schedule for chart (yearly data points)
  const amortization: StackedDataPoint[] = [];
  let remainingBalance = loanAmount;
  const startYear = new Date().getFullYear();

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
  const principalPayment = numPayments > 0 ? loanAmount / numPayments : 0;

  // First payment: principal + interest on full loan amount
  const firstPayment = principalPayment + loanAmount * monthlyRate;

  // Last payment: principal + interest on last remaining balance
  const lastPayment = principalPayment + principalPayment * monthlyRate;

  // Total interest for serial loan: sum of arithmetic series
  // Interest = r * L * (n + 1) / 2
  const totalInterest = monthlyRate * loanAmount * (numPayments + 1) / 2;
  const totalPaid = loanAmount + totalInterest;

  // Average monthly payment
  const monthlyPayment = numPayments > 0 ? totalPaid / numPayments : 0;

  // Generate amortization schedule for chart (yearly data points)
  const amortization: StackedDataPoint[] = [];
  let remainingBalance = loanAmount;
  const startYear = new Date().getFullYear();

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

function calculateFlexiLoan(
  loanAmount: number,
  monthlyRate: number,
  monthlyPayment: number,
  loanType: LoanType
): LoanResult {
  // Calculate monthly interest
  const monthlyInterest = loanAmount * monthlyRate;

  // Check if payment covers interest
  if (monthlyPayment <= 0 || monthlyPayment <= monthlyInterest) {
    return {
      monthlyPayment: 0,
      firstPayment: 0,
      lastPayment: 0,
      totalPaid: 0,
      totalInterest: 0,
      amortization: [],
      loanType,
      warning: 'Månedlig betaling må være høyere enn månedlig rente for å nedbetale lånet',
    };
  }

  // Warning if payment barely covers interest (less than 1.5x)
  let warning: string | undefined;
  if (monthlyPayment < monthlyInterest * 1.5) {
    warning = 'Betalingen dekker knapt rentene. Nedbetalingen vil ta svært lang tid.';
  }

  // Calculate number of months using logarithmic formula
  const monthsToPayoff = monthlyRate > 0
    ? Math.ceil(-Math.log(1 - (monthlyRate * loanAmount) / monthlyPayment) / Math.log(1 + monthlyRate))
    : Math.ceil(loanAmount / monthlyPayment);

  // Generate amortization schedule for chart (yearly data points)
  const amortization: StackedDataPoint[] = [];
  let balance = loanAmount;
  let totalInterestPaid = 0;
  const startYear = new Date().getFullYear();
  const yearsToPayoff = Math.ceil(monthsToPayoff / 12);

  for (let year = 1; year <= yearsToPayoff; year++) {
    let yearlyPrincipal = 0;
    let yearlyInterest = 0;

    for (let month = 0; month < 12 && balance > 0.01; month++) {
      const interestPayment = balance * monthlyRate;
      const actualPayment = Math.min(monthlyPayment, balance + interestPayment);
      const principalPayment = actualPayment - interestPayment;

      yearlyPrincipal += principalPayment;
      yearlyInterest += interestPayment;
      balance -= principalPayment;
      totalInterestPaid += interestPayment;
    }

    balance = Math.max(0, balance);

    amortization.push({
      date: new Date(startYear + year, 0, 1),
      principal: yearlyPrincipal,
      interest: yearlyInterest,
    });

    if (balance <= 0.01) break;
  }

  const totalPaid = loanAmount + totalInterestPaid;

  // Format years and months
  const years = Math.floor(monthsToPayoff / 12);
  const months = monthsToPayoff % 12;
  let yearsToPayoffStr = '';
  if (years > 0) {
    yearsToPayoffStr += `${years} år`;
  }
  if (months > 0) {
    if (years > 0) yearsToPayoffStr += ', ';
    yearsToPayoffStr += `${months} ${months === 1 ? 'måned' : 'måneder'}`;
  }
  if (yearsToPayoffStr === '') {
    yearsToPayoffStr = '0 måneder';
  }

  // Calculate payoff date
  const today = new Date();
  const payoffDateObj = new Date(today.getFullYear(), today.getMonth() + monthsToPayoff, today.getDate());
  const payoffDate = `${String(payoffDateObj.getDate()).padStart(2, '0')}.${String(payoffDateObj.getMonth() + 1).padStart(2, '0')}.${payoffDateObj.getFullYear()}`;

  return {
    monthlyPayment,
    firstPayment: monthlyPayment,
    lastPayment: monthlyPayment,
    totalPaid,
    totalInterest: totalInterestPaid,
    amortization,
    loanType,
    monthsToPayoff,
    yearsToPayoff: yearsToPayoffStr,
    payoffDate,
    warning,
  };
}

function LoanCalculatorPage() {
  usePageTitle('Lånekalkulator');
  const { data: gjeldData } = useGjeldData();

  const [inputs, setInputs] = useState<LoanInputs>({
    loanAmount: 3000000,
    interestRate: 4.5,
    termYears: 25,
    monthlyPayment: 15000,
    loanType: 'annuity',
  });

  // Update loan amount, interest rate, and term when gjeld data loads
  useEffect(() => {
    if (!gjeldData) return;

    // Prefer primary residence loan if available
    if (gjeldData.primaryResidenceLoan) {
      const { balance, interestRate, remainingYears } = gjeldData.primaryResidenceLoan;
      setInputs(prev => ({
        ...prev,
        loanAmount: balance,
        interestRate: interestRate ?? prev.interestRate,
        termYears: remainingYears ?? prev.termYears,
      }));
    }
    // Fallback to total debt with defaults
    else if (gjeldData.totalDebt && gjeldData.totalDebt > 0) {
      setInputs(prev => ({ ...prev, loanAmount: gjeldData.totalDebt }));
    }
  }, [gjeldData?.totalDebt, gjeldData?.primaryResidenceLoan]);

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
  const interestPercentageValue =
    result.totalPaid > 0
      ? (result.totalInterest / result.totalPaid) * 100
      : 0;
  const interestPercentage = formatPercentage(interestPercentageValue / 100, 1);

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

        <div className="animate-fade-up">
          <Tabs
            tabs={[
              { id: 'annuity', label: 'Annuitetslån' },
              { id: 'serial', label: 'Serielån' },
              { id: 'flexi', label: 'Fleksilån' }
            ]}
            activeTab={inputs.loanType}
            onChange={(tabId) => updateInput('loanType', tabId as LoanType)}
            ariaLabel="Velg lånetype"
          />
        </div>

        <div className="calculator-layout">
          <Card className="calculator-inputs animate-fade-up animate-delay-1">
            <NumberInput
              label={inputs.loanType === 'flexi' ? 'Utestående saldo' : 'Lånebeløp'}
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
            {inputs.loanType === 'flexi' ? (
              <NumberInput
                label="Månedlig betaling"
                value={inputs.monthlyPayment}
                onChange={(v) => updateInput('monthlyPayment', v)}
                suffix="kr"
              />
            ) : (
              <NumberInput
                label="Nedbetalingstid"
                value={inputs.termYears}
                onChange={(v) => updateInput('termYears', v)}
                suffix="år"
              />
            )}
          </Card>

          <Card className="calculator-results animate-fade-up animate-delay-2">
            {result.warning && (
              <div className="calculator-warning" style={{
                padding: 'var(--space-sm)',
                marginBottom: 'var(--space-md)',
                backgroundColor: 'var(--soft-terracotta)',
                color: 'var(--charcoal)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-sm)'
              }}>
                {result.warning}
              </div>
            )}
            {result.loanType === 'flexi' ? (
              <div className="result-hero">
                <div className="result-label">Nedbetalt på</div>
                <div className="result-value">{result.yearsToPayoff || '0 måneder'}</div>
                {result.payoffDate && (
                  <div className="result-sublabel" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-xs)' }}>
                    Ferdig: {result.payoffDate}
                  </div>
                )}
              </div>
            ) : result.loanType === 'annuity' ? (
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
                  {interestPercentage}
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
              const yearOffset = year - current;
              return `År ${yearOffset}`;
            }}
          />
        </div>

        <div className="calculator-info animate-fade-up animate-delay-4">
          <h3>
            {inputs.loanType === 'flexi' ? 'Om fleksilån' : inputs.loanType === 'annuity' ? 'Om annuitetslån' : 'Om serielån'}
          </h3>
          {inputs.loanType === 'flexi' ? (
            <>
              <p>
                Med <strong>fleksilån</strong> (rammelån eller boligkreditt) har du en
                kredittramme du kan disponere fritt. Du bestemmer selv hvor mye du betaler
                hver måned, så lenge betalingen dekker rentene. Jo mer du betaler, jo
                raskere blir lånet nedbetalt.
              </p>
              <p>
                Med en utestående saldo på {formatCurrency(inputs.loanAmount)} og{' '}
                {formatNumber(inputs.interestRate, 2)}% rente, og en månedlig betaling på{' '}
                {formatCurrency(inputs.monthlyPayment)}, vil du være gjeldfri på{' '}
                {result.yearsToPayoff || '0 måneder'}.
                Total rentekostnad blir {formatCurrency(result.totalInterest)}.
              </p>
            </>
          ) : inputs.loanType === 'annuity' ? (
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
