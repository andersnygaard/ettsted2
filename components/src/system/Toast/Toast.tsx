import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import ReactDOM from 'react-dom';

/**
 * Toast Notification System
 *
 * Simple toast component for displaying error/success/info messages.
 * Uses BeerCSS snackbar styling with Norwegian text.
 */

export type ToastType = 'error' | 'success' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  showInfo: (message: string) => void;
  showWarning: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Hook to show toast notifications
 */
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

/**
 * Individual Toast Component
 */
const ToastItem: React.FC<{
  toast: Toast;
  onClose: (id: string) => void;
}> = ({ toast, onClose }) => {
  const getIcon = (): string => {
    switch (toast.type) {
      case 'error':
        return 'error';
      case 'success':
        return 'check_circle';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  };

  const getClass = (): string => {
    switch (toast.type) {
      case 'error':
        return 'red';
      case 'success':
        return 'green';
      case 'warning':
        return 'amber';
      case 'info':
      default:
        return 'blue';
    }
  };

  return (
    <div className={`snackbar ${getClass()} white-text`} style={{ marginBottom: '1rem' }}>
      <i>{getIcon()}</i>
      <span>{toast.message}</span>
      <button
        className="transparent"
        onClick={() => onClose(toast.id)}
        aria-label="Lukk"
      >
        <i>close</i>
      </button>
    </div>
  );
};

/**
 * Toast Container Component
 */
const ToastContainer: React.FC<{ toasts: Toast[]; onClose: (id: string) => void }> = ({
  toasts,
  onClose,
}) => {
  if (toasts.length === 0) return null;

  const container = (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 9999,
        maxWidth: '400px',
        width: '100%',
      }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );

  // Render using portal to avoid z-index issues
  return ReactDOM.createPortal(container, document.body);
};

/**
 * Toast Provider Component
 */
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration: number = 5000) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const toast: Toast = { id, message, type, duration };

      setToasts((prev) => [...prev, toast]);

      // Auto-dismiss after duration
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const showError = useCallback(
    (message: string) => showToast(message, 'error'),
    [showToast]
  );

  const showSuccess = useCallback(
    (message: string) => showToast(message, 'success'),
    [showToast]
  );

  const showInfo = useCallback(
    (message: string) => showToast(message, 'info'),
    [showToast]
  );

  const showWarning = useCallback(
    (message: string) => showToast(message, 'warning'),
    [showToast]
  );

  const contextValue: ToastContextType = {
    showToast,
    showError,
    showSuccess,
    showInfo,
    showWarning,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
};
