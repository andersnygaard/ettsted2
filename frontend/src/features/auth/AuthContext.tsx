import { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import client from '../../shared/api/client';
import { clearAuthToken } from '../../shared/api/authToken';
import type { User, AuthContextType } from './types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isDevelopment = import.meta.env.VITE_APP_ENV === 'development';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const response = await client.get('/users/me');

      if (response.data.success && response.data.data) {
        setUser(response.data.data);
      } else {
        setUser(null);
      }
    } catch (error: any) {
      // Handle different error cases
      if (error.response?.status === 404) {
        // User authenticated via EasyAuth but not in our database
        // This means they need to complete onboarding
        setUser(null);
      } else if (error.response?.status === 401) {
        // Not authenticated at all
        setUser(null);
      } else {
        // Network or other error
        console.error('Error fetching user:', error);
        setUser(null);
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

  const login = async (provider: 'google' | 'facebook', returnUrl = '/dashboard') => {
    if (isDevelopment) {
      // In development, backend auto-injects dev user - just fetch and redirect
      await fetchUser();
      window.location.href = returnUrl;
      return;
    }
    window.location.href = `/.auth/login/${provider}?post_login_redirect_uri=${encodeURIComponent(returnUrl)}`;
  };

  const logout = () => {
    // Clear cached auth token
    clearAuthToken();
    setUser(null);

    if (isDevelopment) {
      window.location.href = '/';
      return;
    }
    window.location.href = '/.auth/logout';
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
