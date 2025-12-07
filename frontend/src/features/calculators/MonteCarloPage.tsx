import { useState, useMemo } from 'react';
import { Breadcrumb, PageHeader, Card, NumberInput, formatCurrency, formatNumber } from '@finans/components';
import MonteCarloChart from './MonteCarloChart';
import './CompoundCalculatorPage.css'; // Reuse shared calculator styles

/**
 * MonteCarloPage Component
 *
 * Monte Carlo retirement simulator running thousands of scenarios
 * to show probability of success for different retirement strategies.
 *
 * Features:
 * - Input fields for portfolio value, annual withdrawal, years, expected return, volatility
 * - Client-side Monte Carlo simulation
 * - Result display: success rate, percentile bands
 * - D3.js visualization showing scenario paths
 *
 * Based on Nordic Minimal design system.
 */

interface MonteCarloInputs {
  portfolioValue: number;
  annualWithdrawal: number;
  years: number;
  expectedReturn: number;
  volatility: number;
  simulations: number;
}

interface MonteCarloResult {
  successRate: number;
  percentile10: number;
  percentile25: number;
  percentile50: number;
  percentile75: number;
  percentile90: number;
  scenarios: number[][];
  simulationsRun: number;
}

/**
 * Generate a random number from normal distribution using Box-Muller transform
 */
function randomNormal(mean: number, stdDev: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z * stdDev;
}

/**
 * Run Monte Carlo retirement simulation locally
 *
 * Simulates portfolio growth/depletion over time with random returns.
 * Each simulation assumes:
 * - Annual returns follow a normal distribution
 * - Fixed annual withdrawal amount
 * - Portfolio stops growing once depleted
 */
function runMonteCarloSimulation(inputs: MonteCarloInputs): MonteCarloResult {
  const { portfolioValue, annualWithdrawal, years, expectedReturn, volatility, simulations } = inputs;

  const results: number[] = [];
  const scenarios: number[][] = [];

  // Convert percentages to decimals
  const expectedReturnDecimal = expectedReturn / 100;
  const volatilityDecimal = volatility / 100;

  // Run each simulation
  for (let sim = 0; sim < simulations; sim++) {
    let balance = portfolioValue;
    const yearlyBalances: number[] = [balance];

    // Simulate each year
    for (let year = 0; year < years; year++) {
      // Generate random return based on normal distribution
      const annualReturn = randomNormal(expectedReturnDecimal, volatilityDecimal);

      // Apply return to balance
      balance = balance * (1 + annualReturn);

      // Apply withdrawal (only if balance is positive)
      if (balance > 0) {
        balance -= annualWithdrawal;
      }

      // Don't allow balance to go below zero
      balance = Math.max(0, balance);

      yearlyBalances.push(balance);

      // Stop simulation if balance depleted
      if (balance <= 0) {
        break;
      }
    }

    // Record final balance
    results.push(yearlyBalances[yearlyBalances.length - 1]);

    // Keep sample of scenarios (first 100) for frontend visualization
    if (sim < 100) {
      scenarios.push(yearlyBalances);
    }
  }

  // Calculate success rate (% of simulations that maintained positive balance)
  const successfulSimulations = results.filter(balance => balance > 0).length;
  const successRate = (successfulSimulations / simulations) * 100;

  // Sort results for percentile calculation
  const sorted = [...results].sort((a, b) => a - b);

  // Calculate percentiles
  const percentile10 = sorted[Math.floor(simulations * 0.1)] || 0;
  const percentile25 = sorted[Math.floor(simulations * 0.25)] || 0;
  const percentile50 = sorted[Math.floor(simulations * 0.5)] || 0;
  const percentile75 = sorted[Math.floor(simulations * 0.75)] || 0;
  const percentile90 = sorted[Math.floor(simulations * 0.9)] || 0;

  return {
    successRate: Math.round(successRate * 100) / 100, // Round to 2 decimal places
    percentile10,
    percentile25,
    percentile50,
    percentile75,
    percentile90,
    scenarios,
    simulationsRun: simulations
  };
}

function MonteCarloPage() {
  const [inputs, setInputs] = useState<MonteCarloInputs>({
    portfolioValue: 5000000,
    annualWithdrawal: 200000,
    years: 30,
    expectedReturn: 7,
    volatility: 15,
    simulations: 1000,
  });

  const result = useMemo(() => runMonteCarloSimulation(inputs), [inputs]);

  const updateInput = <K extends keyof MonteCarloInputs>(
    key: K,
    value: number | undefined
  ) => {
    setInputs((prev) => ({
      ...prev,
      [key]: value ?? 0,
    }));
  };

  // Calculate withdrawal rate as percentage of portfolio
  const withdrawalRate =
    inputs.portfolioValue > 0
      ? ((inputs.annualWithdrawal / inputs.portfolioValue) * 100).toFixed(2)
      : '0';

  return (
    <main className="calculator-page">
      <div className="container container--narrow">
        <Breadcrumb
          items={[
            { label: 'Kalkulatorer', path: '/kalkulatorer' },
            { label: 'Monte Carlo' },
          ]}
        />

        <PageHeader
          title="Monte Carlo"
          subtitle="Simuler tusenvis av scenarioer for å teste pensjonsplanen din"
        />

        <div className="calculator-layout">
          <Card className="calculator-inputs animate-fade-up animate-delay-1">
            <NumberInput
              label="Porteføljeverdi"
              value={inputs.portfolioValue}
              onChange={(v) => updateInput('portfolioValue', v)}
              suffix="kr"
            />
            <NumberInput
              label="Årlig uttak"
              value={inputs.annualWithdrawal}
              onChange={(v) => updateInput('annualWithdrawal', v)}
              suffix="kr"
            />
            <NumberInput
              label="Antall år"
              value={inputs.years}
              onChange={(v) => updateInput('years', v)}
              suffix="år"
            />
            <NumberInput
              label="Forventet avkastning"
              value={inputs.expectedReturn}
              onChange={(v) => updateInput('expectedReturn', v)}
              suffix="%"
            />
            <NumberInput
              label="Volatilitet"
              value={inputs.volatility}
              onChange={(v) => updateInput('volatility', v)}
              suffix="%"
            />
          </Card>

          {result && (
            <Card className="calculator-results animate-fade-up animate-delay-2">
              <div className="result-hero">
                <div className="result-label">Sannsynlighet for suksess</div>
                <div className="result-value" style={{ color: 'var(--muted-sage)' }}>
                  {formatNumber(result.successRate, 1)}%
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  Basert på {formatNumber(result.simulationsRun, 0)} simuleringer
                </div>
              </div>
              <div className="result-breakdown">
                <div className="result-item">
                  <span className="result-item__label">Uttaksrate</span>
                  <span className="result-item__value">{withdrawalRate}%</span>
                </div>
                <div className="result-item">
                  <span className="result-item__label">10. persentil</span>
                  <span className="result-item__value">{formatCurrency(result.percentile10)}</span>
                </div>
                <div className="result-item">
                  <span className="result-item__label">25. persentil</span>
                  <span className="result-item__value">{formatCurrency(result.percentile25)}</span>
                </div>
                <div className="result-item">
                  <span className="result-item__label">Median (50.)</span>
                  <span className="result-item__value">{formatCurrency(result.percentile50)}</span>
                </div>
                <div className="result-item">
                  <span className="result-item__label">75. persentil</span>
                  <span className="result-item__value">{formatCurrency(result.percentile75)}</span>
                </div>
                <div className="result-item">
                  <span className="result-item__label">90. persentil</span>
                  <span className="result-item__value">{formatCurrency(result.percentile90)}</span>
                </div>
              </div>
            </Card>
          )}
        </div>

        {result && result.scenarios && result.scenarios.length > 0 && (
          <div className="animate-fade-up animate-delay-3">
            <MonteCarloChart
              scenarios={result.scenarios}
              percentiles={{
                p10: result.percentile10,
                p25: result.percentile25,
                p50: result.percentile50,
                p75: result.percentile75,
                p90: result.percentile90,
              }}
              years={inputs.years}
            />
          </div>
        )}

        <div className="calculator-info animate-fade-up animate-delay-4">
          <h3>Hva er Monte Carlo-simulering?</h3>
          <p>
            Monte Carlo-simulering bruker tilfeldige tall for å modellere tusenvis av mulige
            utfall for pensjonsplanen din. Dette gir et mer realistisk bilde enn enkle kalkulatorer
            som antar konstant avkastning hvert år.
          </p>
          <p>
            Med en portefølje på {formatCurrency(inputs.portfolioValue)} og et årlig uttak på{' '}
            {formatCurrency(inputs.annualWithdrawal)} (uttaksrate {withdrawalRate}%), viser
            simuleringen at du har {formatNumber(result?.successRate ?? 0, 1)}% sannsynlighet
            for å opprettholde pensjonen din i {inputs.years} år.
          </p>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '16px' }}>
            <strong>Tips:</strong> En uttaksrate på 4% eller mindre gir typisk høy sannsynlighet
            for suksess (80%+). Høyere volatilitet reduserer sannsynligheten for suksess.
          </p>
        </div>
      </div>
    </main>
  );
}

export default MonteCarloPage;
