import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';
import { AvatarMenu } from './AvatarMenu';
import './AppHeader.css';

/**
 * App Header Component
 *
 * Main navigation header with logo, navigation tabs, and user avatar.
 * Shows full nav for authenticated users, login button for guests.
 * Based on Nordic Minimal design system.
 */
export default function AppHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

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

  return (
    <>
      <header className="app-header">
        <div className="app-header__container">
          <Link to="/" className="app-header__logo">
            {isAuthenticated ? 'finans.' : 'finans.ettsted.no'}
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
                />
              </div>
            </>
          )}
        </div>
      </header>
    </>
  );
}
