# REFACTOR: Error Handling and Logging Framework

**Status**: Backlog
**Created**: 2025-11-28
**Priority**: Medium
**Labels**: backend, frontend, error-handling, logging, refactor
**Estimated Effort**: Medium - 2 days

## Context & Motivation

Consistent error handling and logging across backend and frontend ensures better debugging and user experience.

## Desired Outcome

**Backend**:
- Custom error classes (ValidationError, NotFoundError, ConflictError, ForbiddenError)
- Global error handler middleware
- Winston logger with structured logging
- Error responses in standard format

**Frontend**:
- Error boundary for React errors
- Axios interceptor for API errors
- Toast notifications for user-friendly errors
- Error logging (console for now, future: error tracking service)

## Acceptance Criteria

- [ ] Custom error classes with statusCode and code properties
- [ ] Global error handler catches all errors
- [ ] Winston logger logs errors with context
- [ ] Frontend error boundary catches React errors
- [ ] Axios interceptor handles API errors globally
- [ ] Toast notifications for errors
- [ ] All error responses follow standard format

## Technical Approach

**Custom Error Classes**:
```typescript
export class AppError extends Error {
  constructor(public message: string, public statusCode: number, public code: string) {
    super(message);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}
```

**Frontend Error Boundary**:
```tsx
export class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Noe gikk galt. <button onClick={() => window.location.reload()}>Last inn på nytt</button></div>;
    }
    return this.props.children;
  }
}
```

## Dependencies

- `FEATURE-backend-express-server.md` (uses Winston logger)
- `FEATURE-frontend-react-initialization.md` (error boundary)

---

**Next Steps**: Ready after backend and frontend initialization.
