/**
 * Import Controller
 *
 * Handles LLM-powered data import endpoints:
 * - POST /api/v1/import/chat - Run import agent to process and import data
 *
 * Features:
 * - Agentic import: LLM executes tools directly (no separate confirmation step)
 * - Multi-turn conversation support with in-memory conversation history
 * - Real-time action tracking for frontend display
 * - Full Langfuse tracing for observability
 */

import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { runImportAgent } from '../services/importAgentService';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import OpenAI from 'openai';

/**
 * Conversation entry with ownership tracking
 */
interface ConversationEntry {
  userId: string;
  messages: OpenAI.ChatCompletionMessageParam[];
}

/**
 * In-memory conversation store for multi-turn chat
 *
 * Maps conversation ID to message history with user ownership.
 * Key: conversationId, Value: { userId, messages }
 *
 * Note: For production, consider Redis for persistence across restarts
 */
const conversations = new Map<string, ConversationEntry>();

/**
 * Run import agent to process user message and import data
 *
 * POST /api/v1/import/chat
 *
 * This is an agentic endpoint: the LLM executes tools directly to import data.
 * No separate confirmation step is needed.
 *
 * Request body:
 * {
 *   message: string (1-10000 chars) - User's data or instructions
 *   conversationId?: string (optional, for multi-turn chat)
 * }
 *
 * Response:
 * {
 *   data: {
 *     success: boolean
 *     message: string - Final message from agent
 *     actions: AgentAction[] - List of tool calls and results
 *     snapshotsCreated: number
 *     snapshotsUpdated: number
 *     totalTokens: number
 *     conversationId: string
 *   }
 *   success: true
 * }
 *
 * @param req - Express request
 * @param res - Express response
 */
export const chatImport = asyncHandler(async (req: Request, res: Response) => {
  const { message, conversationId } = req.body;
  const userId = req.user!.userId;

  logger.debug('Import agent request received', {
    userId,
    messageLength: message.length,
    hasConversationId: !!conversationId
  });

  // Get or create conversation history with ownership validation
  let history: OpenAI.ChatCompletionMessageParam[] = [];
  let activeConversationId: string;

  const existingConversation = conversationId ? conversations.get(conversationId) : undefined;

  if (existingConversation) {
    if (existingConversation.userId !== userId) {
      // Ownership mismatch - generate new ID, don't overwrite original
      logger.warn('Conversation ownership mismatch', {
        conversationId,
        requestingUserId: userId,
        ownerUserId: existingConversation.userId,
      });
      activeConversationId = randomUUID();
      history = [];
    } else {
      // Valid ownership - continue conversation
      activeConversationId = conversationId;
      history = existingConversation.messages;
      logger.debug('Using existing conversation', {
        userId,
        conversationId,
        messageCount: history.length,
      });
    }
  } else {
    // New conversation
    activeConversationId = conversationId || randomUUID();
  }

  // Run the import agent with sessionId for Langfuse conversation grouping
  const result = await runImportAgent(message, userId, history, activeConversationId);

  // Update conversation history with user message and agent response
  history.push({ role: 'user', content: message });
  if (result.message) {
    history.push({ role: 'assistant', content: result.message });
  }

  // Store updated history with ownership
  conversations.set(activeConversationId, { userId, messages: history });

  logger.info('Import agent completed', {
    userId,
    conversationId: activeConversationId,
    success: result.success,
    snapshotsCreated: result.snapshotsCreated,
    snapshotsUpdated: result.snapshotsUpdated,
    totalTokens: result.totalTokens,
    actionCount: result.actions.length
  });

  res.json({
    data: {
      ...result,
      conversationId: activeConversationId
    },
    success: true
  });
});

/**
 * Legacy batch insert endpoint (kept for backward compatibility)
 *
 * POST /api/v1/import/batch
 *
 * @deprecated Use chatImport instead - the agent handles insertion directly
 */
export const batchInsert = asyncHandler(async (_req: Request, res: Response) => {
  res.status(410).json({
    error: {
      message: 'This endpoint is deprecated. Use POST /api/v1/import/chat instead - the agent imports data directly.',
      code: 'DEPRECATED_ENDPOINT'
    },
    success: false
  });
});
