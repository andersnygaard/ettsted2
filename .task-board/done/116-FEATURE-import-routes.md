# 116 - Feature: Import API Routes

**Type**: FEATURE
**Priority**: High
**Effort**: Medium (4-6 hours)
**Labels**: backend, api, llm
**Parent**: [109-EPIC-llm-data-import.md](109-EPIC-llm-data-import.md)

---

## Context

Backend API endpoints for LLM-powered data import. Handles chat messages, extracts data, validates, and batch inserts snapshots.

---

## Acceptance Criteria

- [x] `POST /api/v1/import/chat` - Process user message with LLM
- [x] `POST /api/v1/import/batch` - Batch insert validated snapshots
- [x] Rate limiting: 20 requests/minute for LLM endpoints
- [x] Input validation with Zod schemas
- [x] Proper error responses for all failure cases
- [x] Conversation history support for multi-turn chat

---

## Technical Approach

### 1. Create Validator

```typescript
// backend/src/validators/importValidator.ts
import { z } from 'zod';

export const chatMessageSchema = z.object({
  message: z.string().min(1).max(10000),
  conversationId: z.string().optional(),
});

export const batchInsertSchema = z.object({
  snapshots: z.array(z.object({
    date: z.string().regex(/^\d{2}\.\d{2}\.\d{4}$/),
    accounts: z.array(z.object({
      name: z.string().min(1).max(100),
      value: z.number(),
      assetClass: z.enum(['aksjer', 'fond', 'krypto', 'bankkonto', 'lån', 'pensjon']),
    })),
  })),
});
```

### 2. Create Controller

```typescript
// backend/src/controllers/importController.ts
import { Request, Response, NextFunction } from 'express';
import { extractPortfolioData } from '../services/openaiService';
import * as snapshotService from '../services/snapshotService';

// In-memory conversation store (consider Redis for production)
const conversations = new Map<string, any[]>();

export async function chatImport(req: Request, res: Response, next: NextFunction) {
  try {
    const { message, conversationId } = req.body;
    const userId = req.user!.userId;

    // Get or create conversation history
    const history = conversationId ? conversations.get(conversationId) || [] : [];

    const result = await extractPortfolioData(message, userId, history);

    // Generate conversation ID if new
    const newConversationId = conversationId || crypto.randomUUID();

    // Update history
    history.push({ role: 'user', content: message });
    if (result.message) {
      history.push({ role: 'assistant', content: result.message });
    }
    conversations.set(newConversationId, history);

    res.json({
      data: {
        ...result,
        conversationId: newConversationId,
      },
      success: true,
    });
  } catch (error) {
    next(error);
  }
}

export async function batchInsert(req: Request, res: Response, next: NextFunction) {
  try {
    const { snapshots } = req.body;
    const userId = req.user!.userId;

    const results = [];
    for (const snapshot of snapshots) {
      const created = await snapshotService.createSnapshot(userId, {
        date: snapshot.date,
        accounts: snapshot.accounts,
      });
      results.push(created);
    }

    res.status(201).json({
      data: {
        inserted: results.length,
        snapshots: results,
      },
      success: true,
    });
  } catch (error) {
    next(error);
  }
}
```

### 3. Create Routes

```typescript
// backend/src/routes/importRoutes.ts
import { Router, IRouter } from 'express';
import { chatImport, batchInsert } from '../controllers/importController';
import { llmRateLimiter } from '../middleware/rateLimiter';
import { validateBody } from '../middleware/validate';
import { chatMessageSchema, batchInsertSchema } from '../validators/importValidator';

const router: IRouter = Router();

/**
 * POST /api/v1/import/chat
 * Process user message with LLM for data extraction
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
 */
router.post(
  '/batch',
  llmRateLimiter,
  validateBody(batchInsertSchema),
  batchInsert
);

export default router;
```

### 4. Add Rate Limiter

```typescript
// backend/src/middleware/rateLimiter.ts
export const llmRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute
  message: {
    error: {
      message: 'For mange forespørsler. Prøv igjen om litt.',
      code: 'RATE_LIMIT_EXCEEDED',
    },
    success: false,
  },
});
```

### 5. Mount Routes

```typescript
// backend/src/routes/index.ts
import importRoutes from './importRoutes';

// Add after other protected routes
router.use('/import', validateAuth, importRoutes);
```

---

## Files to Create

- [backend/src/validators/importValidator.ts](backend/src/validators/importValidator.ts)
- [backend/src/controllers/importController.ts](backend/src/controllers/importController.ts)
- [backend/src/routes/importRoutes.ts](backend/src/routes/importRoutes.ts)

## Files to Modify

- [backend/src/routes/index.ts](backend/src/routes/index.ts) - Mount import routes
- [backend/src/middleware/rateLimiter.ts](backend/src/middleware/rateLimiter.ts) - Add LLM limiter

---

## Dependencies

- Task 114 (OpenAI Service)
- Task 115 (Langfuse Integration) - optional but recommended
- Existing snapshot service

---

## API Examples

### Chat Request
```bash
POST /api/v1/import/chat
{
  "message": "Januar 2024: Nordnet 150k, Krypto 25k"
}
```

### Chat Response (Success)
```json
{
  "data": {
    "success": true,
    "snapshots": [{
      "date": "01.01.2024",
      "accounts": [
        { "name": "Nordnet", "value": 150000, "assetClass": "aksjer" },
        { "name": "Krypto", "value": 25000, "assetClass": "krypto" }
      ]
    }],
    "conversationId": "abc-123"
  },
  "success": true
}
```

### Chat Response (Needs Clarification)
```json
{
  "data": {
    "success": false,
    "message": "Hvilken type konto er 'Nordnet'? Aksjer, fond, eller annet?",
    "needsClarification": true,
    "conversationId": "abc-123"
  },
  "success": true
}
```

---

## Verification

1. Start backend with OpenAI key configured
2. Send chat request with sample data
3. Verify extraction result
4. Send batch insert with extracted data
5. Verify snapshots created in database
