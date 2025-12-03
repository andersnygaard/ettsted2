/**
 * Langfuse Service
 *
 * Provides LLM observability and tracing through Langfuse.
 * Integrates with OpenAI calls for monitoring token usage, latency, and errors.
 *
 * Supports:
 * - Traces: Top-level operations (e.g., import session)
 * - Spans: Sub-operations within a trace (e.g., agent loop iterations, tool calls)
 * - Generations: LLM API calls with token tracking
 * - Events: Point-in-time occurrences
 */

import { Langfuse, LangfuseTraceClient, LangfuseSpanClient } from 'langfuse';
import { config } from '../config/environment';
import { logger } from '../utils/logger';

/**
 * Langfuse singleton instance
 * Lazily initialized on first use
 */
let langfuseInstance: Langfuse | null = null;

/**
 * Langfuse configuration status
 */
let isConfigured = false;

/**
 * Context for a Langfuse trace
 */
export interface TraceContext {
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

/**
 * Re-export types for external use
 */
export type { LangfuseTraceClient, LangfuseSpanClient };

/**
 * Get or initialize Langfuse instance
 * Returns null if not configured with required keys
 */
export function getLangfuse(): Langfuse | null {
  // Skip if already checked and not configured
  if (isConfigured === false && langfuseInstance === null) {
    return null;
  }

  // Return existing instance
  if (langfuseInstance) {
    return langfuseInstance;
  }

  // Initialize if required environment variables are present
  if (!config.langfusePublicKey || !config.langfuseSecretKey || !config.langfuseHost) {
    logger.warn('Langfuse not fully configured. Skipping initialization.', {
      hasPublicKey: !!config.langfusePublicKey,
      hasSecretKey: !!config.langfuseSecretKey,
      hasHost: !!config.langfuseHost,
    });
    isConfigured = false;
    return null;
  }

  // Initialize Langfuse
  try {
    langfuseInstance = new Langfuse({
      publicKey: config.langfusePublicKey,
      secretKey: config.langfuseSecretKey,
      baseUrl: config.langfuseHost,
    });

    isConfigured = true;
    logger.info('Langfuse initialized successfully', {
      host: config.langfuseHost,
    });

    return langfuseInstance;
  } catch (error) {
    logger.error('Failed to initialize Langfuse', {
      error: error instanceof Error ? error.message : String(error),
    });
    isConfigured = false;
    return null;
  }
}

/**
 * Create a new Langfuse trace
 * Safely handles cases where Langfuse is not configured
 *
 * @param name - Trace name (e.g., "openai-data-extraction")
 * @param context - Trace context with userId, sessionId, and metadata
 * @returns Trace object or null if Langfuse not configured
 */
export function createTrace(name: string, context: TraceContext): LangfuseTraceClient | null {
  const langfuse = getLangfuse();
  if (!langfuse) {
    return null;
  }

  try {
    const trace = langfuse.trace({
      name,
      userId: context.userId,
      sessionId: context.sessionId,
      metadata: context.metadata,
    });

    logger.debug('Langfuse trace created', {
      traceName: name,
      userId: context.userId,
    });

    return trace;
  } catch (error) {
    logger.error('Failed to create Langfuse trace', {
      traceName: name,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/**
 * Log a generation (LLM call) to Langfuse
 * Safely handles cases where Langfuse is not configured
 *
 * @param traceId - Trace ID (from trace.id)
 * @param name - Generation name (e.g., "openai-gpt4")
 * @param params - OpenAI request parameters
 * @param output - OpenAI response output
 * @param usage - Token usage from response
 * @param durationMs - Execution time in milliseconds
 */
export function logGeneration(
  traceId: string | null | undefined,
  name: string,
  params: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
  },
  output: string,
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  },
  durationMs?: number
) {
  const langfuse = getLangfuse();
  if (!langfuse || !traceId) {
    return;
  }

  try {
    langfuse.generation({
      traceId,
      name,
      model: params.model,
      input: params,
      output,
      usage: {
        input: usage?.prompt_tokens || 0,
        output: usage?.completion_tokens || 0,
      },
      endTime: new Date(),
      startTime: durationMs ? new Date(Date.now() - durationMs) : undefined,
    });

    logger.debug('Langfuse generation logged', {
      name,
      model: params.model,
      inputTokens: usage?.prompt_tokens,
      outputTokens: usage?.completion_tokens,
    });
  } catch (error) {
    logger.error('Failed to log generation to Langfuse', {
      generationName: name,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Log an event to Langfuse
 * Safely handles cases where Langfuse is not configured
 *
 * @param traceId - Trace ID
 * @param name - Event name
 * @param properties - Event properties
 */
export function logEvent(
  traceId: string | null | undefined,
  name: string,
  properties?: Record<string, any>
) {
  const langfuse = getLangfuse();
  if (!langfuse || !traceId) {
    return;
  }

  try {
    langfuse.event({
      traceId,
      name,
      metadata: properties,
    });

    logger.debug('Langfuse event logged', {
      eventName: name,
    });
  } catch (error) {
    logger.error('Failed to log event to Langfuse', {
      eventName: name,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Create a span within a trace for sub-operations
 * Use for agent loop iterations, tool executions, etc.
 *
 * @param trace - Parent trace client
 * @param name - Span name (e.g., "agent-iteration-1", "tool-upsert-snapshot")
 * @param input - Input data for the span
 * @returns Span client or null
 */
export function createSpan(
  trace: LangfuseTraceClient | null,
  name: string,
  input?: Record<string, unknown>
): LangfuseSpanClient | null {
  if (!trace) {
    return null;
  }

  try {
    const span = trace.span({
      name,
      input,
    });

    logger.debug('Langfuse span created', { spanName: name });
    return span;
  } catch (error) {
    logger.error('Failed to create Langfuse span', {
      spanName: name,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/**
 * End a span with output data
 *
 * @param span - Span to end
 * @param output - Output data from the operation
 * @param level - Optional level (DEBUG, DEFAULT, WARNING, ERROR)
 * @param statusMessage - Optional status message
 */
export function endSpan(
  span: LangfuseSpanClient | null,
  output?: Record<string, unknown>,
  level?: 'DEBUG' | 'DEFAULT' | 'WARNING' | 'ERROR',
  statusMessage?: string
): void {
  if (!span) {
    return;
  }

  try {
    span.end({
      output,
      level,
      statusMessage,
    });
    logger.debug('Langfuse span ended');
  } catch (error) {
    logger.error('Failed to end Langfuse span', {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Log a generation (LLM call) within a trace or span
 *
 * @param parent - Parent trace or span
 * @param name - Generation name (e.g., "gpt-4-turbo-iteration-1")
 * @param input - Messages sent to LLM
 * @param output - Response from LLM
 * @param model - Model name
 * @param usage - Token usage
 * @param durationMs - Execution time
 */
export function logGenerationToParent(
  parent: LangfuseTraceClient | LangfuseSpanClient | null,
  name: string,
  input: unknown,
  output: unknown,
  model: string,
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  },
  durationMs?: number
): void {
  if (!parent) {
    return;
  }

  try {
    parent.generation({
      name,
      model,
      input,
      output,
      usage: usage ? {
        input: usage.promptTokens || 0,
        output: usage.completionTokens || 0,
        total: usage.totalTokens,
      } : undefined,
      endTime: new Date(),
      startTime: durationMs ? new Date(Date.now() - durationMs) : undefined,
    });

    logger.debug('Langfuse generation logged to parent', {
      name,
      model,
      inputTokens: usage?.promptTokens,
      outputTokens: usage?.completionTokens,
    });
  } catch (error) {
    logger.error('Failed to log generation to parent', {
      name,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Log an event within a trace or span
 *
 * @param parent - Parent trace or span
 * @param name - Event name
 * @param input - Event input/context
 * @param output - Event output/result
 * @param level - Event level
 */
export function logEventToParent(
  parent: LangfuseTraceClient | LangfuseSpanClient | null,
  name: string,
  input?: unknown,
  output?: unknown,
  level?: 'DEBUG' | 'DEFAULT' | 'WARNING' | 'ERROR'
): void {
  if (!parent) {
    return;
  }

  try {
    parent.event({
      name,
      input,
      output,
      level,
    });

    logger.debug('Langfuse event logged to parent', { eventName: name, level });
  } catch (error) {
    logger.error('Failed to log event to parent', {
      eventName: name,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Flush Langfuse to send all pending traces and events
 * Should be called during graceful shutdown
 */
export async function flushLangfuse(): Promise<void> {
  const langfuse = getLangfuse();
  if (!langfuse) {
    return;
  }

  try {
    logger.debug('Flushing Langfuse traces...');
    await langfuse.flushAsync();
    logger.debug('Langfuse flushed successfully');
  } catch (error) {
    logger.error('Failed to flush Langfuse', {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
