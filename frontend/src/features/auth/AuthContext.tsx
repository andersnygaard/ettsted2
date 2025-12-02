import { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import client from '../../shared/api/client';
import type { User, AuthContextType } from './types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

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

        // In development, create a mock user for testing
        if (import.meta.env.VITE_APP_ENV === 'development') {
          setUser({
            id: 'dev-user-123',
            nickname: 'devuser',
            email: 'dev@example.com',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            profile: {
              monthlySalary: 0,
              annualExpenses: 0,
              birthYear: 1990,
              plannedRetirementAge: 67,
            },
            accounts: [],
          });
        } else {
          setUser(null);
        }
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

  const login = (provider: 'google' | 'facebook') => {
    window.location.href = `/.auth/login/${provider}`;
  };

  const logout = () => {
    setIsDemo(false);
    window.location.href = '/.auth/logout';
  };

  const loginAsDemo = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await client.post('/auth/demo-login');

      if (response.data.success && response.data.data?.user) {
        setUser(response.data.data.user);
        setIsDemo(true);
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Demo login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    isDemo,
    login,
    loginAsDemo,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
