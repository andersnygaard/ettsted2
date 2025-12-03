import { AsyncLocalStorage } from 'async_hooks';

/**
 * Log context interface for request correlation and context propagation
 */
export interface LogContext {
  requestId: string;
  userId?: string;
  path?: string;
  method?: string;
}

/**
 * AsyncLocalStorage for maintaining request-specific context across async operations
 * Enables automatic injection of requestId and userId into all logs within a request
 */
export const logContext = new AsyncLocalStorage<LogContext>();

/**
 * Get current log context
 * Returns undefined if no context is set (e.g., outside request scope)
 */
export function getLogContext(): LogContext | undefined {
  return logContext.getStore();
}
