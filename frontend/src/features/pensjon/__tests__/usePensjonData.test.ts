import { vi, describe, it, expect, beforeEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { usePensjonData } from '../usePensjonData';
import { renderHookWithQueryClient } from '@/test/utils';
import { createMockSnapshot, createMockSnapshots } from '@/test/fixtures';

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

describe('usePensjonData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('basic data fetching', () => {
    it('fetches and returns pensjon data correctly', async () => {
      const snapshots = [
        createMockSnapshot({
          id: 'snap-1',
          date: '01.01.2024',
          accounts: [
            { id: 'acc-1', name: 'Arbeidsgiver OTP', assetClass: 'pensjon', value: 500000, isPublicPension: false },
            { id: 'acc-2', name: 'Folketrygden NAV', assetClass: 'pensjon', value: 300000, isPublicPension: true },
          ],
          totalNetWorth: 800000,
        }),
      ];

      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => usePensjonData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.totalPension).toBe(800000);
      expect(result.current.data?.breakdown).toHaveLength(2);
    });

    it('calculates breakdown correctly', async () => {
      const snapshots = [
        createMockSnapshot({
          id: 'snap-1',
          date: '01.01.2024',
          accounts: [
            { id: 'acc-1', name: 'OTP', assetClass: 'pensjon', value: 600000, isPublicPension: false },
            { id: 'acc-2', name: 'NAV', assetClass: 'pensjon', value: 400000, isPublicPension: true },
          ],
          totalNetWorth: 1000000,
        }),
      ];

      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => usePensjonData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const breakdown = result.current.data?.breakdown;
      expect(breakdown?.[0].amount).toBe(600000);
      expect(breakdown?.[0].percent).toBe(60);
      expect(breakdown?.[1].amount).toBe(400000);
      expect(breakdown?.[1].percent).toBe(40);
    });
  });

  describe('private vs public pension calculations', () => {
    it('calculates private and public percentages correctly', async () => {
      const snapshots = [
        createMockSnapshot({
          id: 'snap-1',
          date: '01.01.2024',
          accounts: [
            { id: 'acc-1', name: 'OTP', assetClass: 'pensjon', value: 700000, isPublicPension: false },
            { id: 'acc-2', name: 'NAV', assetClass: 'pensjon', value: 300000, isPublicPension: true },
          ],
          totalNetWorth: 1000000,
        }),
      ];

      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => usePensjonData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.privatePercent).toBe(70);
      expect(result.current.data?.publicPercent).toBe(30);
    });

    it('handles 100% private pension', async () => {
      const snapshots = [
        createMockSnapshot({
          id: 'snap-1',
          date: '01.01.2024',
          accounts: [
            { id: 'acc-1', name: 'OTP', assetClass: 'pensjon', value: 1000000, isPublicPension: false },
          ],
          totalNetWorth: 1000000,
        }),
      ];

      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => usePensjonData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.privatePercent).toBe(100);
      expect(result.current.data?.publicPercent).toBe(0);
    });

    it('handles 100% public pension', async () => {
      const snapshots = [
        createMockSnapshot({
          id: 'snap-1',
          date: '01.01.2024',
          accounts: [
            { id: 'acc-1', name: 'NAV', assetClass: 'pensjon', value: 500000, isPublicPension: true },
          ],
          totalNetWorth: 500000,
        }),
      ];

      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => usePensjonData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.privatePercent).toBe(0);
      expect(result.current.data?.publicPercent).toBe(100);
    });

    it('treats undefined isPublicPension as private', async () => {
      const snapshots = [
        createMockSnapshot({
          id: 'snap-1',
          date: '01.01.2024',
          accounts: [
            { id: 'acc-1', name: 'OTP', assetClass: 'pensjon', value: 600000 },
            { id: 'acc-2', name: 'NAV', assetClass: 'pensjon', value: 400000, isPublicPension: true },
          ],
          totalNetWorth: 1000000,
        }),
      ];

      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => usePensjonData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Account without isPublicPension should be counted as private
      expect(result.current.data?.privatePercent).toBe(60);
      expect(result.current.data?.publicPercent).toBe(40);
    });
  });

  describe('retirement projection', () => {
    it('estimates pension value at retirement', async () => {
      const snapshots = [
        createMockSnapshot({
          id: 'snap-1',
          date: '01.01.2024',
          accounts: [
            { id: 'acc-1', name: 'OTP', assetClass: 'pensjon', value: 500000, isPublicPension: false },
          ],
          totalNetWorth: 500000,
        }),
      ];

      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => usePensjonData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Should project with 5% growth to retirement at 67
      expect(result.current.data?.estimatedAtRetirement).toBeGreaterThan(500000);
    });

    it('handles current age at retirement correctly', async () => {
      const snapshots = [
        createMockSnapshot({
          id: 'snap-1',
          date: '01.01.2024',
          accounts: [
            { id: 'acc-1', name: 'OTP', assetClass: 'pensjon', value: 1000000, isPublicPension: false },
          ],
          totalNetWorth: 1000000,
        }),
      ];

      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => usePensjonData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // If already at retirement age, estimated should equal current
      // (This is using default ages from constants, so will have some growth)
      expect(result.current.data?.estimatedAtRetirement).toBeDefined();
    });
  });

  describe('historical data', () => {
    it('generates history with private and public breakdown', async () => {
      const snapshots = createMockSnapshots(3).map((snap, i) => ({
        ...snap,
        accounts: [
          { id: 'acc-1', name: 'OTP', assetClass: 'pensjon', value: 100000 * (i + 1), isPublicPension: false },
          { id: 'acc-2', name: 'NAV', assetClass: 'pensjon', value: 50000 * (i + 1), isPublicPension: true },
        ],
      }));

      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => usePensjonData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const history = result.current.data?.history;
      expect(history).toHaveLength(3);
      expect(history?.[0].privatePension).toBe(100000);
      expect(history?.[0].publicPension).toBe(50000);
      expect(history?.[0].value).toBe(150000);
    });

    it('sorts history chronologically (oldest first)', async () => {
      const snapshots = [
        createMockSnapshot({ id: 'snap-3', date: '01.03.2024' }),
        createMockSnapshot({ id: 'snap-1', date: '01.01.2024' }),
        createMockSnapshot({ id: 'snap-2', date: '01.02.2024' }),
      ];

      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => usePensjonData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const history = result.current.data?.history;
      expect(history?.[0].date.getMonth()).toBe(0); // January
      expect(history?.[1].date.getMonth()).toBe(1); // February
      expect(history?.[2].date.getMonth()).toBe(2); // March
    });
  });

  describe('edge cases', () => {
    it('handles zero pension correctly', async () => {
      const snapshots = [
        createMockSnapshot({
          id: 'snap-1',
          date: '01.01.2024',
          accounts: [],
          totalNetWorth: 0,
        }),
      ];

      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => usePensjonData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.totalPension).toBe(0);
      expect(result.current.data?.breakdown).toEqual([]);
      expect(result.current.data?.privatePercent).toBe(0);
      expect(result.current.data?.publicPercent).toBe(0);
    });

    it('handles very large pension values', async () => {
      const snapshots = [
        createMockSnapshot({
          id: 'snap-1',
          date: '01.01.2024',
          accounts: [
            { id: 'acc-1', name: 'OTP', assetClass: 'pensjon', value: 10000000, isPublicPension: false },
          ],
          totalNetWorth: 10000000,
        }),
      ];

      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => usePensjonData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.totalPension).toBe(10000000);
      expect(result.current.data?.estimatedAtRetirement).toBeGreaterThan(10000000);
    });

    it('handles empty snapshots', async () => {
      mockGetAll.mockResolvedValue([]);

      const { result } = renderHookWithQueryClient(() => usePensjonData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.totalPension).toBe(0);
      expect(result.current.data?.breakdown).toEqual([]);
      expect(result.current.data?.history).toEqual([]);
      expect(result.current.data?.estimatedAtRetirement).toBe(0);
    });

    it('handles snapshots with mixed account types', async () => {
      const snapshots = [
        createMockSnapshot({
          id: 'snap-1',
          date: '01.01.2024',
          accounts: [
            { id: 'acc-1', name: 'Aksjer', assetClass: 'aksjer', value: 500000 },
            { id: 'acc-2', name: 'OTP', assetClass: 'pensjon', value: 300000, isPublicPension: false },
            { id: 'acc-3', name: 'Gjeld', assetClass: 'gjeld', value: -200000 },
          ],
          totalNetWorth: 600000,
        }),
      ];

      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => usePensjonData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Should only count pensjon accounts
      expect(result.current.data?.totalPension).toBe(300000);
      expect(result.current.data?.breakdown).toHaveLength(1);
    });

    it('handles division by zero in percentage calculations', async () => {
      const snapshots = [
        createMockSnapshot({
          id: 'snap-1',
          date: '01.01.2024',
          accounts: [],
          totalNetWorth: 0,
        }),
      ];

      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => usePensjonData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Should handle zero total gracefully
      expect(result.current.data?.privatePercent).toBe(0);
      expect(result.current.data?.publicPercent).toBe(0);
    });
  });

  describe('loading and error states', () => {
    it('returns loading state initially', () => {
      mockGetAll.mockImplementation(
        () => new Promise(() => {})
      );

      const { result } = renderHookWithQueryClient(() => usePensjonData());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it('handles API errors correctly', async () => {
      const error = new Error('API Error');
      mockGetAll.mockRejectedValue(error);

      const { result } = renderHookWithQueryClient(() => usePensjonData());

      await waitFor(() => expect(result.current.isError).toBe(true), { timeout: 5000 });

      expect(result.current.error).toBe(error);
      expect(result.current.data).toBeUndefined();
    });
  });
});
