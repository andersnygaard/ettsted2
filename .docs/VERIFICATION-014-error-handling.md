# Verification Guide: Task 014 - Error Handling

## Quick Verification Checklist

### Backend ✅
- [x] Custom error classes exist (`AppError`, `ValidationError`, etc.)
- [x] Error handler middleware exists and is properly integrated
- [x] Winston logger is configured
- [x] Error handler is last middleware in Express app
- [x] Standard error response format is used
- [x] `asyncHandler` wrapper exists for async routes

### Frontend ✅
- [x] `Toast` component created
- [x] `ToastProvider` wraps the app
- [x] `useToast` hook available
- [x] `useApiError` hook created
- [x] Axios interceptor enhanced with error transformation
- [x] `ApiError` class created
- [x] Norwegian error messages implemented
- [x] `ErrorBoundary` verified and working
- [x] Example component created for testing

---

## Manual Testing Steps

### 1. Test Toast Notifications

**File**: `/frontend/src/shared/components/ErrorHandlingExample.tsx`

1. Add route to this component temporarily
2. Test all toast types (success, error, info, warning)
3. Verify auto-dismiss after 5 seconds
4. Verify manual dismiss with close button
5. Verify multiple toasts stack properly

### 2. Test API Error Handling

#### Method 1: Mock API Errors (Recommended)

Create a test route in backend:

```typescript
// backend/src/routes/test.ts
router.get('/test/error/:code', (req, res, next) => {
  const code = parseInt(req.params.code);

  switch (code) {
    case 400:
      throw new ValidationError('Test validation error');
    case 403:
      throw new ForbiddenError('Test forbidden error');
    case 404:
      throw new NotFoundError('Test not found error');
    case 409:
      throw new ConflictError('Test conflict error');
    case 500:
      throw new InternalServerError('Test server error');
    default:
      res.json({ success: true });
  }
});
```

Then use `ErrorHandlingExample` component to test each error code.

#### Method 2: Real API Errors

1. Try to create a user with duplicate username (409)
2. Try to access a resource you don't own (403)
3. Try to access a non-existent resource (404)
4. Send invalid data to an endpoint (400)
5. Stop the backend server and try to make a request (network error)

### 3. Test Error Boundary

1. Use `ErrorHandlingExample` component
2. Click "Throw Rendering Error" button
3. Verify "Noe gikk galt" UI appears
4. Verify reload button works
5. Verify technical details are shown in collapsible section

### 4. Test 401 Auto-Redirect

1. Clear EasyAuth cookies
2. Make an API request that requires authentication
3. Verify redirect to login after 1.5 seconds
4. Verify toast message appears before redirect

### 5. Test TanStack Query Integration

Create a test component:

```typescript
function TestComponent() {
  const { data, error } = useQuery({
    queryKey: ['test'],
    queryFn: async () => {
      // This will fail
      const res = await client.get('/non-existent-endpoint');
      return res.data;
    },
  });

  useApiError(error); // Should show toast automatically

  return <div>{data?.message}</div>;
}
```

Verify:
- Error toast appears automatically
- Norwegian error message is shown
- Console logs show structured error data

### 6. Test TanStack Mutation Integration

Create a test component:

```typescript
function TestMutation() {
  const { showSuccess } = useToast();

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await client.post('/users/me/setup', data);
      return res.data;
    },
    onSuccess: () => showSuccess('User created!'),
  });

  useApiError(mutation.error);

  return (
    <button onClick={() => mutation.mutate({ username: 'test' })}>
      Create User
    </button>
  );
}
```

Verify:
- Success toast shows on success
- Error toast shows on error
- Norwegian messages are displayed

---

## Console Verification

### Backend Console

When an error occurs, you should see:

```json
{
  "timestamp": "2025-11-29 15:45:00",
  "level": "error",
  "message": "Request error",
  "error": "Validation failed",
  "stack": "ValidationError: Validation failed...",
  "path": "/api/v1/users/me/setup",
  "method": "POST",
  "ip": "::1",
  "statusCode": 400
}
```

### Frontend Console

When an API error occurs, you should see:

```javascript
API Error: {
  status: 400,
  code: "VALIDATION_ERROR",
  message: "Validation failed",
  url: "/users/me/setup"
}
```

---

## Network Tab Verification

### Error Response Format

All error responses should follow this format:

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

### Success Response Format

All success responses should follow this format:

```json
{
  "data": { ... },
  "success": true
}
```

---

## Error Message Translation Verification

Test each HTTP status code and verify Norwegian message:

| Status | Expected Norwegian Message |
|--------|----------------------------|
| 400 | "Ugyldig forespørsel. Vennligst sjekk inndataene dine." |
| 401 | "Du må logge inn for å få tilgang til denne ressursen." |
| 403 | "Du har ikke tilgang til denne ressursen." |
| 404 | "Ressursen ble ikke funnet." |
| 409 | "Ressursen finnes allerede." |
| 500 | "En serverfeil oppstod. Vennligst prøv igjen senere." |
| Network | "Kunne ikke nå serveren. Sjekk internettforbindelsen din." |

---

## Production Readiness Checklist

- [x] All error messages are in Norwegian
- [x] Backend errors are logged with structured data
- [x] Frontend errors are logged to console
- [x] Error responses follow standard format
- [x] Sensitive data is not exposed in error messages
- [x] Error Boundary catches rendering errors
- [x] 401 errors auto-redirect to login
- [x] Toast notifications auto-dismiss
- [x] Error handling doesn't crash the app
- [x] Documentation is complete

---

## Known Limitations

1. **No error tracking service** - Errors are only logged to console. Future: integrate Sentry or Application Insights.
2. **No retry logic** - Failed requests don't automatically retry. Future: implement exponential backoff.
3. **No offline detection** - App doesn't detect offline state. Future: implement offline mode.
4. **No rate limit handling** - 429 errors are treated as generic errors. Future: implement retry-after logic.

---

## Next Steps

1. Test all error scenarios in development
2. Verify error messages are clear and helpful
3. Monitor error logs in production
4. Consider adding error tracking service
5. Implement retry logic for transient errors
6. Add offline mode detection

---

## Files to Review

### Backend
- `/backend/src/errors/AppError.ts` - Custom error classes
- `/backend/src/middleware/errorHandler.ts` - Error handler middleware
- `/backend/src/utils/logger.ts` - Winston logger

### Frontend
- `/frontend/src/shared/components/Toast.tsx` - Toast system
- `/frontend/src/shared/components/ErrorBoundary.tsx` - Error boundary
- `/frontend/src/shared/api/client.ts` - Axios interceptor
- `/frontend/src/shared/hooks/useApiError.ts` - Error handling hook
- `/frontend/src/App.tsx` - App wrapper with providers

### Documentation
- `/frontend/src/shared/api/README.md` - Error handling guide
- `/.docs/IMPLEMENTATION-014-error-handling.md` - Implementation summary
- `/.docs/VERIFICATION-014-error-handling.md` - This file
