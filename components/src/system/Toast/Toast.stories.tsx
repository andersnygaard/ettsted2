import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ToastProvider, useToast } from './Toast';

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
        <button
          className="green"
          onClick={() => showSuccess('Operasjonen var vellykket!')}
        >
          <i>check</i>
          <span>VisSuccess</span>
        </button>
        <button
          className="red"
          onClick={() => showError('En feil oppstod. Vennligst prøv igjen.')}
        >
          <i>error</i>
          <span>Vis Error</span>
        </button>
        <button
          className="amber"
          onClick={() => showWarning('Advarsel: Dette kan ikke angres.')}
        >
          <i>warning</i>
          <span>Vis Warning</span>
        </button>
        <button
          className="blue"
          onClick={() => showInfo('Informasjon: Systemet er oppdatert.')}
        >
          <i>info</i>
          <span>Vis Info</span>
        </button>
        <button
          className="outline"
          onClick={() => showToast('Egendefinert melding', 'success', 3000)}
        >
          <i>timer</i>
          <span>Tilpasset (3s)</span>
        </button>
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
      <button
        onClick={() => showToast('Denne notifikasjonen autovises ikke', 'info', 0)}
      >
        <i>close</i>
        <span>Vis Toast uten Auto-Dismiss</span>
      </button>
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
