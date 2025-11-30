import { useState, useRef, useEffect } from 'react';
import { Avatar } from './Avatar';
import './AvatarMenu.css';

export interface AvatarMenuProps {
  initials: string;
  onProfileClick: () => void;
  onLogout: () => void;
}

/**
 * Avatar with dropdown menu
 *
 * Shows user avatar with a dropdown menu containing profile and logout options.
 * Menu closes on outside click or Escape key.
 */
export function AvatarMenu({ initials, onProfileClick, onLogout }: AvatarMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    onProfileClick();
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    onLogout();
  };

  return (
    <div className="avatar-menu" ref={menuRef}>
      <button
        className="avatar-menu__trigger"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        type="button"
      >
        <Avatar initials={initials} size="medium" />
      </button>

      {isOpen && (
        <div className="avatar-menu__dropdown" role="menu">
          <button
            className="avatar-menu__item"
            onClick={handleProfileClick}
            role="menuitem"
            type="button"
          >
            <span className="avatar-menu__icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            Min informasjon
          </button>
          <div className="avatar-menu__divider" />
          <button
            className="avatar-menu__item avatar-menu__item--danger"
            onClick={handleLogoutClick}
            role="menuitem"
            type="button"
          >
            <span className="avatar-menu__icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </span>
            Logg ut
          </button>
        </div>
      )}
    </div>
  );
}
