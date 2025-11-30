export interface UserProfile {
  monthlySalary: number;
  annualExpenses: number;
  birthYear: number;
  plannedRetirementAge: number;
  fireNumber?: number;
}

export interface User {
  id: string;
  username: string;
  nickname?: string;
  email?: string;
  provider?: 'google' | 'facebook';
  profile?: UserProfile;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (provider: 'google' | 'facebook') => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}
