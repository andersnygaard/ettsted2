import { vi, describe, it, expect, beforeEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { useDashboardData } from '../useDashboardData';
import { renderHookWithQueryClient } from '@/test/utils';
import { createMockSnapshot } from '@/test/fixtures';

// Create hoisted mock function that survives vi.mock hoisting
const { mockGetAll } = vi.hoisted(() => ({
  mockGetAll: vi.fn(),
}));

// Mock the services module
vi.mock('@/shared/api/services', () => ({
  snapshotApi: {
    getAll: mockGetAll,
  },
}));

describe('useDashboardData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('with snapshots', () => {
    it('calculates net worth correctly', async () => {
      const snapshots = [
        createMockSnapshot({
          id: 'snap-1',
          date: '01.02.2024',
          accounts: [
            { id: 'acc-1', name: 'Aksjer', assetClass: 'aksjer', value: 200000 },
            { id: 'acc-2', name: 'Gjeld', assetClass: 'gjeld', value: -100000 },
          ],
          totalNetWorth: 100000,
        }),
      ];

      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => useDashboardData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.netWorth).toBe(100000);
      expect(result.current.data?.sumSavings).toBe(200000);
      expect(result.current.data?.totalDebt).toBe(-100000);
    });

    it('calculates monthly change percentage correctly', async () => {
      const snapshots = [
        createMockSnapshot({
          id: 'snap-2',
          date: '01.02.2024',
          accounts: [
            { id: 'acc-1', name: 'Aksjer', assetClass: 'aksjer', value: 110000 },
          ],
          totalNetWorth: 110000,
        }),
        createMockSnapshot({
          id: 'snap-1',
          date: '01.01.2024',
          accounts: [
            { id: 'acc-1', name: 'Aksjer', assetClass: 'aksjer', value: 100000 },
          ],
          totalNetWorth: 100000,
        }),
      ];

      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => useDashboardData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // (110000 - 100000) / 100000 * 100 = 10%
      expect(result.current.data?.monthlyChange).toBe(10);
    });

    it('finds next milestone correctly', async () => {
      const snapshots = [
        createMockSnapshot({
          id: 'snap-1',
          date: '01.01.2024',
          accounts: [
            { id: 'acc-1', name: 'Aksjer', assetClass: 'aksjer', value: 120000 },
          ],
          totalNetWorth: 120000,
        }),
      ];

      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => useDashboardData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Next milestone after 120000 should be 250000
      expect(result.current.data?.nextMilestone).toBe(250000);
      expect(result.current.data?.currentTowardsMilestone).toBe(120000);
    });

    it('doubles milestone when all predefined milestones are exceeded', async () => {
      const snapshots = [
        createMockSnapshot({
          id: 'snap-1',
          date: '01.01.2024',
          accounts: [
            { id: 'acc-1', name: 'Aksjer', assetClass: 'aksjer', value: 25000000 },
          ],
          totalNetWorth: 25000000,
        }),
      ];

      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => useDashboardData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Should double current value when exceeding all milestones
      expect(result.current.data?.nextMilestone).toBe(50000000);
    });
  });

  describe('edge cases', () => {
    it('handles zero net worth correctly', async () => {
      const snapshots = [
        createMockSnapshot({
          id: 'snap-1',
          date: '01.01.2024',
          accounts: [
            { id: 'acc-1', name: 'Aksjer', assetClass: 'aksjer', value: 100000 },
            { id: 'acc-2', name: 'Gjeld', assetClass: 'gjeld', value: -100000 },
          ],
          totalNetWorth: 0,
        }),
      ];

      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => useDashboardData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.netWorth).toBe(0);
      expect(result.current.data?.monthlyChange).toBe(0);
    });

    it('handles negative net worth correctly', async () => {
      const snapshots = [
        createMockSnapshot({
          id: 'snap-1',
          date: '01.01.2024',
          accounts: [
            { id: 'acc-1', name: 'Aksjer', assetClass: 'aksjer', value: 50000 },
            { id: 'acc-2', name: 'Gjeld', assetClass: 'gjeld', value: -200000 },
          ],
          totalNetWorth: -150000,
        }),
      ];

      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => useDashboardData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.netWorth).toBe(-150000);
      expect(result.current.data?.sumSavings).toBe(50000);
      expect(result.current.data?.totalDebt).toBe(-200000);
    });

    it('handles very large numbers correctly', async () => {
      const snapshots = [
        createMockSnapshot({
          id: 'snap-1',
          date: '01.01.2024',
          accounts: [
            { id: 'acc-1', name: 'Aksjer', assetClass: 'aksjer', value: 50000000 },
          ],
          totalNetWorth: 50000000,
        }),
      ];

      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => useDashboardData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.netWorth).toBe(50000000);
      expect(result.current.data?.sumSavings).toBe(50000000);
    });

    it('handles empty snapshots correctly', async () => {
      mockGetAll.mockResolvedValue([]);

      const { result } = renderHookWithQueryClient(() => useDashboardData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.netWorth).toBe(0);
      expect(result.current.data?.monthlyChange).toBe(0);
      expect(result.current.data?.sumSavings).toBe(0);
      expect(result.current.data?.totalDebt).toBe(0);
      expect(result.current.data?.pensjon).toBe(0);
      expect(result.current.data?.nextMilestone).toBe(100000);
    });

    it('calculates monthly change with zero previous value', async () => {
      const snapshots = [
        createMockSnapshot({
          id: 'snap-2',
          date: '01.02.2024',
          accounts: [
            { id: 'acc-1', name: 'Aksjer', assetClass: 'aksjer', value: 100000 },
          ],
          totalNetWorth: 100000,
        }),
        createMockSnapshot({
          id: 'snap-1',
          date: '01.01.2024',
          accounts: [],
          totalNetWorth: 0,
        }),
      ];

      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => useDashboardData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Should handle division by zero gracefully
      expect(result.current.data?.monthlyChange).toBe(0);
    });

    it('separates categories correctly', async () => {
      const snapshots = [
        createMockSnapshot({
          id: 'snap-1',
          date: '01.01.2024',
          accounts: [
            { id: 'acc-1', name: 'Aksjer', assetClass: 'aksjer', value: 100000 },
            { id: 'acc-2', name: 'Fond', assetClass: 'fond', value: 50000 },
            { id: 'acc-3', name: 'Gjeld', assetClass: 'gjeld', value: -75000 },
            { id: 'acc-4', name: 'Pensjon', assetClass: 'pensjon', value: 200000 },
          ],
          totalNetWorth: 275000,
        }),
      ];

      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => useDashboardData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.sumSavings).toBe(150000); // aksjer + fond
      expect(result.current.data?.totalDebt).toBe(-75000);
      expect(result.current.data?.pensjon).toBe(200000);
      expect(result.current.data?.netWorth).toBe(75000); // 150000 - 75000
    });
  });

  describe('loading and error states', () => {
    it('returns loading state initially', () => {
      mockGetAll.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      const { result } = renderHookWithQueryClient(() => useDashboardData());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it('handles API errors correctly', async () => {
      const error = new Error('API Error');
      mockGetAll.mockRejectedValue(error);

      const { result } = renderHookWithQueryClient(() => useDashboardData());

      // Wait longer because hook has retry: 1 which means it will retry once before failing
      await waitFor(() => expect(result.current.isError).toBe(true), { timeout: 5000 });

      expect(result.current.error).toBe(error);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('sparing monthly change calculation', () => {
    it('calculates sparing monthly change correctly', async () => {
      const snapshots = [
        createMockSnapshot({
          id: 'snap-2',
          date: '01.02.2024',
          accounts: [
            { id: 'acc-1', name: 'Aksjer', assetClass: 'aksjer', value: 220000 },
          ],
          totalNetWorth: 220000,
        }),
        createMockSnapshot({
          id: 'snap-1',
          date: '01.01.2024',
          accounts: [
            { id: 'acc-1', name: 'Aksjer', assetClass: 'aksjer', value: 200000 },
          ],
          totalNetWorth: 200000,
        }),
      ];

      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => useDashboardData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // (220000 - 200000) / 200000 * 100 = 10%
      expect(result.current.data?.sparingMonthlyChange).toBe(10);
    });

    it('handles zero previous sparing value', async () => {
      const snapshots = [
        createMockSnapshot({
          id: 'snap-2',
          date: '01.02.2024',
          accounts: [
            { id: 'acc-1', name: 'Aksjer', assetClass: 'aksjer', value: 100000 },
          ],
          totalNetWorth: 100000,
        }),
        createMockSnapshot({
          id: 'snap-1',
          date: '01.01.2024',
          accounts: [],
          totalNetWorth: 0,
        }),
      ];

      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => useDashboardData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.sparingMonthlyChange).toBe(0);
    });
  });
});
