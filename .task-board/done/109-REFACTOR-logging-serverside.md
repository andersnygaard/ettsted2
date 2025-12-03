# 109 - Refactor: Server-side Logging

**Type**: REFACTOR
**Priority**: Medium
**Effort**: Medium (4-6 hours)
**Labels**: backend, logging, observability, refactor
**Status**: COMPLETED

---

## Completion Summary

Implemented full request context correlation and sanitization using AsyncLocalStorage.

**Files Created:**
- `backend/src/utils/loggerContext.ts` - AsyncLocalStorage for request context

**Files Modified:**
- `backend/src/utils/logger.ts` - Added contextFormat, sanitizeFormat, createLogger() factory
- `backend/src/middleware/requestLogger.ts` - Integrated logContext.run() wrapper

**Key Features Implemented:**
1. Request ID automatically propagated to all logs within request scope
2. User ID extracted from EasyAuth header and automatically injected
3. Sensitive data sanitization (password, token, secret, key, authorization redacted as [REDACTED])
4. Child logger factory via createLogger(moduleName) for module-scoped logging
5. Full backward compatibility - no breaking changes to existing logger usage
6. TypeScript strict mode compliant

---

## Context

Current logging works but has inconsistencies and missing features. Winston is configured with basic setup but lacks request correlation, consistent context, and proper sanitization.

### Current State

**What exists** ([backend/src/utils/logger.ts](backend/src/utils/logger.ts)):
- Winston logger with dev/prod formats
- Console transport only
- Request logger middleware with UUID generation
- Error handler with logging

**Issues identified**:

1. **No request correlation**: `requestId` is generated but not propagated to all logs within a request
2. **Inconsistent context**: Some logs include `userId`, others don't
3. **No sensitive data sanitization**: Passwords, tokens could leak
4. **Manual context passing**: Every `logger.info()` call must manually include `userId`, `requestId`
5. **No child loggers**: Can't create scoped loggers per service/controller

**Current usage** (169 occurrences across 20 files):
```typescript
// Inconsistent patterns
logger.info('Account created', { userId, accountId: account.id });
logger.debug('Fetching accounts', { userId });
logger.error('Request error', { error: err.message, path: req.path });
```

---

## Acceptance Criteria

- [x] Request ID automatically included in all logs within a request
- [x] User ID automatically included when authenticated
- [x] Child loggers for services/controllers with module name
- [x] Sensitive fields redacted (password, token, secret, key)
- [x] Consistent log format across all modules
- [x] No breaking changes to existing logger usage

---

## Technical Approach

### Option A: AsyncLocalStorage Context (Recommended)

Use Node.js `AsyncLocalStorage` to propagate request context automatically:

```typescript
// backend/src/utils/loggerContext.ts
import { AsyncLocalStorage } from 'async_hooks';

interface LogContext {
  requestId: string;
  userId?: string;
  path?: string;
  method?: string;
}

export const logContext = new AsyncLocalStorage<LogContext>();

export function getLogContext(): LogContext | undefined {
  return logContext.getStore();
}
```

```typescript
// backend/src/utils/logger.ts
import { logContext } from './loggerContext';

// Custom format that injects context
const contextFormat = winston.format((info) => {
  const ctx = logContext.getStore();
  if (ctx) {
    info.requestId = ctx.requestId;
    if (ctx.userId) info.userId = ctx.userId;
  }
  return info;
});

// Sanitize sensitive fields
const sanitizeFormat = winston.format((info) => {
  const sensitiveKeys = ['password', 'token', 'secret', 'key', 'authorization'];
  const sanitize = (obj: any): any => {
    if (!obj || typeof obj !== 'object') return obj;
    const result = { ...obj };
    for (const key of Object.keys(result)) {
      if (sensitiveKeys.some(s => key.toLowerCase().includes(s))) {
        result[key] = '[REDACTED]';
      } else if (typeof result[key] === 'object') {
        result[key] = sanitize(result[key]);
      }
    }
    return result;
  };
  return sanitize(info);
});

export const logger = winston.createLogger({
  format: winston.format.combine(
    contextFormat(),
    sanitizeFormat(),
    winston.format.timestamp(),
    winston.format.json()
  ),
  // ...
});

// Child logger factory
export function createLogger(module: string) {
  return logger.child({ module });
}
```

```typescript
// backend/src/middleware/requestLogger.ts
import { logContext } from '../utils/loggerContext';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const requestId = randomUUID();
  const userId = req.user?.userId;

  logContext.run({ requestId, userId, path: req.path, method: req.method }, () => {
    // All logs within this request will have context
    next();
  });
};
```

### Option B: Request-scoped Logger

Attach logger to request object (simpler but requires passing `req`):

```typescript
req.logger = logger.child({ requestId, userId });
```

**Recommendation**: Option A is cleaner - no need to pass request around.

---

## Migration Strategy

1. **Add context infrastructure** (non-breaking)
2. **Update middleware** to use AsyncLocalStorage
3. **Create child loggers** for each module
4. **Gradually update** existing log calls (optional - they still work)

---

## Files to Modify

- [backend/src/utils/logger.ts](backend/src/utils/logger.ts) - Add context format, sanitization
- [backend/src/middleware/requestLogger.ts](backend/src/middleware/requestLogger.ts) - Use AsyncLocalStorage

## Files to Create

- [backend/src/utils/loggerContext.ts](backend/src/utils/loggerContext.ts) - AsyncLocalStorage setup

---

## Example Output

**Before**:
```json
{"level":"info","message":"Account created","userId":"abc","accountId":"123","timestamp":"..."}
```

**After**:
```json
{
  "level": "info",
  "message": "Account created",
  "module": "accountController",
  "requestId": "req-uuid-456",
  "userId": "abc",
  "accountId": "123",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Dependencies

None - uses built-in Node.js `async_hooks`

---

## Out of Scope

- File transport / log rotation (production uses Azure App Service logs)
- External log aggregation (Application Insights)
- Audit logging (separate task)
- Log levels per module

---

## Verification

1. Make authenticated API request
2. Check all logs include `requestId` and `userId`
3. Send request with `password` in body
4. Verify password is `[REDACTED]` in logs
5. Verify existing log calls still work
