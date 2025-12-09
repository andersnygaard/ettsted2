import './FeatureErrorFallback.css';

interface FeatureErrorFallbackProps {
  error: Error;
  reset: () => void;
  featureName?: string;
}

const ErrorIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const RefreshIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

/**
 * Feature-level error fallback UI
 * Shown when a major feature component encounters an error
 * Allows users to retry without affecting other features
 */
export default function FeatureErrorFallback({
  error,
  reset,
  featureName = 'Feature'
}: FeatureErrorFallbackProps) {
  return (
    <div className="feature-error-fallback">
      <div className="feature-error-fallback__card">
        <div className="feature-error-fallback__icon" aria-hidden="true">
          {ErrorIcon}
        </div>
        <h3 className="feature-error-fallback__title">
          {featureName} - Noe gikk galt
        </h3>
        <p className="feature-error-fallback__message">
          En feil oppstod i denne delen av appen. Resten fungerer normalt.
        </p>
        <details className="feature-error-fallback__details">
          <summary>Tekniske detaljer</summary>
          <pre>{error.toString()}</pre>
        </details>
        <button className="feature-error-fallback__btn" onClick={reset}>
          <span className="feature-error-fallback__btn-icon" aria-hidden="true">
            {RefreshIcon}
          </span>
          <span>Prøv igjen</span>
        </button>
      </div>
    </div>
  );
}
