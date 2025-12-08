import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ErrorBoundary from './ErrorBoundary';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';

const meta: Meta<typeof ErrorBoundary> = {
  title: 'System/ErrorBoundary',
  component: ErrorBoundary,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof ErrorBoundary>;

/**
 * Component that throws an error
 */
const ThrowError: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Deliberate error for demonstration purposes');
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Ingen feil</h2>
      <p>Klikk knappen under for å utløse en feil og se ErrorBoundary i aksjon.</p>
    </div>
  );
};

/**
 * Demo component with toggle button
 */
const ErrorDemoDefault: React.FC = () => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <ThrowError shouldThrow />;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Standard ErrorBoundary</h2>
      <p>Klikk knappen for å utløse en feil og se standardfeilvisningen.</p>
      <Button variant="secondary" onClick={() => setHasError(true)}>
        Utløs feil
      </Button>
    </div>
  );
};

/**
 * Default Fallback UI
 */
export const DefaultFallback: Story = {
  render: () => (
    <ErrorBoundary>
      <ErrorDemoDefault />
    </ErrorBoundary>
  ),
};

/**
 * Custom Fallback UI
 */
const CustomFallbackDemo: React.FC = () => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <ThrowError shouldThrow />;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Egendefinert ErrorBoundary</h2>
      <p>Klikk knappen for å utløse en feil og se egendefinert feilvisning.</p>
      <Button variant="secondary" onClick={() => setHasError(true)}>
        Utløs feil
      </Button>
    </div>
  );
};

export const CustomFallback: Story = {
  render: () => (
    <ErrorBoundary
      fallback={(error, _reset) => (
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            background: 'var(--bone)',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Card
            style={{
              padding: '2rem',
              maxWidth: '500px',
              textAlign: 'center',
            }}
          >
            <h3>Oppps! Noe gikk galt</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Vi beklager, men en uventet feil oppstod. Her er noen ting du kan prøve:
            </p>
            <ul style={{ textAlign: 'left', color: 'var(--text-secondary)' }}>
              <li>Oppfrisk siden</li>
              <li>Prøv igjen senere</li>
              <li>Kontakt oss hvis problemet vedvarer</li>
            </ul>
            <div style={{ marginTop: '1rem' }}>
              <Button variant="primary" onClick={() => window.location.reload()}>
                Oppfrisk siden
              </Button>
            </div>
            <details style={{ marginTop: '1rem', textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}>
                Tekniske detaljer
              </summary>
              <pre
                style={{
                  fontSize: '0.75rem',
                  overflow: 'auto',
                  background: 'var(--bone)',
                  padding: '1rem',
                  marginTop: '0.5rem',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {error.toString()}
              </pre>
            </details>
          </Card>
        </div>
      )}
    >
      <CustomFallbackDemo />
    </ErrorBoundary>
  ),
};

/**
 * Successful Render (No Error)
 */
const SuccessContent: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Vellykket visning</h2>
      <p>ErrorBoundary fungerer normalt når det ikke er noen feil.</p>
      <Card style={{ marginTop: '1rem', padding: '1.5rem' }}>
        <h4>Innhold innenfor ErrorBoundary</h4>
        <p>Dette innholdet vises normalt fordi ingen feil har oppstått.</p>
      </Card>
    </div>
  );
};

export const SuccessfulRender: Story = {
  render: () => (
    <ErrorBoundary>
      <SuccessContent />
    </ErrorBoundary>
  ),
};
