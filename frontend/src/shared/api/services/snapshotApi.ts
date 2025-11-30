import client from '../client';
import type { MonthlySnapshot, ApiResponse } from '../../types';

/**
 * Query options for snapshot list fetching
 */
export interface SnapshotQueryOptions {
  orderBy?: 'date' | 'createdAt';
  ascending?: boolean;
  limit?: number;
}

/**
 * Snapshot API service layer
 *
 * Provides typed methods for all snapshot-related API calls.
 * All methods return unwrapped data (not ApiResponse wrapper).
 */
export const snapshotApi = {
  /**
   * Get all snapshots for authenticated user
   *
   * @param options Optional query parameters
   * @returns Array of monthly snapshots
   */
  getAll: async (options?: SnapshotQueryOptions): Promise<MonthlySnapshot[]> => {
    const params = new URLSearchParams();
    if (options?.orderBy) params.set('orderBy', options.orderBy);
    if (options?.ascending !== undefined) params.set('ascending', String(options.ascending));
    if (options?.limit) params.set('limit', String(options.limit));

    const response = await client.get<ApiResponse<MonthlySnapshot[]>>(
      `/snapshots${params.toString() ? `?${params}` : ''}`
    );
    return response.data.data;
  },

  /**
   * Get snapshot by ID
   *
   * @param id Snapshot ID
   * @returns Single monthly snapshot
   */
  getById: async (id: string): Promise<MonthlySnapshot> => {
    const response = await client.get<ApiResponse<MonthlySnapshot>>(`/snapshots/${id}`);
    return response.data.data;
  },

  /**
   * Create new snapshot
   *
   * @param data Snapshot data with date and accounts
   * @returns Created monthly snapshot
   */
  create: async (data: Omit<MonthlySnapshot, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<MonthlySnapshot> => {
    const response = await client.post<ApiResponse<MonthlySnapshot>>('/snapshots', data);
    return response.data.data;
  },

  /**
   * Update existing snapshot
   *
   * @param id Snapshot ID
   * @param data Partial snapshot data to update
   * @returns Updated monthly snapshot
   */
  update: async (
    id: string,
    data: Partial<Omit<MonthlySnapshot, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ): Promise<MonthlySnapshot> => {
    const response = await client.patch<ApiResponse<MonthlySnapshot>>(`/snapshots/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete snapshot
   *
   * @param id Snapshot ID
   * @returns Void
   */
  delete: async (id: string): Promise<void> => {
    await client.delete(`/snapshots/${id}`);
  }
};
