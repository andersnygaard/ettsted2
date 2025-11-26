import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchAuthUser, type AuthUser } from '../utils/auth';
import { useTheme } from '../contexts/ThemeContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isDark, toggleTheme } = useTheme();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetchAuthUser().then(user => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  const handleLogout = () => {
    window.location.href = '/.auth/logout';
  };

  const getUserName = () => {
    if (!user) return 'User';
    return user.givenName && user.familyName
      ? `${user.givenName} ${user.familyName}`
      : user.userDetails || user.userId || 'User';
  };

  const getInitials = () => {
    const name = getUserName();
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getProfileImage = (): string | null => {
    if (!user?.userId) return null;
    const seed = Math.abs(user.userId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)).toString();
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
  };

  const isActive = (path: string) => location.pathname === path;

  const profileImage = getProfileImage();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        background: 'var(--primary)',
        color: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <nav style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px'
        }}>
          {/* Mobile hamburger + links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '0.5rem',
                display: 'none'
              }}
              className="mobile-menu-btn"
            >
              ☰
            </button>

            {/* Nav links */}
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }} className="nav-links">
              <Link
                to="/dashboard"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: isActive('/dashboard') ? 'bold' : 'normal',
                  borderBottom: isActive('/dashboard') ? '2px solid white' : 'none',
                  paddingBottom: '0.25rem',
                  transition: 'opacity 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
              >
                Hjem
              </Link>
              <Link
                to="/calculator"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: isActive('/calculator') ? 'bold' : 'normal',
                  borderBottom: isActive('/calculator') ? '2px solid white' : 'none',
                  paddingBottom: '0.25rem',
                  transition: 'opacity 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
              >
                Kalkulatorer
              </Link>
            </div>
          </div>

          {/* Theme toggle switch */}
          <label className="switch icon" title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
            <input
              type="checkbox"
              checked={isDark}
              onChange={toggleTheme}
            />
            <span>
              <i>{isDark ? 'dark_mode' : 'light_mode'}</i>
            </span>
          </label>

          {/* Avatar / Loading skeleton */}
          <div style={{ position: 'relative' }}>
            {loading ? (
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.3)',
                animation: 'pulse 1.5s ease-in-out infinite'
              }} />
            ) : user ? (
              <div
                onClick={() => setAvatarDropdownOpen(!avatarDropdownOpen)}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                className="avatar-container"
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={getUserName()}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid rgba(255, 255, 255, 0.5)'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    border: '2px solid rgba(255, 255, 255, 0.5)'
                  }}>
                    {getInitials()}
                  </div>
                )}
              </div>
            ) : null}

            {/* Desktop dropdown */}
            {avatarDropdownOpen && user && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '0.5rem',
                  background: 'var(--surface)',
                  color: 'var(--on-surface)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  minWidth: '200px',
                  padding: '0.5rem',
                  animation: 'fadeSlideIn 0.2s ease',
                  zIndex: 1001
                }}
                className="avatar-dropdown"
              >
                <div style={{ padding: '0.5rem', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                  <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.9rem' }}>
                    {getUserName()}
                  </p>
                  <p style={{ margin: '0.25rem 0 0 0', opacity: 0.7, fontSize: '0.8rem' }}>
                    {user.identityProvider || 'Autentisert'}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: 'none',
                    background: 'none',
                    color: '#d32f2f',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    textAlign: 'left',
                    borderRadius: '4px',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                >
                  Logg ut
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.2)',
              padding: '1rem',
              animation: 'fadeSlideIn 0.2s ease'
            }}
            className="mobile-menu"
          >
            {user && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={getUserName()}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid rgba(255, 255, 255, 0.5)'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    border: '2px solid rgba(255, 255, 255, 0.5)'
                  }}>
                    {getInitials()}
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1rem' }}>
                    {getUserName()}
                  </p>
                  <p style={{ margin: '0.25rem 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>
                    {user.identityProvider || 'Autentisert'}
                  </p>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: 'none',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
            >
              Logg ut
            </button>
          </div>
        )}
      </header>

      {/* Close dropdown when clicking outside */}
      {avatarDropdownOpen && (
        <div
          onClick={() => setAvatarDropdownOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
        />
      )}

      {/* Main content */}
      <main style={{ flex: 1 }}>
        {children}
      </main>

      {/* Inline styles for animations and responsive */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block !important;
          }
          .avatar-container {
            display: none !important;
          }
          .avatar-dropdown {
            display: none !important;
          }
        }

        @media (min-width: 769px) {
          .mobile-menu {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
