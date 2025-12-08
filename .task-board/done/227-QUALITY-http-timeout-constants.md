# Task 227: Move HTTP Timeout to Constants

**Priority**: Low
**Category**: Code Quality
**Effort**: Low (10 min)
**Impact**: Code Quality +0.5 points

## Problem

Axios timeout hardcoded to 120000ms.

## Files

- `frontend/src/config/constants.ts`
- `frontend/src/shared/api/client.ts`

## Implementation

```typescript
// constants.ts
export const HTTP = {
  TIMEOUT: 30000,
  LLM_TIMEOUT: 120000,
} as const;

// client.ts
timeout: HTTP.TIMEOUT,
```

## Acceptance Criteria

- [x] Timeout in constants
- [x] Client uses constant
- [x] Build passes
