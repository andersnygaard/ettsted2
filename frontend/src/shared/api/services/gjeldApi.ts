import client from '../client';
import type { ApiResponse } from '../../types';

/**
 * Response from /api/v1/gjeld endpoint
 *
 * Aggregated debt metrics calculated from snapshots
 */
export interface GjeldResponse {
  sumGjeld: number;
  dekning: number;
  remaining: number;
  history: Array<{ date: string; value: number }>;
  loans: Array<{ name: string; value: number }>;
}

/**
 * Gjeld (debt) API service layer
 *
 * Provides typed methods for gjeld/debt related API calls.
 * All methods return unwrapped data (not ApiResponse wrapper).
 */
export const gjeldApi = {
  /**
   * Get aggregated gjeld (debt) metrics
   *
   * Calculates from all snapshots in user's portfolio:
   * - Total debt across all gjeld accounts
   * - Coverage ratio (dekning) - savings/debt percentage
   * - Remaining uncovered debt
   * - Individual loan details
   * - Historical values for charting
   *
   * @returns Gjeld metrics and historical data
   */
  getSummary: async (): Promise<GjeldResponse> => {
    const response = await client.get<ApiResponse<GjeldResponse>>('/gjeld');
    return response.data.data;
  }
};
