# 173 - REFACTOR: Create API Service Layer for Sparing/Gjeld

**Type**: Refactor
**Priority**: MEDIUM
**Effort**: Simple
**Status**: COMPLETED

---

## Problem

useSparingData and useGjeldData use raw `fetch()` instead of the axios service layer:

```typescript
// useSparingData.ts:168-171
const [sparingResponse, userResponse] = await Promise.all([
  fetch('/api/v1/sparing'),
  fetch('/api/v1/users/me')
]);

// useGjeldData.ts:67-72
const response = await fetch('/api/v1/gjeld');
```

This bypasses:
- Axios interceptors (auth token injection)
- Centralized error handling (ApiError class)
- Consistent configuration

---

## Solution

Create sparingApi.ts and gjeldApi.ts following existing snapshotApi pattern.

---

## Tasks

### Create API Services
- [x] Create `frontend/src/shared/api/services/sparingApi.ts`
  - Exports SparingResponse interface
  - Implements getSummary() method
  - Uses axios client with proper typing

- [x] Create `frontend/src/shared/api/services/gjeldApi.ts`
  - Exports GjeldResponse interface
  - Implements getSummary() method
  - Uses axios client with proper typing

- [x] Export from services/index.ts

### Update Hooks
- [x] Refactor useSparingData to use sparingApi
  - Replaced raw fetch() with sparingApi.getSummary()
  - Also replaced fetch() for userApi with userApi.getMe()
  - Removed manual JSON parsing (axios handles it)

- [x] Refactor useGjeldData to use gjeldApi
  - Replaced raw fetch() with gjeldApi.getSummary()
  - Removed manual JSON parsing

- [x] Remove raw fetch() calls

### Verify
- [x] Build: `pnpm --filter frontend build` - SUCCESS
- [x] No TypeScript errors
- [x] No unused imports (all imports now used)

---

## Acceptance Criteria

- [x] sparingApi.ts and gjeldApi.ts created with proper interfaces
- [x] Hooks use new API services exclusively
- [x] No raw fetch() calls in hooks
- [x] Auth tokens properly attached via axios interceptors
- [x] Error handling via ApiError class (delegated to client)

---

## Changes Made

### New Files
- `frontend/src/shared/api/services/sparingApi.ts` (39 lines)
- `frontend/src/shared/api/services/gjeldApi.ts` (43 lines)

### Modified Files
- `frontend/src/shared/api/services/index.ts` - Added exports for sparingApi and gjeldApi
- `frontend/src/features/sparing/useSparingData.ts` - Replaced fetch() with sparingApi and userApi
- `frontend/src/features/gjeld/useGjeldData.ts` - Replaced fetch() with gjeldApi

### Benefits
- Centralized API configuration management
- Automatic auth header injection via axios interceptors
- Consistent error handling across all API calls
- Type-safe API responses with interfaces
- Easier to add request/response logging
- Easier to add request retry logic

---

## References

- Pattern: frontend/src/shared/api/services/snapshotApi.ts
- Client: frontend/src/shared/api/client.ts
