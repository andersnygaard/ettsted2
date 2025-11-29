# API Error Handling Guide

This guide explains how to handle errors in the Finans frontend application.

## Overview

The application has a comprehensive error handling system with three layers:

1. **Axios Interceptor** - Catches all API errors and transforms them to user-friendly messages
2. **Toast Notifications** - Displays error/success/info messages to users
3. **Error Boundary** - Catches React rendering errors

## Architecture

```
API Error → Axios Interceptor → ApiError → Component → Toast
                                                     ↓
                                              Error Boundary
```

## Backend Error Format

All backend errors follow this format:

```json
{
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": { ... }
  },
  "success": false
}
```

## Frontend Error Classes

### ApiError

Custom error class for API errors:

```typescript
class ApiError extends Error {
  statusCode: number;  // HTTP status code
  code: string;        // Error code from backend
  details?: unknown;   // Optional error details
}
```

## Usage Examples

### 1. Manual API Calls with try/catch

```typescript
import { useToast } from '@/shared/components';
import client from '@/shared/api/client';

function MyComponent() {
  const { showError, showSuccess } = useToast();

  const handleSubmit = async () => {
    try {
      const response = await client.post('/users/me/setup', { username: 'test' });
      showSuccess('Bruker opprettet!');
    } catch (error) {
      // ApiError is automatically shown as toast by useApiError hook
      // Or manually handle:
      if (error instanceof ApiError) {
        showError(error.message);
      }
    }
  };

  return <button onClick={handleSubmit}>Submit</button>;
}
```

### 2. TanStack Query with useApiError

```typescript
import { useQuery } from '@tanstack/react-query';
import { useApiError } from '@/shared/hooks';
import client from '@/shared/api/client';

function MyComponent() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await client.get('/users/me');
      return response.data;
    },
  });

  // Automatically show toast for errors
  useApiError(error);

  if (isLoading) return <div>Loading...</div>;
  if (error) return null; // Error is shown via toast

  return <div>{data.username}</div>;
}
```

### 3. TanStack Mutation with Manual Error Handling

```typescript
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/shared/components';
import client from '@/shared/api/client';

function MyComponent() {
  const { showSuccess } = useToast();

  const mutation = useMutation({
    mutationFn: async (data: { username: string }) => {
      const response = await client.post('/users/me/setup', data);
      return response.data;
    },
    onSuccess: () => {
      showSuccess('Bruker opprettet!');
    },
    // Error is automatically handled by useApiError below
  });

  // Automatically show toast for mutation errors
  useApiError(mutation.error);

  return (
    <button onClick={() => mutation.mutate({ username: 'test' })}>
      Create User
    </button>
  );
}
```

### 4. Using Toast Directly

```typescript
import { useToast } from '@/shared/components';

function MyComponent() {
  const { showError, showSuccess, showInfo, showWarning } = useToast();

  return (
    <div>
      <button onClick={() => showSuccess('Operasjon fullført!')}>Success</button>
      <button onClick={() => showError('Noe gikk galt!')}>Error</button>
      <button onClick={() => showInfo('Informasjon')}>Info</button>
      <button onClick={() => showWarning('Advarsel')}>Warning</button>
    </div>
  );
}
```

## Error Status Codes

The Axios interceptor automatically handles:

- **400** - Validation error
- **401** - Unauthorized (redirects to login after 1.5s)
- **403** - Forbidden
- **404** - Not found
- **409** - Conflict (e.g., duplicate username)
- **500** - Internal server error
- **503** - Service unavailable

All errors are translated to Norwegian user-friendly messages.

## Error Boundary

The ErrorBoundary catches React rendering errors:

```tsx
// Already wraps the entire app in App.tsx
<ErrorBoundary>
  <ToastProvider>
    <App />
  </ToastProvider>
</ErrorBoundary>
```

When a rendering error occurs:
1. User sees "Noe gikk galt" message
2. Reload button is shown
3. Error details are logged to console
4. Technical details are shown in a collapsible section

## Best Practices

1. **Always use `useApiError` with TanStack Query** - Automatic error handling
2. **Show success messages for mutations** - Confirm actions completed
3. **Use Norwegian messages** - All user-facing text in Norwegian
4. **Let Axios handle 401** - Don't manually redirect on auth errors
5. **Log errors to console** - Already done by interceptor
6. **Keep toast messages short** - 1-2 sentences max
7. **Use appropriate toast type** - error/success/info/warning

## Testing

Test error handling by:

1. **Network errors** - Disable network in DevTools
2. **API errors** - Mock API responses with error status codes
3. **Rendering errors** - Throw error in component to test ErrorBoundary
4. **Toast display** - Verify messages appear and auto-dismiss after 5s

## Future Improvements

- [ ] Error tracking service integration (e.g., Sentry)
- [ ] Retry logic for failed requests
- [ ] Offline mode detection
- [ ] Better error recovery strategies
