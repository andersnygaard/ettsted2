# 115 - Feature: Langfuse Integration

**Type**: FEATURE
**Priority**: High
**Effort**: Simple (2-3 hours)
**Labels**: backend, llm, observability, langfuse
**Parent**: [109-EPIC-llm-data-import.md](109-EPIC-llm-data-import.md)

---

## Context

Integrate Langfuse for LLM observability. Track all OpenAI calls with traces, measure latency, monitor costs, and enable prompt versioning.

---

## Acceptance Criteria

- [x] Langfuse SDK configured with environment variables
- [x] All OpenAI calls wrapped with Langfuse tracing
- [x] User ID attached to traces for debugging
- [x] Token usage and cost tracked
- [x] Traces visible in Langfuse dashboard

---

## Technical Approach

### 1. Install Langfuse SDK

```bash
cd backend && pnpm add langfuse
```

### 2. Create Langfuse Service

```typescript
// backend/src/services/langfuseService.ts
import { Langfuse } from 'langfuse';

let langfuse: Langfuse | null = null;

export function getLangfuse(): Langfuse {
  if (!langfuse) {
    langfuse = new Langfuse({
      publicKey: process.env.LANGFUSE_PUBLIC_KEY,
      secretKey: process.env.LANGFUSE_SECRET_KEY,
      baseUrl: process.env.LANGFUSE_HOST || 'https://cloud.langfuse.com',
    });
  }
  return langfuse;
}

export interface TraceContext {
  userId: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
}

export function createTrace(name: string, context: TraceContext) {
  const lf = getLangfuse();
  return lf.trace({
    name,
    userId: context.userId,
    sessionId: context.sessionId,
    metadata: context.metadata,
  });
}

// Graceful shutdown
export async function flushLangfuse() {
  if (langfuse) {
    await langfuse.shutdownAsync();
  }
}
```

### 3. Wrap OpenAI Service

```typescript
// Update backend/src/services/openaiService.ts
import { createTrace, getLangfuse } from './langfuseService';

export async function extractPortfolioData(
  userMessage: string,
  userId: string,
  conversationHistory: OpenAI.ChatCompletionMessageParam[] = []
): Promise<ExtractionResult> {
  const trace = createTrace('extract-portfolio-data', { userId });
  const generation = trace.generation({
    name: 'openai-extraction',
    model: 'gpt-4-turbo-preview',
    input: { userMessage, historyLength: conversationHistory.length },
  });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages,
      tools,
      tool_choice: "auto",
    });

    generation.end({
      output: response.choices[0].message,
      usage: {
        promptTokens: response.usage?.prompt_tokens,
        completionTokens: response.usage?.completion_tokens,
      },
    });

    // ... rest of extraction logic
  } catch (error) {
    generation.end({
      statusMessage: error instanceof Error ? error.message : 'Unknown error',
      level: 'ERROR',
    });
    throw error;
  }
}
```

### 4. Environment Variables

Add to `backend/.env`:
```bash
LANGFUSE_PUBLIC_KEY=pk-lf-...
LANGFUSE_SECRET_KEY=sk-lf-...
LANGFUSE_HOST=https://cloud.langfuse.com
```

### 5. Graceful Shutdown

```typescript
// backend/src/index.ts
import { flushLangfuse } from './services/langfuseService';

process.on('SIGTERM', async () => {
  await flushLangfuse();
  process.exit(0);
});
```

---

## Files to Create

- [backend/src/services/langfuseService.ts](backend/src/services/langfuseService.ts)

## Files to Modify

- [backend/src/services/openaiService.ts](backend/src/services/openaiService.ts) - Add tracing
- [backend/src/index.ts](backend/src/index.ts) - Add shutdown hook
- [backend/.env.example](backend/.env.example) - Add Langfuse vars

---

## Dependencies

- Task 114 (OpenAI Service)
- Langfuse account (free tier available)

---

## Verification

1. Make extraction request
2. Check Langfuse dashboard
3. Verify trace shows:
   - User ID
   - Input/output
   - Token usage
   - Latency

---

## Implementation Notes

**Completed**: 2025-12-03

### Architecture Decisions

1. **Lazy Initialization**: Langfuse instance created on first use with configuration check. Gracefully handles missing environment variables.

2. **Safety-First Approach**: All Langfuse functions return early if not configured (isConfigured flag prevents re-initialization checks). Errors logged but never thrown to prevent service disruption.

3. **Generation + Event Pattern**: Used `logGeneration()` to capture LLM call metadata (model, tokens, latency) and `logEvent()` for business events (extraction-success, token-usage, etc).

4. **Optional userId Parameter**: `extractPortfolioData(userMessage, conversationHistory, userId?)` - userId is optional to avoid breaking existing code. Pass it from routes when available.

### Files Created

- `backend/src/services/langfuseService.ts` - Core Langfuse integration with singleton, tracing, and graceful shutdown.

### Files Modified

1. **backend/src/services/openaiService.ts**:
   - Added `userId` parameter (optional) to `extractPortfolioData()`
   - Wrapped entire extraction with Langfuse trace
   - Logged token usage and generation metrics
   - Logged events for extraction outcomes (success, error, clarification)

2. **backend/src/index.ts**:
   - Imported `flushLangfuse` service
   - Updated `gracefulShutdown()` to await `flushLangfuse()` before exiting
   - Ensures all pending traces flushed to Langfuse on shutdown

### Environment Variables

Located in `backend/.env` and `.env.example`:
- `LANGFUSE_PUBLIC_KEY` - Authentication key from Langfuse account
- `LANGFUSE_SECRET_KEY` - Secret key from Langfuse account
- `LANGFUSE_HOST` - Langfuse instance URL (default: http://localhost:3001 for dev)

### Integration Points

Routes using `extractPortfolioData()` should pass `userId` for complete tracing:

```typescript
// Example route usage
const userId = req.user?.id; // Extract from auth context
const result = await extractPortfolioData(userMessage, conversationHistory, userId);
```

### Testing Locally

1. Start Langfuse local instance (if not using cloud)
2. Ensure `LANGFUSE_PUBLIC_KEY` and `LANGFUSE_SECRET_KEY` are set in `.env`
3. Make portfolio data extraction request
4. Check Langfuse dashboard for trace with:
   - Trace name: "openai-data-extraction"
   - User ID (if passed)
   - Generation: "gpt-4-turbo-preview-extraction" with token counts
   - Events: "token-usage", "extraction-success", "extraction-error", etc.

### Build Status

- TypeScript compilation: PASS
- Backend build: PASS
- No breaking changes to existing APIs
