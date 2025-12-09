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
- [ ] Each major feature has own error boundary
- [ ] Error in one feature doesn't crash others
- [ ] Fallback UI shows helpful message
- [ ] Retry button resets error state
- [ ] Errors still logged to console

## Effort
Medium (1-2 hours)
