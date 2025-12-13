---
paths:
  - backend/**/*
---

# LLM Rules

## Stack
OpenAI (gpt-4-turbo), Langfuse (observability)

## Structure
- `/services/importAgentService.ts` - Agent loop with tool calls
- `/services/openaiService.ts` - OpenAI client wrapper
- `/services/langfuseService.ts` - Tracing singleton
- `/routes/importRoutes.ts` - Chat endpoint
- `/controllers/importController.ts` - Request handler

## Patterns
- Agent loop: max 20 iterations, process tool calls until done
- Three tools: `get_user_accounts`, `get_existing_snapshots`, `upsert_snapshot`
- Norwegian system prompt: restricts agent to portfolio data only
- Confirmation flow: agent summarizes → waits for "ja" → imports

## Langfuse Integration
- Singleton: `getLangfuse()` with lazy init
- Every iteration logged as trace
- Tool calls logged as spans
- Generations logged with token counts
- sessionId groups conversation turns

## Decisions
- Agent NEVER imports without explicit user confirmation
- Norwegian number parsing: space thousands, comma decimal
- Dates normalized to 1st of month (monthly tracking app)
- Rate limited: 20 req/min per IP

## Gotchas
- MAX_ITERATIONS = 20 prevents infinite loops
- Langfuse gracefully degrades if not configured (no errors thrown)
- Tool results returned as JSON strings to LLM
- Agent can ask for account mapping clarification before import
- `flushLangfuse()` on graceful shutdown (prevents lost traces)
