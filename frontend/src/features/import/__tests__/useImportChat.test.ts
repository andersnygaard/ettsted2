import { vi, describe, it, expect, beforeEach } from 'vitest';
import { renderHookWithQueryClient } from '@/test/utils';
import { useImportChat } from '../useImportChat';
import { waitFor } from '@testing-library/react';

// Create hoisted mock
const { mockPost } = vi.hoisted(() => ({
  mockPost: vi.fn(),
}));

vi.mock('@/shared/api/client', () => ({
  default: {
    post: mockPost,
  },
}));

describe('useImportChat hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have initial messages', () => {
      const { result } = renderHookWithQueryClient(() => useImportChat());

      expect(result.current.messages).toHaveLength(2);
      expect(result.current.messages[0].role).toBe('user');
      expect(result.current.messages[0].content).toBe('Hei');
      expect(result.current.messages[1].role).toBe('assistant');
      expect(result.current.messages[1].content).toContain('porteføljedata');
    });

    it('should have empty stats initially', () => {
      const { result } = renderHookWithQueryClient(() => useImportChat());

      expect(result.current.lastStats).toBeNull();
    });

    it('should not be loading initially', () => {
      const { result } = renderHookWithQueryClient(() => useImportChat());

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('sending messages', () => {
    it('should add both user and assistant messages on send', async () => {
      const mockResponse = {
        data: {
          data: {
            success: true,
            message: 'Takk for dataene!',
            actions: [],
            snapshotsCreated: 0,
            snapshotsUpdated: 0,
            totalTokens: 150,
            conversationId: 'conv-123',
          },
        },
      };

      mockPost.mockResolvedValue(mockResponse);

      const { result } = renderHookWithQueryClient(() => useImportChat());

      const initialCount = result.current.messages.length;

      result.current.sendMessage('Her er mine data');

      // Wait for both user and assistant messages to be added
      await waitFor(() => {
        expect(result.current.messages.length).toBeGreaterThanOrEqual(initialCount + 2);
      });

      // Verify user message was added
      const messages = result.current.messages;
      const userMessage = messages.find(
        (m) => m.role === 'user' && m.content === 'Her er mine data'
      );
      expect(userMessage).toBeDefined();
    });

    it('should add assistant message with response', async () => {
      const mockResponse = {
        data: {
          data: {
            success: true,
            message: 'Jeg fant 5 snapshots',
            actions: [
              {
                type: 'tool_call',
                tool: 'upsert_snapshot',
                timestamp: '2024-01-01T00:00:00Z',
              },
            ],
            snapshotsCreated: 3,
            snapshotsUpdated: 2,
            totalTokens: 250,
            conversationId: 'conv-123',
          },
        },
      };

      mockPost.mockResolvedValue(mockResponse);

      const { result } = renderHookWithQueryClient(() => useImportChat());

      const initialCount = result.current.messages.length;
      result.current.sendMessage('Her er porteføljedata');

      await waitFor(() => {
        expect(result.current.messages.length).toBe(initialCount + 2);
      });

      const assistantMessage = result.current.messages[initialCount + 1];
      expect(assistantMessage.role).toBe('assistant');
      expect(assistantMessage.content).toBe('Jeg fant 5 snapshots');
      expect(assistantMessage.actions).toHaveLength(1);
    });

    it('should track statistics from response', async () => {
      const mockResponse = {
        data: {
          data: {
            success: true,
            message: 'Success',
            actions: [],
            snapshotsCreated: 5,
            snapshotsUpdated: 3,
            totalTokens: 400,
            conversationId: 'conv-456',
          },
        },
      };

      mockPost.mockResolvedValue(mockResponse);

      const { result } = renderHookWithQueryClient(() => useImportChat());

      result.current.sendMessage('data');

      await waitFor(() => {
        expect(result.current.lastStats).not.toBeNull();
      });

      expect(result.current.lastStats?.snapshotsCreated).toBe(5);
      expect(result.current.lastStats?.snapshotsUpdated).toBe(3);
      expect(result.current.lastStats?.totalTokens).toBe(400);
    });

    it('should include stats in assistant message', async () => {
      const mockResponse = {
        data: {
          data: {
            success: true,
            message: 'Ferdig!',
            actions: [],
            snapshotsCreated: 2,
            snapshotsUpdated: 1,
            totalTokens: 300,
            conversationId: 'conv-789',
          },
        },
      };

      mockPost.mockResolvedValue(mockResponse);

      const { result } = renderHookWithQueryClient(() => useImportChat());

      result.current.sendMessage('data');

      await waitFor(() => {
        expect(result.current.messages.length).toBeGreaterThan(2);
      });

      const lastMessage = result.current.messages[result.current.messages.length - 1];
      expect(lastMessage.stats?.snapshotsCreated).toBe(2);
      expect(lastMessage.stats?.snapshotsUpdated).toBe(1);
      expect(lastMessage.stats?.totalTokens).toBe(300);
    });

    it('should maintain conversation ID across messages', async () => {
      mockPost.mockResolvedValue({
        data: {
          data: {
            success: true,
            message: 'First response',
            actions: [],
            snapshotsCreated: 0,
            snapshotsUpdated: 0,
            totalTokens: 100,
            conversationId: 'conv-persistent',
          },
        },
      });

      const { result } = renderHookWithQueryClient(() => useImportChat());

      result.current.sendMessage('first message');

      await waitFor(() => {
        expect(mockPost).toHaveBeenCalledTimes(1);
      });

      // Send second message
      result.current.sendMessage('second message');

      await waitFor(() => {
        expect(mockPost).toHaveBeenCalledTimes(2);
      });

      // Second call should include conversation ID
      const secondCall = mockPost.mock.calls[1];
      expect(secondCall[1]).toMatchObject({
        conversationId: 'conv-persistent',
      });
    });
  });

  describe('error handling', () => {
    it('should handle validation errors', async () => {
      const error = new Error('Validation error');
      (error as any).code = 'VALIDATION_ERROR';

      mockPost.mockRejectedValue(error);

      const { result } = renderHookWithQueryClient(() => useImportChat());

      const initialCount = result.current.messages.length;
      result.current.sendMessage('invalid data');

      await waitFor(() => {
        expect(result.current.messages.length).toBe(initialCount + 2);
      });

      const assistantMessage = result.current.messages[initialCount + 1];
      expect(assistantMessage.role).toBe('assistant');
      expect(assistantMessage.content).toContain('Beklager');
      expect(assistantMessage.content).toContain('mindre data');
    });

    it('should handle 429 rate limit error', async () => {
      const error = new Error('Too many requests');
      (error as any).statusCode = 429;

      mockPost.mockRejectedValue(error);

      const { result } = renderHookWithQueryClient(() => useImportChat());

      const initialCount = result.current.messages.length;
      result.current.sendMessage('data');

      await waitFor(() => {
        expect(result.current.messages.length).toBe(initialCount + 2);
      });

      const assistantMessage = result.current.messages[initialCount + 1];
      expect(assistantMessage.content).toContain('for mange meldinger');
    });

    it('should handle 401 authentication error', async () => {
      const error = new Error('Unauthorized');
      (error as any).statusCode = 401;

      mockPost.mockRejectedValue(error);

      const { result } = renderHookWithQueryClient(() => useImportChat());

      const initialCount = result.current.messages.length;
      result.current.sendMessage('data');

      await waitFor(() => {
        expect(result.current.messages.length).toBeGreaterThan(initialCount);
      });

      // Error message should be added, containing auth-related text
      const lastMessage = result.current.messages[result.current.messages.length - 1];
      expect(lastMessage.role).toBe('assistant');
      expect(lastMessage.content.toLowerCase()).toContain('inn');
    });

    it('should handle 500 server error', async () => {
      const error = new Error('Internal server error');
      (error as any).statusCode = 500;

      mockPost.mockRejectedValue(error);

      const { result } = renderHookWithQueryClient(() => useImportChat());

      const initialCount = result.current.messages.length;
      result.current.sendMessage('data');

      await waitFor(() => {
        expect(result.current.messages.length).toBe(initialCount + 2);
      });

      const assistantMessage = result.current.messages[initialCount + 1];
      expect(assistantMessage.content).toContain('gikk galt');
    });

    it('should handle timeout errors', async () => {
      const error = new Error('Request timeout');

      mockPost.mockRejectedValue(error);

      const { result } = renderHookWithQueryClient(() => useImportChat());

      const initialCount = result.current.messages.length;
      result.current.sendMessage('data');

      await waitFor(() => {
        expect(result.current.messages.length).toBe(initialCount + 2);
      });

      const assistantMessage = result.current.messages[initialCount + 1];
      expect(assistantMessage.content).toContain('lang tid');
    });
  });

  describe('multi-turn conversation', () => {
    it('should handle multiple back-and-forth messages', async () => {
      mockPost.mockResolvedValue({
        data: {
          data: {
            success: true,
            message: 'Response',
            actions: [],
            snapshotsCreated: 0,
            snapshotsUpdated: 0,
            totalTokens: 100,
            conversationId: 'conv-multi',
          },
        },
      });

      const { result } = renderHookWithQueryClient(() => useImportChat());

      const initialCount = result.current.messages.length;

      // First turn
      result.current.sendMessage('first');
      await waitFor(() => {
        expect(result.current.messages.length).toBe(initialCount + 2);
      });

      // Second turn
      result.current.sendMessage('second');
      await waitFor(() => {
        expect(result.current.messages.length).toBe(initialCount + 4);
      });

      // Third turn
      result.current.sendMessage('third');
      await waitFor(() => {
        expect(result.current.messages.length).toBe(initialCount + 6);
      });

      expect(mockPost).toHaveBeenCalledTimes(3);
    });
  });

  describe('reset functionality', () => {
    it('should have reset function available', async () => {
      const { result } = renderHookWithQueryClient(() => useImportChat());

      expect(typeof result.current.reset).toBe('function');

      // Reset should clear stats
      result.current.reset();

      expect(result.current.lastStats).toBeNull();
    });
  });
});
