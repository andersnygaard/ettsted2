import { createContext, useState, useEffect, ReactNode } from 'react';
import client from '../../shared/api/client';
import type { User, AuthContextType } from './types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch user from our API (which validates EasyAuth internally)
    const fetchUser = async () => {
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

          // In development, create a mock user for testing
          if (import.meta.env.VITE_APP_ENV === 'development') {
            setUser({
              id: 'dev-user-123',
              username: 'devuser',
              email: 'dev@example.com',
            });
          } else {
            setUser(null);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = (provider: 'google' | 'facebook') => {
    window.location.href = `/.auth/login/${provider}`;
  };

  const logout = () => {
    window.location.href = '/.auth/logout';
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
