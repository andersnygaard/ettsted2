import { useState, useRef, useEffect } from 'react';
import { Avatar } from '@finans/components';
import './AvatarMenu.css';

export interface AvatarMenuProps {
  initials: string;
  onEconomyClick: () => void;
  onLogout: () => void;
  onDeleteAccount?: () => void;
}

/**
 * Avatar with dropdown menu
 *
 * Shows user avatar with a dropdown menu containing economy setup and logout options.
 * Menu closes on outside click or Escape key.
 */
export function AvatarMenu({ initials, onEconomyClick, onLogout, onDeleteAccount }: AvatarMenuProps) {
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

  const handleEconomyClick = () => {
    setIsOpen(false);
    onEconomyClick();
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    onLogout();
  };

  const handleDeleteClick = () => {
    setIsOpen(false);
    onDeleteAccount?.();
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
            onClick={handleEconomyClick}
            role="menuitem"
            type="button"
          >
            <span className="avatar-menu__icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v12" />
                <path d="M15 9.5c0-1.5-1.5-2.5-3-2.5s-3 1-3 2.5 1.5 2.5 3 2.5 3 1 3 2.5-1.5 2.5-3 2.5" />
              </svg>
            </span>
            Min økonomi
          </button>
          <div className="avatar-menu__divider" />
          {onDeleteAccount && (
            <>
              <button
                className="avatar-menu__item avatar-menu__item--danger"
                onClick={handleDeleteClick}
                role="menuitem"
                type="button"
              >
                <span className="avatar-menu__icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </span>
                Slett konto
              </button>
              <div className="avatar-menu__divider" />
            </>
          )}
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
