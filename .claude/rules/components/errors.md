---
paths:
  - components/**/*
---

# Errors Rules

## Stack
React Error Boundaries (class component)

## Structure
- `/system/ErrorBoundary/` - Catch and display React errors
- `/system/Toast/` - Toast notifications for user feedback

## Patterns
- ErrorBoundary wraps route-level components
- Class component required for `componentDidCatch`
- Custom fallback UI with Norwegian text

```typescript
// Usage
<ErrorBoundary>
  <PageComponent />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary fallback={(error, reset) => (
  <CustomError error={error} onReset={reset} />
)}>
  <PageComponent />
</ErrorBoundary>
```

## Toast Pattern
- Provider at app root: `<ToastProvider>`
- Hook for showing toasts: `const { showToast } = useToast()`
- Types: `success`, `error`, `info`, `warning`

```typescript
const { showToast } = useToast();
showToast({ type: 'error', message: 'Noe gikk galt' });
```

## Decisions
- Norwegian error messages in default fallback
- Technical details hidden in `<details>` expandable
- Console.error for debugging, no external service yet

## Gotchas
- ErrorBoundary only catches render errors, not event handlers
- For async errors, use try/catch with Toast
- Default fallback has reload button, custom can have reset
