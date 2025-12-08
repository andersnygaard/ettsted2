# Task 218: Add Console Statement ESLint Rules

**Priority**: Medium
**Category**: Code Quality
**Effort**: Medium (30 min)
**Impact**: Code Quality +1 point

## Problem

~41 console statements without environment guards.

## Files

- `frontend/.eslintrc.cjs` or `frontend/eslint.config.js`
- Various files with console statements

## Implementation

1. Add ESLint rule:
```javascript
'no-console': ['warn', { allow: ['warn', 'error'] }]
```

2. Create helper:
```typescript
export const isDevelopment = import.meta.env.DEV;
```

3. Wrap debug logs:
```typescript
if (isDevelopment) console.log('Debug:', data);
```

## Acceptance Criteria

- [x] ESLint warns on console.log
- [x] console.warn/error allowed
- [x] All warnings resolved or suppressed
