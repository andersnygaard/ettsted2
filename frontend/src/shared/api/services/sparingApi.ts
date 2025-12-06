import client from '../client';
import type { ApiResponse } from '../../types';

/**
 * Response from /api/v1/sparing endpoint
 *
 * Aggregated sparing/F.I.R.E. metrics calculated from snapshots
 */
export interface SparingResponse {
  sumSparing: number;
  sparerate: number;
  monthsFree: number;
  fireNumber: number;
  fireProgress: number;
  history: Array<{ date: string; value: number }>;
}

/**
 * Sparing API service layer
 *
 * Provides typed methods for sparing/F.I.R.E. related API calls.
 * All methods return unwrapped data (not ApiResponse wrapper).
 */
export const sparingApi = {
  /**
   * Get aggregated sparing and F.I.R.E. metrics
   *
   * Calculates from all snapshots in user's portfolio:
   * - Total savings across all sparing accounts
   * - Savings rate (income vs expenses)
   * - Months of expenses covered by savings
   * - F.I.R.E. number (25x annual expenses)
   * - Progress toward F.I.R.E. as percentage
   * - Historical values for charting
   *
   * @returns Sparing metrics and historical data
   */
  getSummary: async (): Promise<SparingResponse> => {
    const response = await client.get<ApiResponse<SparingResponse>>('/sparing');
    return response.data.data;
  }
};
