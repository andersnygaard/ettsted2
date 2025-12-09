import { vi, describe, it, expect, beforeEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { useSparingData } from '../useSparingData';
import { renderHookWithQueryClient } from '@/test/utils';
import { mockSparingData, mockUserData, createMockSnapshots } from '@/test/fixtures';

// Create hoisted mock functions that survive vi.mock hoisting
const { mockGetSummary: mockSparingSummary, mockGetMe, mockGetAll } = vi.hoisted(() => ({
  mockGetSummary: vi.fn(),
  mockGetMe: vi.fn(),
  mockGetAll: vi.fn(),
}));

// Mock the services modules
vi.mock('@/shared/api/services', () => ({
  sparingApi: {
    getSummary: mockSparingSummary,
  },
  userApi: {
    getMe: mockGetMe,
  },
  snapshotApi: {
    getAll: mockGetAll,
  },
}));

describe('useSparingData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('basic data fetching', () => {
    it('fetches and returns sparing data correctly', async () => {
      mockSparingSummary.mockResolvedValue(mockSparingData);
      mockGetMe.mockResolvedValue(mockUserData);
      mockGetAll.mockResolvedValue(createMockSnapshots(6));

      const { result } = renderHookWithQueryClient(() => useSparingData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.sumSavings).toBe(250000);
      expect(result.current.data?.savingsRate).toBe(20);
      expect(result.current.data?.monthsFree).toBe(6.25);
      expect(result.current.data?.fireNumber).toBe(12000000);
    });

    it('parses history dates correctly', async () => {
      mockSparingSummary.mockResolvedValue(mockSparingData);
      mockGetMe.mockResolvedValue(mockUserData);
      mockGetAll.mockResolvedValue(createMockSnapshots(6));

      const { result } = renderHookWithQueryClient(() => useSparingData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const history = result.current.data?.history;
      expect(history).toHaveLength(6);
      expect(history?.[0].date).toBeInstanceOf(Date);
    });
  });

  describe('retirement age calculations', () => {
    it('calculates minimum retirement age correctly', async () => {
      const userData = {
        ...mockUserData,
        profile: {
          ...mockUserData.profile,
          birthYear: 1990,
          monthlySalary: 50000,
          monthlySavings: 10000,
          annualExpenses: 480000,
        },
      };

      const sparingData = {
        ...mockSparingData,
        sumSavings: 1000000,
        fireNumber: 12000000,
      };

      mockSparingSummary.mockResolvedValue(sparingData);
      mockGetMe.mockResolvedValue(userData);
      mockGetAll.mockResolvedValue(createMockSnapshots(6));

      const { result } = renderHookWithQueryClient(() => useSparingData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Should calculate years to FIRE and add to current age
      expect(result.current.data?.minRetireAge).toBeGreaterThan(0);
      expect(result.current.data?.minRetireAge).toBeLessThan(999);
    });

    it('handles cases where FIRE is already reached', async () => {
      const userData = {
        ...mockUserData,
        profile: {
          ...mockUserData.profile,
          birthYear: 1980,
          monthlySalary: 50000,
          monthlySavings: 10000,
          annualExpenses: 200000,
        },
      };

      const sparingData = {
        ...mockSparingData,
        sumSavings: 6000000,
        fireNumber: 5000000,
      };

      mockSparingSummary.mockResolvedValue(sparingData);
      mockGetMe.mockResolvedValue(userData);
      mockGetAll.mockResolvedValue(createMockSnapshots(6));

      const { result } = renderHookWithQueryClient(() => useSparingData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Should be current age or close to it
      const currentAge = new Date().getFullYear() - 1980;
      expect(result.current.data?.minRetireAge).toBeLessThanOrEqual(currentAge + 1);
    });

    it('calculates years to salary correctly', async () => {
      const userData = {
        ...mockUserData,
        profile: {
          ...mockUserData.profile,
          monthlySalary: 50000,
          monthlySavings: 10000,
          annualExpenses: 480000,
        },
      };

      const sparingData = {
        ...mockSparingData,
        sumSavings: 100000,
      };

      mockSparingSummary.mockResolvedValue(sparingData);
      mockGetMe.mockResolvedValue(userData);
      mockGetAll.mockResolvedValue(createMockSnapshots(6));

      const { result } = renderHookWithQueryClient(() => useSparingData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // 100k to 600k (annual salary) should take some years
      expect(result.current.data?.yearsToSalary).toBeGreaterThan(0);
    });
  });

  describe('change calculations', () => {
    it('calculates yearly change correctly', async () => {
      const snapshots = createMockSnapshots(12);
      mockSparingSummary.mockResolvedValue(mockSparingData);
      mockGetMe.mockResolvedValue(mockUserData);
      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => useSparingData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.yearlyChange).toBeDefined();
    });

    it('calculates monthly change correctly', async () => {
      const snapshots = createMockSnapshots(6);
      mockSparingSummary.mockResolvedValue(mockSparingData);
      mockGetMe.mockResolvedValue(mockUserData);
      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => useSparingData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.monthlyChange).toBeDefined();
    });

    it('calculates total growth correctly', async () => {
      const snapshots = createMockSnapshots(6);
      mockSparingSummary.mockResolvedValue(mockSparingData);
      mockGetMe.mockResolvedValue(mockUserData);
      mockGetAll.mockResolvedValue(snapshots);

      const { result } = renderHookWithQueryClient(() => useSparingData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Total growth = latest value - first value
      expect(result.current.data?.totalGrowth).toBeGreaterThanOrEqual(0);
    });
  });

  describe('annual withdrawal calculation', () => {
    it('calculates annual withdrawal at 4% rule', async () => {
      const sparingData = {
        ...mockSparingData,
        sumSavings: 1000000,
      };

      mockSparingSummary.mockResolvedValue(sparingData);
      mockGetMe.mockResolvedValue(mockUserData);
      mockGetAll.mockResolvedValue(createMockSnapshots(6));

      const { result } = renderHookWithQueryClient(() => useSparingData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // 4% of 1000000 = 40000
      expect(result.current.data?.annualWithdrawal).toBe(40000);
    });
  });

  describe('edge cases', () => {
    it('handles zero savings correctly', async () => {
      const sparingData = {
        ...mockSparingData,
        sumSavings: 0,
        savingsRate: 0,
        monthsFree: 0,
        fireProgress: 0,
      };

      mockSparingSummary.mockResolvedValue(sparingData);
      mockGetMe.mockResolvedValue(mockUserData);
      mockGetAll.mockResolvedValue([]);

      const { result } = renderHookWithQueryClient(() => useSparingData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.sumSavings).toBe(0);
      expect(result.current.data?.annualWithdrawal).toBe(0);
      expect(result.current.data?.yearlyChange).toBe(0);
      expect(result.current.data?.monthlyChange).toBe(0);
    });

    it('handles very large savings correctly', async () => {
      const sparingData = {
        ...mockSparingData,
        sumSavings: 50000000,
      };

      mockSparingSummary.mockResolvedValue(sparingData);
      mockGetMe.mockResolvedValue(mockUserData);
      mockGetAll.mockResolvedValue(createMockSnapshots(6));

      const { result } = renderHookWithQueryClient(() => useSparingData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.sumSavings).toBe(50000000);
      expect(result.current.data?.annualWithdrawal).toBe(2000000);
    });

    it('handles missing user data gracefully', async () => {
      mockSparingSummary.mockResolvedValue(mockSparingData);
      mockGetMe.mockResolvedValue(null as unknown);
      mockGetAll.mockResolvedValue(createMockSnapshots(6));

      const { result } = renderHookWithQueryClient(() => useSparingData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Should use defaults when user data is missing
      expect(result.current.data?.minRetireAge).toBe(999);
      expect(result.current.data?.yearsToSalary).toBe(0);
    });

    it('handles empty snapshots', async () => {
      mockSparingSummary.mockResolvedValue(mockSparingData);
      mockGetMe.mockResolvedValue(mockUserData);
      mockGetAll.mockResolvedValue([]);

      const { result } = renderHookWithQueryClient(() => useSparingData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.yearlyChange).toBe(0);
      expect(result.current.data?.monthlyChange).toBe(0);
      expect(result.current.data?.totalGrowth).toBe(0);
    });

    it('handles null sparing data from API', async () => {
      mockSparingSummary.mockResolvedValue(null as unknown);
      mockGetMe.mockResolvedValue(mockUserData);
      mockGetAll.mockResolvedValue([]);

      const { result } = renderHookWithQueryClient(() => useSparingData());

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Should return empty data structure
      expect(result.current.data?.sumSavings).toBe(0);
      expect(result.current.data?.fireNumber).toBe(0);
      expect(result.current.data?.history).toEqual([]);
    });
  });

  describe('loading and error states', () => {
    it('returns loading state initially', () => {
      mockSparingSummary.mockImplementation(
        () => new Promise(() => {})
      );
      mockGetMe.mockImplementation(
        () => new Promise(() => {})
      );
      mockGetAll.mockImplementation(
        () => new Promise(() => {})
      );

      const { result } = renderHookWithQueryClient(() => useSparingData());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it('handles API errors correctly', async () => {
      const error = new Error('API Error');
      mockSparingSummary.mockRejectedValue(error);
      mockGetMe.mockRejectedValue(error);
      mockGetAll.mockRejectedValue(error);

      const { result } = renderHookWithQueryClient(() => useSparingData());

      await waitFor(() => expect(result.current.isError).toBe(true), { timeout: 5000 });

      expect(result.current.error).toBe(error);
      expect(result.current.data).toBeUndefined();
    });
  });
});
