import { vi, describe, it, expect, beforeEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { usePortfolioData } from '../usePortfolioData';
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

describe('usePortfolioData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('portfolio rows transformation', () => {
    it('transforms snapshots into portfolio rows correctly', async () => {
      const snapshots = createMockSnapshots(3);
      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => usePortfolioData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.rows).toHaveLength(3);
      expect(result.current.data?.rows[0].id).toBe('snap-3'); // Most recent first
      expect(result.current.data?.rows[2].id).toBe('snap-1'); // Oldest last
    });

    it('calculates category totals correctly', async () => {
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

      const { result } = renderHookWithQueryClient(() => usePortfolioData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const row = result.current.data?.rows[0];
      expect(row?.totals.sparing).toBe(150000); // aksjer + fond
      expect(row?.totals.gjeld).toBe(75000); // Absolute value
      expect(row?.totals.pensjon).toBe(200000);
    });

    it('handles gjeld as positive in totals', async () => {
      const snapshots = [
        createMockSnapshot({
          id: 'snap-1',
          date: '01.01.2024',
          accounts: [
            { id: 'acc-1', name: 'Gjeld', assetClass: 'gjeld', value: -250000 },
          ],
          totalNetWorth: -250000,
        }),
      ];

      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => usePortfolioData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Gjeld should be displayed as positive absolute value
      expect(result.current.data?.rows[0].totals.gjeld).toBe(250000);
    });

    it('sorts rows by date descending', async () => {
      const snapshots = [
        createMockSnapshot({ id: 'snap-1', date: '01.01.2024' }),
        createMockSnapshot({ id: 'snap-2', date: '01.03.2024' }),
        createMockSnapshot({ id: 'snap-3', date: '01.02.2024' }),
      ];

      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => usePortfolioData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.rows[0].id).toBe('snap-2'); // March
      expect(result.current.data?.rows[1].id).toBe('snap-3'); // February
      expect(result.current.data?.rows[2].id).toBe('snap-1'); // January
    });
  });

  describe('milestone detection', () => {
    it('detects milestone crossings correctly', async () => {
      const snapshots = [
        createMockSnapshot({
          id: 'snap-1',
          date: '01.01.2024',
          accounts: [
            { id: 'acc-1', name: 'Aksjer', assetClass: 'aksjer', value: 80000 },
          ],
        }),
        createMockSnapshot({
          id: 'snap-2',
          date: '01.02.2024',
          accounts: [
            { id: 'acc-1', name: 'Aksjer', assetClass: 'aksjer', value: 120000 },
          ],
        }),
      ];

      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => usePortfolioData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const milestones = result.current.data?.milestones;
      expect(milestones).toBeDefined();

      // Should detect crossing 100000 threshold
      const key = 'snap-2-Aksjer';
      expect(milestones?.[key]).toContain(100000);
    });

    it('detects multiple milestone crossings in one jump', async () => {
      const snapshots = [
        createMockSnapshot({
          id: 'snap-1',
          date: '01.01.2024',
          accounts: [
            { id: 'acc-1', name: 'Aksjer', assetClass: 'aksjer', value: 50000 },
          ],
        }),
        createMockSnapshot({
          id: 'snap-2',
          date: '01.02.2024',
          accounts: [
            { id: 'acc-1', name: 'Aksjer', assetClass: 'aksjer', value: 250000 },
          ],
        }),
      ];

      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => usePortfolioData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const milestones = result.current.data?.milestones;
      const key = 'snap-2-Aksjer';

      // Should detect multiple crossings
      expect(milestones?.[key]).toContain(60000);
      expect(milestones?.[key]).toContain(70000);
      expect(milestones?.[key]).toContain(100000);
      expect(milestones?.[key]).toContain(200000);
    });

    it('uses absolute values for debt milestone detection', async () => {
      const snapshots = [
        createMockSnapshot({
          id: 'snap-1',
          date: '01.01.2024',
          accounts: [
            { id: 'acc-1', name: 'Gjeld', assetClass: 'gjeld', value: -80000 },
          ],
        }),
        createMockSnapshot({
          id: 'snap-2',
          date: '01.02.2024',
          accounts: [
            { id: 'acc-1', name: 'Gjeld', assetClass: 'gjeld', value: -120000 },
          ],
        }),
      ];

      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => usePortfolioData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const milestones = result.current.data?.milestones;
      const key = 'snap-2-Gjeld';

      // Should detect crossing 100000 threshold (absolute value)
      expect(milestones?.[key]).toContain(100000);
    });

    it('does not detect milestones for decreasing values', async () => {
      const snapshots = [
        createMockSnapshot({
          id: 'snap-1',
          date: '01.01.2024',
          accounts: [
            { id: 'acc-1', name: 'Aksjer', assetClass: 'aksjer', value: 120000 },
          ],
        }),
        createMockSnapshot({
          id: 'snap-2',
          date: '01.02.2024',
          accounts: [
            { id: 'acc-1', name: 'Aksjer', assetClass: 'aksjer', value: 80000 },
          ],
        }),
      ];

      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => usePortfolioData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const milestones = result.current.data?.milestones;

      // Should not detect any milestones when value decreases
      expect(Object.keys(milestones || {}).length).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('handles empty snapshots array', async () => {
      mockGetAll.mockResolvedValue([]);

      const { result } = renderHookWithQueryClient(() => usePortfolioData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.rows).toEqual([]);
      expect(result.current.data?.milestones).toEqual({});
    });

    it('handles snapshots with zero values', async () => {
      const snapshots = [
        createMockSnapshot({
          id: 'snap-1',
          date: '01.01.2024',
          accounts: [
            { id: 'acc-1', name: 'Aksjer', assetClass: 'aksjer', value: 0 },
          ],
          totalNetWorth: 0,
        }),
      ];

      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => usePortfolioData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.rows[0].totals.sparing).toBe(0);
      expect(result.current.data?.rows[0].totalNetWorth).toBe(0);
    });

    it('handles very large account values', async () => {
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

      const { result } = renderHookWithQueryClient(() => usePortfolioData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.rows[0].totals.sparing).toBe(50000000);
    });

    it('handles accounts missing in previous snapshot', async () => {
      const snapshots = [
        createMockSnapshot({
          id: 'snap-1',
          date: '01.01.2024',
          accounts: [
            { id: 'acc-1', name: 'Aksjer', assetClass: 'aksjer', value: 50000 },
          ],
        }),
        createMockSnapshot({
          id: 'snap-2',
          date: '01.02.2024',
          accounts: [
            { id: 'acc-1', name: 'Aksjer', assetClass: 'aksjer', value: 80000 },
            { id: 'acc-2', name: 'Fond', assetClass: 'fond', value: 120000 },
          ],
        }),
      ];

      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => usePortfolioData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const milestones = result.current.data?.milestones;
      const key = 'snap-2-Fond';

      // New account crossing from 0 to 120000 should detect milestones
      expect(milestones?.[key]).toContain(100000);
    });
  });

  describe('loading and error states', () => {
    it('returns loading state initially', () => {
      mockGetAll.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      const { result } = renderHookWithQueryClient(() => usePortfolioData());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it('handles API errors correctly', async () => {
      const error = new Error('API Error');
      mockGetAll.mockRejectedValue(error);

      const { result } = renderHookWithQueryClient(() => usePortfolioData());

      await waitFor(() => expect(result.current.isError).toBe(true), { timeout: 5000 });

      expect(result.current.error).toBe(error);
      expect(result.current.data).toBeUndefined();
    });
  });
});
