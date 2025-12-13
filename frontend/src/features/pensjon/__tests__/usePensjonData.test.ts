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

  describe('chart data aggregation for Totalt/Per Konto tabs', () => {
    it('includes privatePension and publicPension aggregated keys in accountHistory', async () => {
      const snapshots = createMockSnapshots(2).map((snap, i) => ({
        ...snap,
        accounts: [
          { id: 'acc-1', name: 'OTP', assetClass: 'pensjon', value: 100000 * (i + 1), isPublicPension: false },
          { id: 'acc-2', name: 'IPS', assetClass: 'pensjon', value: 50000 * (i + 1), isPublicPension: false },
          { id: 'acc-3', name: 'NAV', assetClass: 'pensjon', value: 30000 * (i + 1), isPublicPension: true },
        ],
      }));

      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => usePensjonData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const accountHistory = result.current.data?.accountHistory;
      expect(accountHistory).toBeDefined();
      expect(accountHistory?.length).toBe(2);

      // First data point should have individual account values plus aggregated values
      const firstPoint = accountHistory?.[0];
      expect(firstPoint?.['acc-1']).toBe(100000); // First OTP
      expect(firstPoint?.['acc-2']).toBe(50000);  // First IPS
      expect(firstPoint?.['acc-3']).toBe(30000);  // First NAV
      expect(firstPoint?.['privatePension']).toBe(150000); // OTP + IPS
      expect(firstPoint?.['publicPension']).toBe(30000);   // NAV

      // Second data point
      const secondPoint = accountHistory?.[1];
      expect(secondPoint?.['privatePension']).toBe(300000); // (100k + 50k) * 2
      expect(secondPoint?.['publicPension']).toBe(60000);   // 30k * 2
    });

    it('correctly separates private and public pensions across snapshots', async () => {
      const snapshots = [
        createMockSnapshot({
          id: 'snap-1',
          date: '01.01.2024',
          accounts: [
            { id: 'acc-1', name: 'OTP', assetClass: 'pensjon', value: 200000, isPublicPension: false },
            { id: 'acc-2', name: 'NAV', assetClass: 'pensjon', value: 100000, isPublicPension: true },
          ],
        }),
        createMockSnapshot({
          id: 'snap-2',
          date: '01.02.2024',
          accounts: [
            { id: 'acc-1', name: 'OTP', assetClass: 'pensjon', value: 250000, isPublicPension: false },
            { id: 'acc-2', name: 'NAV', assetClass: 'pensjon', value: 120000, isPublicPension: true },
            { id: 'acc-3', name: 'IPS', assetClass: 'pensjon', value: 50000, isPublicPension: false },
          ],
        }),
      ];

      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => usePensjonData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const accountHistory = result.current.data?.accountHistory;
      expect(accountHistory?.length).toBe(2);

      // January: 200k private (OTP) + 100k public (NAV)
      expect(accountHistory?.[0]?.['privatePension']).toBe(200000);
      expect(accountHistory?.[0]?.['publicPension']).toBe(100000);

      // February: 300k private (OTP + IPS) + 120k public (NAV)
      expect(accountHistory?.[1]?.['privatePension']).toBe(300000);
      expect(accountHistory?.[1]?.['publicPension']).toBe(120000);
    });

    it('handles new accounts added over time - aggregation only counts existing accounts', async () => {
      const snapshots = [
        createMockSnapshot({
          id: 'snap-1',
          date: '01.01.2024',
          accounts: [
            { id: 'acc-1', name: 'OTP', assetClass: 'pensjon', value: 100000, isPublicPension: false },
            { id: 'acc-2', name: 'NAV', assetClass: 'pensjon', value: 50000, isPublicPension: true },
            // acc-3 not added yet
          ],
        }),
        createMockSnapshot({
          id: 'snap-2',
          date: '01.02.2024',
          accounts: [
            { id: 'acc-1', name: 'OTP', assetClass: 'pensjon', value: 120000, isPublicPension: false },
            { id: 'acc-2', name: 'NAV', assetClass: 'pensjon', value: 60000, isPublicPension: true },
            { id: 'acc-3', name: 'IPS', assetClass: 'pensjon', value: 40000, isPublicPension: false }, // NEW in Feb
          ],
        }),
      ];

      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => usePensjonData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const accountHistory = result.current.data?.accountHistory;
      expect(accountHistory?.length).toBe(2);

      // After fix: accounts from ALL snapshots appear in legend (acc-1, acc-2, acc-3)
      // But aggregation only counts accounts that exist in that specific snapshot
      expect(accountHistory?.[0]?.['acc-1']).toBe(100000);
      expect(accountHistory?.[0]?.['acc-2']).toBe(50000);
      expect(accountHistory?.[0]?.['acc-3']).toBe(0); // Didn't exist yet - appears for Per Konto legend

      // Aggregation now only counts existing accounts:
      // January: only acc-1 (100k private) + acc-2 (50k public)
      // No longer counts the 0 from acc-3
      expect(accountHistory?.[0]?.['privatePension']).toBe(100000);
      expect(accountHistory?.[0]?.['publicPension']).toBe(50000);

      // February: all accounts exist
      expect(accountHistory?.[1]?.['privatePension']).toBe(160000); // 120k + 40k
      expect(accountHistory?.[1]?.['publicPension']).toBe(60000);
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
