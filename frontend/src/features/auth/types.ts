export interface User {
  id: string;
  username: string;
  email?: string;
  provider?: 'google' | 'facebook';
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (provider: 'google' | 'facebook') => void;
  logout: () => void;
}
