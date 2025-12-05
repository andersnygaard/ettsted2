import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Avatar } from '@finans/components';
import { useAuth } from '../../features/auth/useAuth';
import { DeleteAccountModal } from '../../features/auth/DeleteAccountModal';
import { AvatarMenu } from './AvatarMenu';
import client from '../../shared/api/client';
import './AppHeader.css';

/**
 * App Header Component
 *
 * Main navigation header with logo, navigation tabs, and user avatar.
 * Shows full nav for authenticated users, login button for guests.
 * Collapses to hamburger menu on mobile with flyout from right.
 * Based on Nordic Minimal design system.
 */
export default function AppHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Navigation items with paths (only shown when authenticated)
  const navItems = [
    { label: 'Oversikt', path: '/dashboard' },
    { label: 'Portefølje', path: '/portfolio' },
    { label: 'Sparing', path: '/sparing' },
    { label: 'Gjeld', path: '/gjeld' },
    { label: 'Pensjon', path: '/pensjon' },
    { label: 'Kalkulatorer', path: '/kalkulatorer' },
  ];

  // Check if a path is active
  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  // Get user initials from nickname or fallback to "AN"
  const getUserInitials = () => {
    if (!user || !user.nickname) {
      return 'AN';
    }
    const parts = user.nickname.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return user.nickname.slice(0, 2).toUpperCase();
  };

  // Close mobile menu on outside click or escape
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, [mobileMenuOpen]);

  const handleMobileNavClick = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  const handleMobileEconomyClick = () => {
    setMobileMenuOpen(false);
    navigate('/economy');
  };

  const handleMobileLogout = () => {
    setMobileMenuOpen(false);
    logout();
  };

  const handleDeleteAccountClick = () => {
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeletingAccount(true);
    try {
      await client.delete('/users/me');
      // Account deleted successfully - logout and redirect to home
      logout();
      navigate('/');
    } catch (error) {
      setIsDeletingAccount(false);
      throw error;
    }
  };

  return (
    <>
      <header className="app-header">
        <div className="app-header__container">
          <Link to="/" className="app-header__logo">
            {'finans.\nettsted.no'}
          </Link>

          {isAuthenticated && (
            <>
              <nav className="app-header__nav">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`app-header__nav-item ${isActive(item.path) ? 'active' : ''}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="app-header__avatar">
                <AvatarMenu
                  initials={getUserInitials()}
                  onEconomyClick={() => navigate('/economy')}
                  onLogout={logout}
                  onDeleteAccount={handleDeleteAccountClick}
                />
              </div>

              {/* Mobile hamburger button */}
              <button
                className="app-header__hamburger"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Åpne meny"
                aria-expanded={mobileMenuOpen}
                type="button"
              >
                <span className="app-header__hamburger-line" />
                <span className="app-header__hamburger-line" />
                <span className="app-header__hamburger-line" />
              </button>
            </>
          )}
        </div>
      </header>

      {/* Mobile menu overlay and panel */}
      {isAuthenticated && (
        <>
          <div
            className={`app-header__mobile-overlay ${mobileMenuOpen ? 'open' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            ref={mobileMenuRef}
            className={`app-header__mobile-menu ${mobileMenuOpen ? 'open' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label="Navigasjonsmeny"
          >
            {/* Mobile menu header with avatar */}
            <div className="app-header__mobile-header">
              <Avatar initials={getUserInitials()} size="medium" />
              <span className="app-header__mobile-nickname">{user?.nickname || 'Bruker'}</span>
              <button
                className="app-header__mobile-close"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Lukk meny"
                type="button"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Navigation items */}
            <nav className="app-header__mobile-nav">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  className={`app-header__mobile-nav-item ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => handleMobileNavClick(item.path)}
                  type="button"
                >
                  {item.label}
                </button>
              ))}

              {/* Economy settings */}
              <div className="app-header__mobile-divider" />
              <button
                className="app-header__mobile-nav-item"
                onClick={handleMobileEconomyClick}
                type="button"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v12" />
                  <path d="M15 9.5c0-1.5-1.5-2.5-3-2.5s-3 1-3 2.5 1.5 2.5 3 2.5 3 1 3 2.5-1.5 2.5-3 2.5" />
                </svg>
                Min økonomi
              </button>
            </nav>

            {/* Logout at bottom */}
            <div className="app-header__mobile-footer">
              <button
                className="app-header__mobile-logout"
                onClick={handleMobileLogout}
                type="button"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logg ut
              </button>
            </div>
          </div>
        </>
      )}

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={handleConfirmDelete}
        isLoading={isDeletingAccount}
      />
    </>
  );
}
