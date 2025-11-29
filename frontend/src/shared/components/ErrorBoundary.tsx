import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

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

  render() {
    if (this.state.hasError) {
      return (
        <div className="middle-align center-align" style={{ padding: '2rem' }}>
          <article className="border round">
            <i className="extra-large">error</i>
            <h3>Noe gikk galt</h3>
            <p>En uventet feil oppstod. Vennligst prøv igjen.</p>
            {this.state.error && (
              <details style={{ marginTop: '1rem', textAlign: 'left' }}>
                <summary>Tekniske detaljer</summary>
                <pre style={{ fontSize: '0.875rem', overflow: 'auto' }}>
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button className="large" onClick={this.handleReload}>
              <i>refresh</i>
              <span>Last siden på nytt</span>
            </button>
          </article>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
