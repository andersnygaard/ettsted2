---
paths:
  - frontend/**/*
---

# Error Handling Rules

## Stack
ApiError class, ErrorBoundary, useApiError hook, FeatureErrorFallback

## Structure
- `/shared/api/client.ts` - ApiError class, response interceptor
- `/shared/utils/errorTypes.ts` - Error utilities, `isStatusCode()` helper
- `/shared/hooks/useApiError.ts` - Toast notification hook
- `/shared/components/FeatureErrorFallback.tsx` - Page-level error UI
- `/routes/index.tsx` - ErrorBoundary wrapping per route

## Patterns

### ApiError Class
```typescript
class ApiError extends Error {
  constructor(
    message: string,           // User-friendly Norwegian message
    public statusCode: number, // HTTP status
    public code: string,       // Backend error code
    public details?: unknown   // Additional context
  ) { ... }
}
```

### Error Checking Utility
```typescript
import { isStatusCode } from '@/shared/utils/errorTypes';

if (isStatusCode(error, 404)) {
  // User needs onboarding
}
if (isStatusCode(error, 401)) {
  // Not authenticated
}
```

### useApiError Hook
```typescript
// Auto-show toast on error
const { error } = useQuery(...);
useApiError(error);

// Manual error handling
const handleError = useApiError();
try { ... } catch (error) {
  handleError(error);
}
```

### Route-Level Error Boundaries
```tsx
<Route path="oversikt" element={
  <ProtectedRoute>
    <ErrorBoundary fallback={(error, reset) =>
      <FeatureErrorFallback error={error} reset={reset} featureName="Dashboard" />
    }>
      <DashboardPage />
    </ErrorBoundary>
  </ProtectedRoute>
} />
```

### Error Messages (Norwegian)
Fallback messages in `client.ts`:
- 400: "Ugyldig forespørsel..."
- 401: "Du må logge inn..."
- 403: "Du har ikke tilgang..."
- 404: "Ressursen ble ikke funnet"
- 500: "En serverfeil oppstod..."

## Decisions
- ApiError transforms Axios errors to consistent format
- Norwegian messages as fallback when backend doesn't provide one
- ErrorBoundary per route (not global) for granular recovery
- Toast for recoverable errors, ErrorFallback for unrecoverable

## Gotchas
- **401 not auto-redirected**: AuthContext handles 401, not error interceptor
- **404 from /users/me**: Not an error - means user needs onboarding
- **Error boundary reset**: FeatureErrorFallback has "Try Again" button calling reset()
- **Toast vs Boundary**: Use toast for API errors, boundary for render crashes
