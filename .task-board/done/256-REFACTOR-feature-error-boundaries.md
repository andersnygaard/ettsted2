# 256 - Add Feature-Level Error Boundaries

## Type
Refactor

## Priority
Low

## Description
Currently only a single top-level ErrorBoundary exists in App.tsx. One component crash brings down the entire app. Add feature-level error boundaries for resilience.

## Source
Due Diligence Report - Areas for Improvement

## Implementation

Add error boundaries around:
1. Dashboard feature
2. Portfolio feature
3. Calculator feature
4. Import feature
5. Settings/Onboarding feature

### Pattern:
```tsx
// In each feature's routes or main component
<ErrorBoundary fallback={<FeatureErrorFallback />}>
  <FeatureContent />
</ErrorBoundary>
```

### Files to modify:
- `frontend/src/App.tsx` - Wrap route groups
- Create `FeatureErrorFallback` component with retry button

## Acceptance Criteria
- [x] Each major feature has own error boundary
- [x] Error in one feature doesn't crash others
- [x] Fallback UI shows helpful message
- [x] Retry button resets error state
- [x] Errors still logged to console

## Effort
Medium (1-2 hours)

## Resolution

Added feature-level error boundaries to all protected routes in `frontend/src/routes/index.tsx`.

### Files Modified
- `frontend/src/routes/index.tsx` - Wrapped all feature routes with ErrorBoundary + FeatureErrorFallback
- `frontend/src/shared/components/index.ts` - Added ErrorBoundary export from @finans/components
- `frontend/src/shared/components/FeatureErrorFallback.tsx` - Already existed with proper retry functionality

### Features Covered
- Dashboard (oversikt)
- Portfolio (portefolje)
- Import
- Sparing
- Gjeld
- Pensjon
- All calculator routes (kalkulatorer, rentes-rente, fire, lan, monte-carlo)
- Economy settings (okonomi, min-okonomi)

### Implementation Pattern
```tsx
<ErrorBoundary fallback={(error, reset) =>
  <FeatureErrorFallback error={error} reset={reset} featureName="FeatureName" />
}>
  <FeaturePage />
</ErrorBoundary>
```
