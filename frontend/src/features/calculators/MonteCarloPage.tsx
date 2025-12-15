import { useState, useMemo } from 'react';
import { PageLayout, Card, NumberInput, formatCurrency, formatNumber, formatPercentage } from '@finans/components';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
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
  inflation?: number;
}

interface MonteCarloResult {
  successRate: number;
  percentile10: number;
  percentile25: number;
  percentile50: number;
  percentile75: number;
  percentile90: number;
  percentile10Real?: number;
  percentile25Real?: number;
  percentile50Real?: number;
  percentile75Real?: number;
  percentile90Real?: number;
  scenarios: number[][];
  scenariosReal?: number[][];
  simulationsRun: number;
  inflation?: number;
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
 * - Optional inflation adjustment for real value calculations
 */
function runMonteCarloSimulation(inputs: MonteCarloInputs): MonteCarloResult {
  const {
    portfolioValue,
    annualWithdrawal,
    years,
    expectedReturn,
    volatility,
    simulations,
    inflation = 2
  } = inputs;

  const results: number[] = [];
  const scenarios: number[][] = [];
  const scenariosReal: number[][] = [];

  // Convert percentages to decimals
  const expectedReturnDecimal = expectedReturn / 100;
  const volatilityDecimal = volatility / 100;
  const inflationDecimal = inflation / 100;

  // Run each simulation
  for (let sim = 0; sim < simulations; sim++) {
    let balance = portfolioValue;
    const yearlyBalances: number[] = [balance];
    const yearlyBalancesReal: number[] = [balance]; // Real values always start at original value

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

      // Calculate real (inflation-adjusted) value
      const realValue = balance / Math.pow(1 + inflationDecimal, year + 1);
      yearlyBalancesReal.push(realValue);

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
      scenariosReal.push(yearlyBalancesReal);
    }
  }

  // Calculate success rate (% of simulations that maintained positive balance)
  const successfulSimulations = results.filter(balance => balance > 0).length;
  const successRate = (successfulSimulations / simulations) * 100;

  // Sort results for percentile calculation
  const sorted = [...results].sort((a, b) => a - b);

  // Calculate nominal percentiles
  const percentile10 = sorted[Math.floor(simulations * 0.1)] || 0;
  const percentile25 = sorted[Math.floor(simulations * 0.25)] || 0;
  const percentile50 = sorted[Math.floor(simulations * 0.5)] || 0;
  const percentile75 = sorted[Math.floor(simulations * 0.75)] || 0;
  const percentile90 = sorted[Math.floor(simulations * 0.9)] || 0;

  const result: MonteCarloResult = {
    successRate: Math.round(successRate * 100) / 100, // Round to 2 decimal places
    percentile10,
    percentile25,
    percentile50,
    percentile75,
    percentile90,
    scenarios,
    scenariosReal,
    simulationsRun: simulations,
    inflation
  };

  // Calculate real value percentiles
  if (inflation > 0) {
    const resultsReal = results.map(balance => balance / Math.pow(1 + inflationDecimal, years));
    const sortedReal = [...resultsReal].sort((a, b) => a - b);

    result.percentile10Real = sortedReal[Math.floor(simulations * 0.1)] || 0;
    result.percentile25Real = sortedReal[Math.floor(simulations * 0.25)] || 0;
    result.percentile50Real = sortedReal[Math.floor(simulations * 0.5)] || 0;
    result.percentile75Real = sortedReal[Math.floor(simulations * 0.75)] || 0;
    result.percentile90Real = sortedReal[Math.floor(simulations * 0.9)] || 0;
  }

  return result;
}

function MonteCarloPage() {
  usePageTitle('Monte Carlo');
  const [tab, setTab] = useState<'enkel' | 'avansert'>('enkel');
  const [inputs, setInputs] = useState<MonteCarloInputs>({
    portfolioValue: 5000000,
    annualWithdrawal: 200000,
    years: 30,
    expectedReturn: 7,
    volatility: 15,
    simulations: 1000,
    inflation: 2
  });
  const [showRealValues, setShowRealValues] = useState(false);

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
  const withdrawalRateValue =
    inputs.portfolioValue > 0
      ? (inputs.annualWithdrawal / inputs.portfolioValue) * 100
      : 0;
  const withdrawalRate = formatPercentage(withdrawalRateValue / 100, 2);

  return (
    <PageLayout
      title="Monte Carlo"
      breadcrumb={[
        { label: 'Kalkulatorer', path: '/kalkulatorer' },
        { label: 'Monte Carlo' }
      ]}
    >
      {/* Tabs for simple vs advanced mode */}
        <div style={{ marginBottom: '32px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: '24px' }}>
            <button
              onClick={() => setTab('enkel')}
              style={{
                padding: '12px 0',
                fontSize: '16px',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: tab === 'enkel' ? '600' : '400',
                color: tab === 'enkel' ? 'var(--charcoal)' : 'var(--text-secondary)',
                background: 'none',
                border: 'none',
                borderBottom: tab === 'enkel' ? '2px solid var(--charcoal)' : 'none',
                cursor: 'pointer',
                transition: 'all 200ms ease'
              }}
            >
              Enkel
            </button>
            <button
              onClick={() => setTab('avansert')}
              style={{
                padding: '12px 0',
                fontSize: '16px',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: tab === 'avansert' ? '600' : '400',
                color: tab === 'avansert' ? 'var(--charcoal)' : 'var(--text-secondary)',
                background: 'none',
                border: 'none',
                borderBottom: tab === 'avansert' ? '2px solid var(--charcoal)' : 'none',
                cursor: 'pointer',
                transition: 'all 200ms ease'
              }}
            >
              Avansert
            </button>
          </div>
        </div>

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
            {tab === 'avansert' && (
              <NumberInput
                label="Forventet inflasjon"
                value={inputs.inflation ?? 2}
                onChange={(v) => updateInput('inflation', v)}
                suffix="%"
              />
            )}
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

              {/* Toggle for nominal/real values in advanced mode */}
              {tab === 'avansert' && result.inflation && (
                <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={showRealValues}
                      onChange={(e) => setShowRealValues(e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '14px', color: 'var(--charcoal)' }}>
                      Vis reelle verdier (justert for {result.inflation}% inflasjon)
                    </span>
                  </label>
                </div>
              )}

              <div className="result-breakdown">
                <div className="result-item">
                  <span className="result-item__label">Uttaksrate</span>
                  <span className="result-item__value">{withdrawalRate}</span>
                </div>
                <div className="result-item">
                  <span className="result-item__label">10. persentil</span>
                  <span className="result-item__value">
                    {showRealValues && result.percentile10Real !== undefined
                      ? formatCurrency(result.percentile10Real)
                      : formatCurrency(result.percentile10)}
                  </span>
                </div>
                <div className="result-item">
                  <span className="result-item__label">25. persentil</span>
                  <span className="result-item__value">
                    {showRealValues && result.percentile25Real !== undefined
                      ? formatCurrency(result.percentile25Real)
                      : formatCurrency(result.percentile25)}
                  </span>
                </div>
                <div className="result-item">
                  <span className="result-item__label">Median (50.)</span>
                  <span className="result-item__value">
                    {showRealValues && result.percentile50Real !== undefined
                      ? formatCurrency(result.percentile50Real)
                      : formatCurrency(result.percentile50)}
                  </span>
                </div>
                <div className="result-item">
                  <span className="result-item__label">75. persentil</span>
                  <span className="result-item__value">
                    {showRealValues && result.percentile75Real !== undefined
                      ? formatCurrency(result.percentile75Real)
                      : formatCurrency(result.percentile75)}
                  </span>
                </div>
                <div className="result-item">
                  <span className="result-item__label">90. persentil</span>
                  <span className="result-item__value">
                    {showRealValues && result.percentile90Real !== undefined
                      ? formatCurrency(result.percentile90Real)
                      : formatCurrency(result.percentile90)}
                  </span>
                </div>
              </div>
            </Card>
          )}
        </div>

        {result && result.scenarios && result.scenarios.length > 0 && (
          <div className="animate-fade-up animate-delay-3">
            <MonteCarloChart
              scenarios={showRealValues && result.scenariosReal ? result.scenariosReal : result.scenarios}
              percentiles={{
                p10: showRealValues && result.percentile10Real !== undefined ? result.percentile10Real : result.percentile10,
                p25: showRealValues && result.percentile25Real !== undefined ? result.percentile25Real : result.percentile25,
                p50: showRealValues && result.percentile50Real !== undefined ? result.percentile50Real : result.percentile50,
                p75: showRealValues && result.percentile75Real !== undefined ? result.percentile75Real : result.percentile75,
                p90: showRealValues && result.percentile90Real !== undefined ? result.percentile90Real : result.percentile90,
              }}
              years={inputs.years}
              isRealValues={showRealValues}
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
          <p style={{ marginTop: '16px' }}>
            📊{' '}
            <a
              href="https://curvo.eu/backtest/en/market-index/msci-world?currency=usd"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--muted-sage)', textDecoration: 'none', borderBottom: '1px solid var(--muted-sage)' }}
            >
              Se historiske data: MSCI World (Curvo)
            </a>
          </p>
        </div>
    </PageLayout>
  );
}

export default MonteCarloPage;
