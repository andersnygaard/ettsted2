import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Breadcrumb, PageHeader, Card, NumberInput } from '@finans/components';
import { formatCurrency, formatNumber } from '@/shared/utils/numberFormat';
import client from '@/shared/api/client';
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
 * - Run Monte Carlo simulation via backend API
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
 * Call Monte Carlo simulation API
 */
async function runMonteCarloSimulation(inputs: MonteCarloInputs): Promise<MonteCarloResult> {
  const response = await client.post('/calculators/monte-carlo', inputs);
  return response.data.data;
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

  const [submittedYears, setSubmittedYears] = useState<number | null>(null);

  const { mutate, data: result, isPending, error } = useMutation({
    mutationFn: runMonteCarloSimulation,
  });

  const updateInput = <K extends keyof MonteCarloInputs>(
    key: K,
    value: number | undefined
  ) => {
    setInputs((prev) => ({
      ...prev,
      [key]: value ?? 0,
    }));
  };

  const handleRunSimulation = () => {
    setSubmittedYears(inputs.years);
    mutate(inputs);
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

            <button
              className="btn-primary"
              onClick={handleRunSimulation}
              disabled={isPending}
              style={{ marginTop: '16px', width: '100%' }}
            >
              {isPending ? 'Simulerer...' : 'Kjør simulering'}
            </button>

            {error && (
              <div style={{ color: 'var(--negative)', marginTop: '12px', fontSize: '14px' }}>
                {error instanceof Error ? error.message : 'En feil oppstod'}
              </div>
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
              years={submittedYears || inputs.years}
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
