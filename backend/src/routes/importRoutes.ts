/**
 * Import Routes
 *
 * API endpoints for LLM-powered data import:
 * - POST /api/v1/import/chat - Process user message with LLM for data extraction
 * - POST /api/v1/import/batch - Batch insert validated snapshots
 *
 * All routes require authentication via validateAuth middleware (applied at parent level).
 * All routes use LLM rate limiter (20 requests/minute).
 *
 * Usage:
 * - Chat endpoint: Multi-turn conversation for data extraction with clarification
 * - Batch endpoint: Insert multiple validated snapshots from chat extraction
 */

import { Router, IRouter } from 'express';
import { chatImport, batchInsert } from '../controllers/importController';
import { validateBody } from '../middleware/validate';
import { chatMessageSchema, batchInsertSchema } from '../validators/importValidator';
import { llmRateLimiter } from '../middleware/rateLimiter';

const router: IRouter = Router();

/**
 * POST /api/v1/import/chat
 * Process user message with LLM for data extraction
 *
 * Rate limited: 20 requests/minute per IP
 * Requires authentication
 *
 * Request body:
 * {
 *   message: string (1-10000 chars)
 *   conversationId?: string (optional)
 * }
 *
 * Response on successful extraction:
 * {
 *   data: {
 *     success: true
 *     snapshots: [{date, accounts}]
 *     conversationId: string
 *   }
 *   success: true
 * }
 *
 * Response on clarification needed:
 * {
 *   data: {
 *     success: false
 *     message: string
 *     needsClarification: true
 *     conversationId: string
 *   }
 *   success: true
 * }
 */
router.post(
  '/chat',
  llmRateLimiter,
  validateBody(chatMessageSchema),
  chatImport
);

/**
 * POST /api/v1/import/batch
 * Batch insert validated snapshots
 *
 * Rate limited: 20 requests/minute per IP
 * Requires authentication
 *
 * Request body:
 * {
 *   snapshots: [{
 *     date: "dd.MM.yyyy"
 *     accounts: [{name, value, assetClass}]
 *   }]
 * }
 *
 * Response on success (201):
 * {
 *   data: {
 *     inserted: number
 *     snapshots: MonthlySnapshot[]
 *     errors?: [{index, date, error}]
 *   }
 *   success: true
 * }
 *
 * Response on failure (400):
 * {
 *   data: {
 *     inserted: 0
 *     snapshots: []
 *     errors: [{index, date, error}]
 *   }
 *   success: false
 * }
 */
router.post(
  '/batch',
  llmRateLimiter,
  validateBody(batchInsertSchema),
  batchInsert
);

export default router;
