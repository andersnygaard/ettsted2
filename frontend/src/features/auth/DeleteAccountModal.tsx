import { useState } from 'react';
import { ApiError } from '../../shared/api/client';
import './DeleteAccountModal.css';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => Promise<void>;
  isLoading?: boolean;
}

/**
 * DeleteAccountModal component
 *
 * GDPR-compliant account deletion modal. Requires user to type "SLETT"
 * to confirm deletion, with clear warning about data loss.
 */
export function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirmDelete,
  isLoading = false
}: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const isConfirmed = confirmText.toUpperCase() === 'SLETT';

  const handleDelete = async () => {
    setError(null);
    setIsDeleting(true);

    try {
      await onConfirmDelete();
    } catch (err) {
      const errorMessage = err instanceof ApiError
        ? err.message
        : 'En feil oppstod ved sletting av konto. Prøv igjen senere.';
      setError(errorMessage);
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting && !isLoading) {
      setConfirmText('');
      setError(null);
      onClose();
    }
  };

  return (
    <div className="delete-account-modal-overlay" onClick={handleClose}>
      <div className="delete-account-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="delete-account-modal__close"
          onClick={handleClose}
          aria-label="Lukk"
          disabled={isDeleting || isLoading}
        >
          ×
        </button>

        <div className="delete-account-modal__content">
          <h2 className="delete-account-modal__title">Slett konto</h2>

          <div className="delete-account-modal__warning">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="delete-account-modal__warning-icon"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <p className="delete-account-modal__warning-text">
              Er du sikker? Alle data vil bli permanent slettet og kan ikke gjenopprettes.
            </p>
          </div>

          <div className="delete-account-modal__form">
            <label htmlFor="confirm-text" className="delete-account-modal__label">
              Skriv inn <strong>SLETT</strong> for å bekrefte sletting
            </label>
            <input
              id="confirm-text"
              type="text"
              className="delete-account-modal__input"
              placeholder="SLETT"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              disabled={isDeleting || isLoading}
              autoComplete="off"
            />
          </div>

          {error && (
            <div className="delete-account-modal__error" role="alert">
              {error}
            </div>
          )}

          <div className="delete-account-modal__actions">
            <button
              type="button"
              className="delete-account-modal__btn delete-account-modal__btn--cancel"
              onClick={handleClose}
              disabled={isDeleting || isLoading}
            >
              Avbryt
            </button>
            <button
              type="button"
              className="delete-account-modal__btn delete-account-modal__btn--delete"
              onClick={handleDelete}
              disabled={!isConfirmed || isDeleting || isLoading}
              aria-busy={isDeleting || isLoading}
            >
              {isDeleting || isLoading ? 'Sletter...' : 'Slett konto'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
