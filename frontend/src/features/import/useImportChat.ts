import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import client from '@/shared/api/client';

/**
 * Agent action from backend
 */
export interface AgentAction {
  type: 'tool_call' | 'tool_result' | 'message' | 'error';
  tool?: string;
  input?: unknown;
  output?: unknown;
  message?: string;
  timestamp: string;
}

/**
 * Chat message interface
 */
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  actions?: AgentAction[];
  stats?: {
    snapshotsCreated: number;
    snapshotsUpdated: number;
    totalTokens: number;
  };
}

/**
 * Import agent response from API
 */
interface ImportAgentResponse {
  success: boolean;
  message: string;
  actions: AgentAction[];
  snapshotsCreated: number;
  snapshotsUpdated: number;
  totalTokens: number;
  conversationId: string;
}

/**
 * Convert technical error to user-friendly Norwegian message
 */
function getUserFriendlyError(err: Error & { code?: string; statusCode?: number }): string {
  // Handle specific error codes
  if (err.code === 'VALIDATION_ERROR') {
    return 'Beklager, jeg kunne ikke behandle meldingen din. Prøv å lime inn mindre data om gangen.';
  }

  // Handle HTTP status codes
  if (err.statusCode === 429) {
    return 'Du sender for mange meldinger. Vent litt før du prøver igjen.';
  }

  if (err.statusCode === 401 || err.statusCode === 403) {
    return 'Du må være logget inn for å importere data.';
  }

  if (err.statusCode === 500) {
    return 'Noe gikk galt på serveren. Prøv igjen om litt.';
  }

  // Network/timeout errors
  if (err.message?.includes('timeout') || err.message?.includes('Network')) {
    return 'Forespørselen tok for lang tid. Prøv igjen med mindre data.';
  }

  // Default friendly message
  return 'Beklager, noe gikk galt. Prøv igjen.';
}

/**
 * Hook for managing import chat state and API interactions
 *
 * The import agent executes tools directly - no confirmation step needed.
 * Actions are tracked and displayed in real-time.
 */
export function useImportChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [lastStats, setLastStats] = useState<{
    snapshotsCreated: number;
    snapshotsUpdated: number;
    totalTokens: number;
  } | null>(null);
  const queryClient = useQueryClient();

  /**
   * Mutation for sending message to import agent
   */
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await client.post('/import/chat', {
        message,
        conversationId,
      });
      return response.data.data as ImportAgentResponse;
    },
    onSuccess: (data) => {
      setConversationId(data.conversationId);

      // Track stats
      const stats = {
        snapshotsCreated: data.snapshotsCreated,
        snapshotsUpdated: data.snapshotsUpdated,
        totalTokens: data.totalTokens,
      };
      setLastStats(stats);

      // Add assistant message with actions
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.message,
          actions: data.actions,
          stats,
        },
      ]);

      // Invalidate queries if data was imported
      if (data.snapshotsCreated > 0 || data.snapshotsUpdated > 0) {
        queryClient.invalidateQueries({ queryKey: ['portfolio'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        queryClient.invalidateQueries({ queryKey: ['snapshots'] });
      }
    },
    onError: (err: Error & { code?: string; statusCode?: number }) => {
      // Convert technical error to user-friendly message
      const friendlyMessage = getUserFriendlyError(err);

      // Add as natural assistant message (no "Feil:" prefix)
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: friendlyMessage,
        },
      ]);
    },
  });

  /**
   * Add user message and send to API
   */
  const sendMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: 'user',
        content,
      },
    ]);
    sendMessageMutation.mutate(content);
  };

  /**
   * Reset chat to initial state
   */
  const reset = () => {
    setMessages([]);
    setConversationId(null);
    setLastStats(null);
  };

  return {
    messages,
    lastStats,
    isLoading: sendMessageMutation.isPending,
    sendMessage,
    reset,
  };
}
