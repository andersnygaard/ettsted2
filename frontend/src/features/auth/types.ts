export interface UserProfile {
  monthlySalary: number;
  monthlySavings?: number;
  annualExpenses: number;
  birthYear: number;
  plannedRetirementAge: number;
  fireNumber?: number;
}

export interface LoanDetails {
  interestRate: number;
  remainingYears: number;
  originalAmount?: number;
}

export interface AccountConfig {
  id: string;
  name: string;
  category: 'sparing' | 'gjeld' | 'pensjon';
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  loanDetails?: LoanDetails;
}

export interface User {
  id: string;
  nickname: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  profile: UserProfile;
  accounts: AccountConfig[];
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasEasyAuthSession: boolean;
  needsOnboarding: boolean;
  login: (provider: 'google' | 'facebook', returnUrl?: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}
