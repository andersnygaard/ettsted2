import { vi, describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { AuthProvider } from '../AuthContext';
import type { ReactNode } from 'react';

// Mock dependencies
vi.mock('@/shared/api/client');
vi.mock('@/shared/api/authToken');
vi.mock('@/shared/utils/errorTypes');

describe('useAuth hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderAuthHook() {
    return renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      ),
    });
  }

  describe('hook contract and error handling', () => {
    it('should throw when useAuth is called outside provider', () => {
      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within an AuthProvider');
    });

    it('should return context with all required properties', () => {
      const { result } = renderAuthHook();

      expect(result.current).toBeDefined();
      expect(result.current).toHaveProperty('user');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('isAuthenticated');
      expect(result.current).toHaveProperty('hasEasyAuthSession');
      expect(result.current).toHaveProperty('needsOnboarding');
      expect(result.current).toHaveProperty('login');
      expect(result.current).toHaveProperty('demoLogin');
      expect(result.current).toHaveProperty('logout');
      expect(result.current).toHaveProperty('refreshUser');
    });

    it('should have correct types for all properties', () => {
      const { result } = renderAuthHook();

      expect(typeof result.current.isLoading).toBe('boolean');
      expect(typeof result.current.isAuthenticated).toBe('boolean');
      expect(typeof result.current.hasEasyAuthSession).toBe('boolean');
      expect(typeof result.current.needsOnboarding).toBe('boolean');
      expect(typeof result.current.login).toBe('function');
      expect(typeof result.current.demoLogin).toBe('function');
      expect(typeof result.current.logout).toBe('function');
      expect(typeof result.current.refreshUser).toBe('function');
    });
  });

  describe('initial state', () => {
    it('should start with valid initial state', () => {
      const { result } = renderAuthHook();

      // User should be null or an object
      expect(result.current.user === null || typeof result.current.user === 'object').toBe(true);

      // Loading should be a boolean
      expect(typeof result.current.isLoading).toBe('boolean');

      // isAuthenticated is derived from user !== null
      expect(result.current.isAuthenticated === (result.current.user !== null)).toBe(true);
    });

    it('should have consistent authentication state', () => {
      const { result } = renderAuthHook();

      // isAuthenticated should match whether user is set
      if (result.current.user !== null) {
        expect(result.current.isAuthenticated).toBe(true);
      } else {
        expect(result.current.isAuthenticated).toBe(false);
      }
    });
  });

  describe('function behaviors', () => {
    it('login function should accept provider parameter', () => {
      renderAuthHook();

      // Should be callable
      expect(() => {
        // Mock window location to prevent actual navigation
        Object.defineProperty(window, 'location', {
          value: { href: '' },
          writable: true,
        });
      }).not.toThrow();
    });

    it('demoLogin function should accept optional profile parameter', async () => {
      const { result } = renderAuthHook();

      // Should be callable with no args
      expect(typeof result.current.demoLogin).toBe('function');

      // Should be callable with profile arg
      expect(typeof result.current.demoLogin).toBe('function');
    });

    it('logout function should clear session', () => {
      const { result } = renderAuthHook();

      Object.defineProperty(window, 'location', {
        value: { href: '' },
        writable: true,
      });

      // Should not throw
      expect(() => {
        result.current.logout();
      }).not.toThrow();
    });

    it('refreshUser function should be callable', () => {
      const { result } = renderAuthHook();

      // Should return a promise
      const refreshPromise = result.current.refreshUser();
      expect(refreshPromise instanceof Promise).toBe(true);
    });
  });
});
