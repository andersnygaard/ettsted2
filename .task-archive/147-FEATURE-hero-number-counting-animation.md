# 122-FEATURE: Hero Number Counting Animation

## Summary
Add smooth counting animation to HeroNumber component when displaying large financial values. Numbers should animate from 0 to final value on mount.

## Context
Financial dashboards commonly use counting animations to draw attention to key metrics. The HeroNumber component displays net worth and other large values - animating these creates a more engaging experience.

## Acceptance Criteria
- [x] Numbers animate from 0 to final value on mount
- [x] Animation duration: 800-1200ms (default 1000ms, configurable)
- [x] Use easing function (ease-out cubic) for natural feel
- [x] Format numbers correctly during animation (Norwegian format with Intl.NumberFormat)
- [x] Skip animation on subsequent renders (only on mount)
- [x] Respect `prefers-reduced-motion` preference

## Technical Approach
1. Create `useCountAnimation` hook in `frontend/src/shared/hooks/`
2. Use `requestAnimationFrame` for smooth performance
3. Integrate with existing `formatCurrency` util
4. Add `animate` prop to HeroNumber component (default: true)

### Hook Implementation
```typescript
function useCountAnimation(target: number, duration = 1000) {
  const [current, setCurrent] = useState(0);
  // RAF-based animation logic
  return current;
}
```

## Files to Modify
- [HeroNumber.tsx](components/src/data/HeroNumber/HeroNumber.tsx)
- Create `useCountAnimation.ts` hook

## Priority
High

## Effort
Medium (3-4 hours)

## Labels
design, animation, polish, ux

---

## Implementation Summary

### Completed Changes

1. **Created `useCountAnimation` Hook** (`components/src/hooks/useCountAnimation.ts`)
   - Implements RAF-based animation with ease-out cubic easing
   - Respects `prefers-reduced-motion` user preference
   - Configurable duration and enable/disable option
   - Returns current animated value that updates 60fps

2. **Updated HeroNumber Component** (`components/src/data/HeroNumber/HeroNumber.tsx`)
   - Enhanced to accept `value` as either `string` or `number`
   - When `number` provided: applies counting animation
   - When `string` provided: renders directly (backward compatible)
   - Added `animate` prop (default: true)
   - Added `animationDuration` prop (default: 1000ms)
   - Uses local `formatCurrency` function with `Intl.NumberFormat` for Norwegian formatting

3. **Exported Hook** from components workspace
   - Added to `components/src/index.ts` for external use
   - Re-exported from `frontend/src/shared/hooks/index.ts` for consistency

### Technical Details

**Animation Logic:**
- Uses `requestAnimationFrame` for 60fps smooth animation
- Ease-out cubic formula: `1 - (1 - x)^3`
- Automatically cancels animation on unmount
- Skips animation if `prefers-reduced-motion` is enabled

**Backward Compatibility:**
- Existing usages passing formatted strings continue to work
- No breaking changes to HeroNumber API
- New numeric value support is opt-in

### Files Modified

- `components/src/hooks/useCountAnimation.ts` (new)
- `components/src/data/HeroNumber/HeroNumber.tsx` (updated)
- `components/src/index.ts` (updated - export hook)
- `frontend/src/shared/hooks/index.ts` (updated - re-export hook)

### Build Status
✅ Frontend builds successfully
✅ TypeScript compilation passes
✅ No breaking changes introduced

## Status
**COMPLETED** - 2025-12-06
