import { useState, useMemo } from 'react';
import { formatNOK, formatPercent } from './format';
import { getSummaryValues, calculateCompoundInterest } from './compound';
import GrowthChart from './GrowthChart';
import BreakdownChart from './BreakdownChart';

export default function RentesrenteKalkulator() {
  const [startbeløp, setStartbeløp] = useState(10000);
  const [månedligBeløp, setMånedligBeløp] = useState(1000);
  const [rente, setRente] = useState(5);
  const [år, setÅr] = useState(10);
  const [error, setError] = useState<string | null>(null);

  const summary = useMemo(() => {
    try {
      setError(null);
      return getSummaryValues(startbeløp, månedligBeløp, rente, år);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Calculation error';
      setError(message);
      return { sluttverdi: 0, totalSpart: 0, renteinntekt: 0 };
    }
  }, [startbeløp, månedligBeløp, rente, år]);

  const yearlyData = useMemo(() => {
    try {
      return calculateCompoundInterest(startbeløp, månedligBeløp, rente, år);
    } catch {
      return [];
    }
  }, [startbeløp, månedligBeløp, rente, år]);

  return (
    <article style={{ padding: '2rem' }}>
      <h2>Rentesrente Kalkulator</h2>

      {error && (
        <div style={{
          padding: '1rem',
          marginBottom: '2rem',
          background: 'var(--error-container)',
          border: '1px solid var(--error)',
          borderRadius: '4px',
          color: 'var(--on-error-container)'
        }}>
          {error}
        </div>
      )}

      {/* Inputs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        {/* Startbeløp */}
        <div className="field">
          <label>Startbeløp (kr)</label>
          <input
            type="number"
            value={startbeløp}
            onChange={(e) => setStartbeløp(Math.max(0, Number(e.target.value)))}
            min="0"
            step="1000"
          />
        </div>

        {/* Månedlig Beløp */}
        <div className="field">
          <label>Månedlig sparebeløp (kr)</label>
          <input
            type="number"
            value={månedligBeløp}
            onChange={(e) => setMånedligBeløp(Math.max(0, Number(e.target.value)))}
            min="0"
            step="100"
          />
        </div>
      </div>

      {/* Sliders */}
      <div style={{ marginBottom: '2rem' }}>
        {/* Rente Slider */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Rente</span>
            <span style={{ fontWeight: 'bold' }}>{formatPercent(rente)}</span>
          </label>
          <input
            type="range"
            min="0.1"
            max="20"
            step="0.1"
            value={rente}
            onChange={(e) => setRente(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        {/* År Slider */}
        <div>
          <label style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>År</span>
            <span style={{ fontWeight: 'bold' }}>{år} år</span>
          </label>
          <input
            type="range"
            min="1"
            max="50"
            step="1"
            value={år}
            onChange={(e) => setÅr(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Results */}
      <div className="primary-container" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ marginTop: 0 }}>Resultat</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div>
            <p style={{ fontSize: '0.9rem', opacity: 0.8, margin: 0 }}>Sluttverdi</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0 0 0' }}>
              {formatNOK(summary.sluttverdi)}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '0.9rem', opacity: 0.8, margin: 0 }}>Totalt spart</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0 0 0' }}>
              {formatNOK(summary.totalSpart)}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '0.9rem', opacity: 0.8, margin: 0 }}>Renteinntekt</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0 0 0', color: '#2ecc71' }}>
              {formatNOK(summary.renteinntekt)}
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', marginTop: '2rem' }}>
        <GrowthChart data={yearlyData} />
        <BreakdownChart data={yearlyData} />
      </div>
    </article>
  );
}
