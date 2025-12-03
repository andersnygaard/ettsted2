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

import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { runImportAgent } from '../services/importAgentService';
import { logger } from '../utils/logger';
import OpenAI from 'openai';

/**
 * In-memory conversation store for multi-turn chat
 *
 * Maps conversation ID to message history.
 * Key: conversationId, Value: array of OpenAI message objects
 *
 * Note: For production, consider Redis for persistence across restarts
 */
const conversations = new Map<string, OpenAI.ChatCompletionMessageParam[]>();

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
 * @param next - Express next function
 */
export async function chatImport(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { message, conversationId } = req.body;
    const userId = req.user!.userId;

    logger.debug('Import agent request received', {
      userId,
      messageLength: message.length,
      hasConversationId: !!conversationId
    });

    // Get or create conversation history
    let history: OpenAI.ChatCompletionMessageParam[] = [];
    if (conversationId && conversations.has(conversationId)) {
      history = conversations.get(conversationId) || [];
      logger.debug('Using existing conversation', {
        userId,
        conversationId,
        messageCount: history.length
      });
    }

    // Run the import agent
    const result = await runImportAgent(message, userId, history);

    // Generate conversation ID if new
    const newConversationId = conversationId || randomUUID();

    // Update conversation history with user message and agent response
    history.push({ role: 'user', content: message });
    if (result.message) {
      history.push({ role: 'assistant', content: result.message });
    }

    // Store updated history
    conversations.set(newConversationId, history);

    logger.info('Import agent completed', {
      userId,
      conversationId: newConversationId,
      success: result.success,
      snapshotsCreated: result.snapshotsCreated,
      snapshotsUpdated: result.snapshotsUpdated,
      totalTokens: result.totalTokens,
      actionCount: result.actions.length
    });

    res.json({
      data: {
        ...result,
        conversationId: newConversationId
      },
      success: true
    });
  } catch (error) {
    logger.error('Error running import agent', {
      userId: req.user!.userId,
      error: error instanceof Error ? error.message : String(error)
    });
    next(error);
  }
}

/**
 * Legacy batch insert endpoint (kept for backward compatibility)
 *
 * POST /api/v1/import/batch
 *
 * @deprecated Use chatImport instead - the agent handles insertion directly
 */
export async function batchInsert(_req: Request, res: Response, _next: NextFunction): Promise<void> {
  res.status(410).json({
    error: {
      message: 'This endpoint is deprecated. Use POST /api/v1/import/chat instead - the agent imports data directly.',
      code: 'DEPRECATED_ENDPOINT'
    },
    success: false
  });
}
