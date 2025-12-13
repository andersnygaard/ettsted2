---
paths:
  - frontend/**/*
---

# API Rules

## Stack
Axios, TypeScript generics, request/response interceptors

## Structure
- `/shared/api/client.ts` - Axios instance with interceptors, ApiError class
- `/shared/api/services/*.ts` - Typed API service functions
- `/shared/api/authToken.ts` - Token management (demo + EasyAuth)
- `/shared/types/api.ts` - ApiResponse wrapper type

## Patterns

### Axios Client Setup
```typescript
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  withCredentials: true,
  timeout: 120000,  // 2min for LLM calls
});
```

### Request Interceptor
Attaches auth token:
- Demo session: JWT from localStorage
- Production: Fetch from /.auth/me, add as Bearer token
- Also sends `X-MS-CLIENT-PRINCIPAL` for EasyAuth compat

### Response Interceptor
Transforms errors to `ApiError`:
```typescript
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string,
    public details?: unknown
  ) { ... }
}
```

### Service Layer Pattern
```typescript
// services/snapshotApi.ts
export const snapshotApi = {
  getAll: async (): Promise<MonthlySnapshot[]> => {
    const response = await client.get<ApiResponse<MonthlySnapshot[]>>('/snapshots');
    return response.data.data;  // Unwrap ApiResponse
  },
  create: async (data): Promise<MonthlySnapshot> => { ... },
  update: async (id, data): Promise<MonthlySnapshot> => { ... },
  delete: async (id): Promise<void> => { ... },
};
```

### API Response Shape
```typescript
interface ApiResponse<T> {
  data: T;
  success: true;
}
// Error shape (from backend)
{ error: { message, code, details }, success: false }
```

## Decisions
- Services return unwrapped data (not ApiResponse wrapper)
- Norwegian error messages as fallback in client
- 2-minute timeout accommodates LLM import agent calls
- Credentials always sent for cookie-based sessions

## Gotchas
- **401 not auto-redirected**: AuthContext handles it, not interceptor
- **Demo vs OAuth tokens**: Check `isDemoSession()` to determine auth type
- **Zod stripping**: Backend strips unknown fields. If you add fields to frontend, add them to backend schema too
- **CORS in prod**: Backend only accepts configured origins, no-origin requests rejected
