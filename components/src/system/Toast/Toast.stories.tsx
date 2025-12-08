import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ToastProvider, useToast } from './Toast';
import { Button } from '../../ui/Button';

const meta = {
  title: 'System/Toast',
  component: ToastProvider,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Toast demo component that uses the useToast hook
 */
const ToastDemo: React.FC<{ autoShow?: boolean; toastType?: 'success' | 'error' | 'warning' | 'info' }> = ({
  autoShow = false,
  toastType = 'success'
}) => {
  const { showToast, showSuccess, showError, showWarning, showInfo } = useToast();
  const [isShown, setIsShown] = useState(autoShow);

  React.useEffect(() => {
    if (autoShow && !isShown) {
      switch (toastType) {
        case 'success':
          showSuccess('Operasjonen var vellykket!');
          break;
        case 'error':
          showError('En feil oppstod. Vennligst prøv igjen.');
          break;
        case 'warning':
          showWarning('Advarsel: Dette kan ikke angres.');
          break;
        case 'info':
          showInfo('Informasjon: Systemet er oppdatert.');
          break;
      }
      setIsShown(true);
    }
  }, [autoShow, isShown, toastType, showSuccess, showError, showWarning, showInfo]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Toast Notifications</h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Button
          variant="primary"
          onClick={() => showSuccess('Operasjonen var vellykket!')}
        >
          Vis Success
        </Button>
        <Button
          variant="secondary"
          onClick={() => showError('En feil oppstod. Vennligst prøv igjen.')}
        >
          Vis Error
        </Button>
        <Button
          variant="secondary"
          onClick={() => showWarning('Advarsel: Dette kan ikke angres.')}
        >
          Vis Warning
        </Button>
        <Button
          variant="secondary"
          onClick={() => showInfo('Informasjon: Systemet er oppdatert.')}
        >
          Vis Info
        </Button>
        <Button
          variant="secondary"
          onClick={() => showToast('Egendefinert melding', 'success', 3000)}
        >
          Tilpasset (3s)
        </Button>
      </div>
    </div>
  );
};

/**
 * Success Toast Story
 */
export const SuccessToast: Story = {
  args: { children: null },
  render: () => (
    <ToastProvider>
      <ToastDemo autoShow toastType="success" />
    </ToastProvider>
  ),
};

/**
 * Error Toast Story
 */
export const ErrorToast: Story = {
  args: { children: null },
  render: () => (
    <ToastProvider>
      <ToastDemo autoShow toastType="error" />
    </ToastProvider>
  ),
};

/**
 * Warning Toast Story
 */
export const WarningToast: Story = {
  args: { children: null },
  render: () => (
    <ToastProvider>
      <ToastDemo autoShow toastType="warning" />
    </ToastProvider>
  ),
};

/**
 * Info Toast Story
 */
export const InfoToast: Story = {
  args: { children: null },
  render: () => (
    <ToastProvider>
      <ToastDemo autoShow toastType="info" />
    </ToastProvider>
  ),
};

/**
 * Multiple Toasts Stacked
 */
const MultipleToastsDemo: React.FC = () => {
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  const [isShown, setIsShown] = useState(false);

  React.useEffect(() => {
    if (!isShown) {
      setTimeout(() => showSuccess('Første notifikasjon'), 100);
      setTimeout(() => showWarning('Andre notifikasjon'), 600);
      setTimeout(() => showInfo('Tredje notifikasjon'), 1100);
      setTimeout(() => showError('Fjerde notifikasjon'), 1600);
      setIsShown(true);
    }
  }, [isShown, showSuccess, showWarning, showInfo, showError]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Stablede Toast Notifikasjoner</h2>
      <p>Flere notifikasjoner vises stabelvis på samme sted.</p>
    </div>
  );
};

export const MultipleToasts: Story = {
  args: { children: null },
  render: () => (
    <ToastProvider>
      <MultipleToastsDemo />
    </ToastProvider>
  ),
};

/**
 * Manual Dismiss
 */
const ManualDismissDemo: React.FC = () => {
  const { showToast } = useToast();

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Manuell Avvisning</h2>
      <Button
        variant="secondary"
        onClick={() => showToast('Denne notifikasjonen autovises ikke', 'info', 0)}
      >
        Vis Toast uten Auto-Dismiss
      </Button>
      <p style={{ marginTop: '1rem', color: '#666' }}>
        Klikk lukk-knappen (X) for å avvise notifikasjonen.
      </p>
    </div>
  );
};

export const ManualDismiss: Story = {
  args: { children: null },
  render: () => (
    <ToastProvider>
      <ManualDismissDemo />
    </ToastProvider>
  ),
};

/**
 * Interactive Demo
 */
export const Interactive: Story = {
  args: { children: null },
  render: () => (
    <ToastProvider>
      <ToastDemo />
    </ToastProvider>
  ),
};
