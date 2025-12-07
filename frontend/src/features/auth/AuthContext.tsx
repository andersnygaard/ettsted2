import { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import client from '../../shared/api/client';
import { clearAuthToken, getAuthData, setDemoToken, getDemoToken, isDevLoggedOut, setDevLoggedOut, clearDevLogout } from '../../shared/api/authToken';
import { isStatusCode } from '../../shared/utils/errorTypes';
import type { User, AuthContextType } from './types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isDevelopment = import.meta.env.VITE_APP_ENV === 'development';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [hasEasyAuthSession, setHasEasyAuthSession] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      // First check if we have an auth session (demo or EasyAuth)
      let hasSession = false;
      if (isDevelopment) {
        // In development, check if user explicitly logged out
        hasSession = !isDevLoggedOut();
      } else {
        // Check for demo token first, then EasyAuth
        const demoToken = getDemoToken();
        if (demoToken) {
          hasSession = true;
        } else {
          const authData = await getAuthData();
          hasSession = authData !== null;
        }
      }
      setHasEasyAuthSession(hasSession);

      if (!hasSession) {
        // No EasyAuth session - user needs to log in
        setUser(null);
        setNeedsOnboarding(false);
        return;
      }

      // We have an EasyAuth session - check if user exists in our DB
      const response = await client.get('/users/me');

      if (response.data.success && response.data.data) {
        setUser(response.data.data);
        setNeedsOnboarding(false);
      } else {
        setUser(null);
        setNeedsOnboarding(true);
      }
    } catch (error: unknown) {
      // Handle different error cases
      if (isStatusCode(error, 404)) {
        // User authenticated via EasyAuth but not in our database
        // This means they need to complete onboarding
        setUser(null);
        setNeedsOnboarding(true);
      } else if (isStatusCode(error, 401)) {
        // Not authenticated at all
        setUser(null);
        setHasEasyAuthSession(false);
        setNeedsOnboarding(false);
      } else {
        // Network or other error - preserve current state
        console.error('Error fetching user:', error);
        setUser(null);
        setNeedsOnboarding(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const refreshUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  const login = async (provider: 'google' | 'facebook', returnUrl = '/auth/callback') => {
    // Clear dev logout flag so session works again
    clearDevLogout();

    if (isDevelopment) {
      // In development, backend auto-injects dev user - just fetch and redirect
      await fetchUser();
      window.location.href = returnUrl;
      return;
    }
    window.location.href = `/.auth/login/${provider}?post_login_redirect_uri=${encodeURIComponent(returnUrl)}`;
  };

  const demoLogin = async () => {
    // Clear dev logout flag so session works
    clearDevLogout();

    try {
      // Call demo-login endpoint
      const response = await client.post('/auth/demo-login');

      if (response.data.success && response.data.data?.token) {
        // Store the demo token
        setDemoToken(response.data.data.token);

        // Fetch user data with the new token
        await fetchUser();

        // Redirect to dashboard
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Demo login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    // Clear cached auth token
    clearAuthToken();
    setUser(null);
    setHasEasyAuthSession(false);
    setNeedsOnboarding(false);

    if (isDevelopment) {
      // Mark as logged out so dev mode respects logout
      setDevLoggedOut();
      window.location.href = '/';
      return;
    }
    window.location.href = '/.auth/logout';
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    hasEasyAuthSession,
    needsOnboarding,
    login,
    demoLogin,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
