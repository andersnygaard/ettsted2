import { vi, describe, it, expect, beforeEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { useGjeldData } from '../useGjeldData';
import { renderHookWithQueryClient } from '@/test/utils';
import { mockGjeldData, createMockSnapshot } from '@/test/fixtures';

// Create hoisted mock functions that survive vi.mock hoisting
const { mockGetSummary: mockGjeldSummary, mockGetAll, mockGetMe } = vi.hoisted(() => ({
  mockGetSummary: vi.fn(),
  mockGetAll: vi.fn(),
  mockGetMe: vi.fn(),
}));

// Mock the services modules
vi.mock('@/shared/api/services', () => ({
  gjeldApi: {
    getSummary: mockGjeldSummary,
  },
  snapshotApi: {
    getAll: mockGetAll,
  },
  userApi: {
    getMe: mockGetMe,
  },
}));

describe('useGjeldData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock for userApi.getMe - returns user with accounts
    mockGetMe.mockResolvedValue({
      id: 'test-user',
      accounts: [
        { id: 'acc-1', name: 'Boliglån', category: 'gjeld', loanDetails: { interestRate: 4.5, remainingYears: 20 } },
        { id: 'acc-2', name: 'Studielån', category: 'gjeld', loanDetails: { interestRate: 2.5, remainingYears: 10 } },
      ],
    });
  });

  describe('basic data fetching', () => {
    it('fetches and returns gjeld data correctly', async () => {
      mockGjeldSummary.mockResolvedValue(mockGjeldData);
      mockGetAll.mockResolvedValue([
        createMockSnapshot(),
        createMockSnapshot({ id: 'snap-2', date: '01.02.2024' }),
      ]);

      const { result } = renderHookWithQueryClient(() => useGjeldData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.totalDebt).toBe(200000);
      expect(result.current.data?.coverage).toBe(125);
      expect(result.current.data?.remaining).toBe(0);
    });

    it('parses loan data correctly', async () => {
      mockGjeldSummary.mockResolvedValue(mockGjeldData);
      mockGetAll.mockResolvedValue([]);

      const { result } = renderHookWithQueryClient(() => useGjeldData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.loans).toHaveLength(2);
      expect(result.current.data?.loans[0].name).toBe('Boliglån');
      expect(result.current.data?.loans[0].balance).toBe(150000);
      expect(result.current.data?.loans[1].name).toBe('Studielån');
      expect(result.current.data?.loans[1].balance).toBe(50000);
    });

    it('parses history dates correctly', async () => {
      mockGjeldSummary.mockResolvedValue(mockGjeldData);
      mockGetAll.mockResolvedValue([]);

      const { result } = renderHookWithQueryClient(() => useGjeldData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const history = result.current.data?.history;
      expect(history).toHaveLength(6);
      expect(history?.[0].date).toBeInstanceOf(Date);
    });
  });

  describe('monthly change calculations', () => {
    it('calculates monthly change correctly with decreasing debt', async () => {
      const snapshots = [
        createMockSnapshot({
          id: 'snap-2',
          date: '01.02.2024',
          accounts: [
            { id: 'acc-1', name: 'Gjeld', assetClass: 'gjeld', value: -190000 },
          ],
        }),
        createMockSnapshot({
          id: 'snap-1',
          date: '01.01.2024',
          accounts: [
            { id: 'acc-1', name: 'Gjeld', assetClass: 'gjeld', value: -200000 },
          ],
        }),
      ];

      mockGjeldSummary.mockResolvedValue(mockGjeldData);
      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => useGjeldData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Debt decreased by 10000 (from 200000 to 190000)
      expect(result.current.data?.monthlyChange).toBe(-10000);
    });

    it('calculates monthly change correctly with increasing debt', async () => {
      const snapshots = [
        createMockSnapshot({
          id: 'snap-2',
          date: '01.02.2024',
          accounts: [
            { id: 'acc-1', name: 'Gjeld', assetClass: 'gjeld', value: -250000 },
          ],
        }),
        createMockSnapshot({
          id: 'snap-1',
          date: '01.01.2024',
          accounts: [
            { id: 'acc-1', name: 'Gjeld', assetClass: 'gjeld', value: -200000 },
          ],
        }),
      ];

      mockGjeldSummary.mockResolvedValue(mockGjeldData);
      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => useGjeldData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Debt increased by 50000 (from 200000 to 250000)
      expect(result.current.data?.monthlyChange).toBe(50000);
    });

    it('handles zero monthly change', async () => {
      const snapshots = [
        createMockSnapshot({
          id: 'snap-2',
          date: '01.02.2024',
          accounts: [
            { id: 'acc-1', name: 'Gjeld', assetClass: 'gjeld', value: -200000 },
          ],
        }),
        createMockSnapshot({
          id: 'snap-1',
          date: '01.01.2024',
          accounts: [
            { id: 'acc-1', name: 'Gjeld', assetClass: 'gjeld', value: -200000 },
          ],
        }),
      ];

      mockGjeldSummary.mockResolvedValue(mockGjeldData);
      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => useGjeldData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.monthlyChange).toBe(0);
    });
  });

  describe('coverage calculations', () => {
    it('handles 100% coverage correctly', async () => {
      const gjeldData = {
        ...mockGjeldData,
        totalDebt: 200000,
        coverage: 100,
        remaining: 0,
      };

      mockGjeldSummary.mockResolvedValue(gjeldData);
      mockGetAll.mockResolvedValue([]);

      const { result } = renderHookWithQueryClient(() => useGjeldData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.coverage).toBe(100);
      expect(result.current.data?.remaining).toBe(0);
    });

    it('handles coverage over 100%', async () => {
      const gjeldData = {
        ...mockGjeldData,
        totalDebt: 200000,
        coverage: 150,
        remaining: 0,
      };

      mockGjeldSummary.mockResolvedValue(gjeldData);
      mockGetAll.mockResolvedValue([]);

      const { result } = renderHookWithQueryClient(() => useGjeldData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.coverage).toBe(150);
      expect(result.current.data?.remaining).toBe(0);
    });

    it('handles coverage under 100%', async () => {
      const gjeldData = {
        ...mockGjeldData,
        totalDebt: 200000,
        coverage: 75,
        remaining: 50000,
      };

      mockGjeldSummary.mockResolvedValue(gjeldData);
      mockGetAll.mockResolvedValue([]);

      const { result } = renderHookWithQueryClient(() => useGjeldData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.coverage).toBe(75);
      expect(result.current.data?.remaining).toBe(50000);
    });
  });

  describe('loan info transformation', () => {
    it('converts loan values to positive balances', async () => {
      const gjeldData = {
        ...mockGjeldData,
        loans: [
          { name: 'Boliglån', value: -350000 },
          { name: 'Studielån', value: -100000 },
        ],
      };

      mockGjeldSummary.mockResolvedValue(gjeldData);
      mockGetAll.mockResolvedValue([]);

      const { result } = renderHookWithQueryClient(() => useGjeldData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.loans[0].balance).toBe(350000);
      expect(result.current.data?.loans[1].balance).toBe(100000);
    });

    it('generates loan IDs from names', async () => {
      const gjeldData = {
        ...mockGjeldData,
        loans: [
          { name: 'Bolig Lån', value: -100000 },
          { name: 'Student Loan', value: -50000 },
        ],
      };

      mockGjeldSummary.mockResolvedValue(gjeldData);
      mockGetAll.mockResolvedValue([]);

      const { result } = renderHookWithQueryClient(() => useGjeldData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.loans[0].id).toBe('bolig-lån');
      expect(result.current.data?.loans[1].id).toBe('student-loan');
    });
  });

  describe('edge cases', () => {
    it('handles zero debt correctly', async () => {
      const gjeldData = {
        totalDebt: 0,
        coverage: 100,
        remaining: 0,
        loans: [],
        history: [],
      };

      mockGjeldSummary.mockResolvedValue(gjeldData);
      mockGetAll.mockResolvedValue([]);

      const { result } = renderHookWithQueryClient(() => useGjeldData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.totalDebt).toBe(0);
      expect(result.current.data?.loans).toEqual([]);
      expect(result.current.data?.monthlyChange).toBe(0);
    });

    it('handles very large debt correctly', async () => {
      const gjeldData = {
        ...mockGjeldData,
        totalDebt: 5000000,
        coverage: 50,
        remaining: 2500000,
      };

      mockGjeldSummary.mockResolvedValue(gjeldData);
      mockGetAll.mockResolvedValue([]);

      const { result } = renderHookWithQueryClient(() => useGjeldData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.totalDebt).toBe(5000000);
      expect(result.current.data?.coverage).toBe(50);
    });

    it('handles null gjeld data from API', async () => {
      mockGjeldSummary.mockResolvedValue(null as unknown);
      mockGetAll.mockResolvedValue([]);

      const { result } = renderHookWithQueryClient(() => useGjeldData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Should return empty data structure
      expect(result.current.data?.totalDebt).toBe(0);
      expect(result.current.data?.coverage).toBe(100);
      expect(result.current.data?.loans).toEqual([]);
      expect(result.current.data?.history).toEqual([]);
    });

    it('handles single snapshot correctly', async () => {
      mockGjeldSummary.mockResolvedValue(mockGjeldData);
      mockGetAll.mockResolvedValue([createMockSnapshot()]);

      const { result } = renderHookWithQueryClient(() => useGjeldData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // With only one snapshot, monthly change should be 0
      expect(result.current.data?.monthlyChange).toBe(0);
    });

    it('handles empty snapshots', async () => {
      mockGjeldSummary.mockResolvedValue(mockGjeldData);
      mockGetAll.mockResolvedValue([]);

      const { result } = renderHookWithQueryClient(() => useGjeldData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.monthlyChange).toBe(0);
    });
  });

  describe('loading and error states', () => {
    it('returns loading state initially', () => {
      mockGjeldSummary.mockImplementation(
        () => new Promise(() => {})
      );
      mockGetAll.mockImplementation(
        () => new Promise(() => {})
      );

      const { result } = renderHookWithQueryClient(() => useGjeldData());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it('handles API errors correctly', async () => {
      const error = new Error('API Error');
      mockGjeldSummary.mockRejectedValue(error);
      mockGetAll.mockRejectedValue(error);

      const { result } = renderHookWithQueryClient(() => useGjeldData());

      await waitFor(() => expect(result.current.isError).toBe(true), { timeout: 5000 });

      expect(result.current.error).toBe(error);
      expect(result.current.data).toBeUndefined();
    });
  });
});
