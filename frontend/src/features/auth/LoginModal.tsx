/**
 * LoginModal Component
 *
 * Modal dialog with Google/Facebook OAuth login buttons.
 * Triggered from HomePage for quick login access.
 */

import { useEffect, useCallback } from 'react';
import './LoginModal.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  // Handle escape key to close modal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    window.location.href = '/.auth/login/google?post_login_redirect_uri=/dashboard';
  };

  const handleFacebookLogin = () => {
    window.location.href = '/.auth/login/facebook?post_login_redirect_uri=/dashboard';
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="login-modal__backdrop" onClick={handleBackdropClick}>
      <div className="login-modal" role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
        <button
          type="button"
          className="login-modal__close"
          onClick={onClose}
          aria-label="Lukk"
        >
          <i>close</i>
        </button>

        <div className="login-modal__content">
          <h2 id="login-modal-title" className="login-modal__title">
            Logg inn
          </h2>
          <p className="login-modal__subtitle">
            Velg hvordan du vil logge inn
          </p>

          <div className="login-modal__buttons">
            <button
              type="button"
              className="login-modal__btn login-modal__btn--google"
              onClick={handleGoogleLogin}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Fortsett med Google</span>
            </button>

            <button
              type="button"
              className="login-modal__btn login-modal__btn--facebook"
              onClick={handleFacebookLogin}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                />
              </svg>
              <span>Fortsett med Facebook</span>
            </button>
          </div>

          <p className="login-modal__terms">
            Ved å logge inn godtar du våre vilkår og personvernregler
          </p>
        </div>
      </div>
    </div>
  );
}
