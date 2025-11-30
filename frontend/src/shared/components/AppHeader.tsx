import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';
import { AvatarMenu } from './AvatarMenu';
import { ProfileModal } from './ProfileModal';
import { AccountsModal } from './AccountsModal';
import './AppHeader.css';

/**
 * App Header Component
 *
 * Main navigation header with logo, navigation tabs, and user avatar.
 * Based on Nordic Minimal design system.
 */
export default function AppHeader() {
  const location = useLocation();
  const { user, logout, refreshUser } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAccountsModalOpen, setIsAccountsModalOpen] = useState(false);

  // Navigation items with paths
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

  return (
    <>
      <header className="app-header">
        <div className="app-header__container">
          <Link to="/" className="app-header__logo">
            finans
          </Link>

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
              onProfileClick={() => setIsProfileModalOpen(true)}
              onAccountsClick={() => setIsAccountsModalOpen(true)}
              onLogout={logout}
            />
          </div>
        </div>
      </header>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={user?.profile}
        onSaved={refreshUser}
      />

      <AccountsModal
        isOpen={isAccountsModalOpen}
        onClose={() => setIsAccountsModalOpen(false)}
        accounts={user?.accounts}
        onSaved={refreshUser}
      />
    </>
  );
}
