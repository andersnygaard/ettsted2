import React, { Component, ReactNode } from 'react';
import './ErrorBoundary.css';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * SVG Icons
 */
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

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    // Future: Send to error tracking service (e.g., Sentry)
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback && this.state.error) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      // Default fallback UI
      return (
        <div className="error-boundary">
          <div className="error-boundary__card">
            <div className="error-boundary__icon" aria-hidden="true">
              {ErrorIcon}
            </div>
            <h3 className="error-boundary__title">Noe gikk galt</h3>
            <p className="error-boundary__message">
              En uventet feil oppstod. Vennligst prøv igjen.
            </p>
            {this.state.error && (
              <details className="error-boundary__details">
                <summary>Tekniske detaljer</summary>
                <pre>{this.state.error.toString()}</pre>
              </details>
            )}
            <button className="error-boundary__btn" onClick={this.handleReload}>
              <span className="error-boundary__btn-icon" aria-hidden="true">
                {RefreshIcon}
              </span>
              <span>Last siden på nytt</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
