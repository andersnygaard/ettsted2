import client from '../client';
import type { ApiResponse } from '../../types';

/**
 * User object returned from API
 *
 * Mirrors the backend User model for type safety
 */
export interface User {
  id: string;
  nickname: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  profile?: {
    monthlySalary?: number;
    monthlySavings?: number;
    annualExpenses?: number;
    birthYear?: number;
    plannedRetirementAge?: number;
    fireNumber?: number;
  };
  accounts?: {
    id: string;
    name: string;
    category: 'sparing' | 'gjeld' | 'pensjon';
    isActive: boolean;
    sortOrder: number;
    createdAt: string;
    loanDetails?: {
      interestRate: number;
      remainingYears: number;
      originalAmount?: number;
    };
    isPublicPension?: boolean;
    isPrimaryResidence?: boolean;
  }[];
}

/**
 * User API service layer
 *
 * Provides typed methods for all user-related API calls.
 * All methods return unwrapped data (not ApiResponse wrapper).
 */
export const userApi = {
  /**
   * Get current authenticated user
   *
   * @returns Current user or null if not authenticated
   */
  getMe: async (): Promise<User | null> => {
    try {
      const response = await client.get<ApiResponse<User>>('/users/me');
      return response.data.data;
    } catch (error) {
      // User not authenticated
      return null;
    }
  },

  /**
   * First-time user setup
   *
   * Initialize user profile with nickname and email
   *
   * @param data Setup data
   * @returns Created user
   */
  setup: async (data: { nickname: string; email?: string }): Promise<User> => {
    const response = await client.post<ApiResponse<User>>('/users/me/setup', data);
    return response.data.data;
  },

  /**
   * Update user settings
   *
   * @param data Partial user data to update
   * @returns Updated user
   */
  update: async (data: Partial<{ email: string; preferences: Record<string, unknown> }>): Promise<User> => {
    const response = await client.patch<ApiResponse<User>>('/users/me', data);
    return response.data.data;
  },

  /**
   * Update user profile (financial planning settings)
   *
   * @param profile Partial profile data to update
   * @returns Updated user
   */
  updateProfile: async (profile: Partial<{
    monthlySalary: number;
    monthlySavings: number;
    annualExpenses: number;
    birthYear: number;
    plannedRetirementAge: number;
    fireNumber: number;
  }>): Promise<User> => {
    const response = await client.patch<ApiResponse<User>>('/users/me', { profile });
    return response.data.data;
  }
};
