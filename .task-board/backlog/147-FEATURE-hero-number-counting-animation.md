# 122-FEATURE: Hero Number Counting Animation

## Summary
Add smooth counting animation to HeroNumber component when displaying large financial values. Numbers should animate from 0 to final value on mount.

## Context
Financial dashboards commonly use counting animations to draw attention to key metrics. The HeroNumber component displays net worth and other large values - animating these creates a more engaging experience.

## Acceptance Criteria
- [ ] Numbers animate from 0 to final value on mount
- [ ] Animation duration: 800-1200ms
- [ ] Use easing function (ease-out) for natural feel
- [ ] Format numbers correctly during animation (Norwegian format)
- [ ] Skip animation on subsequent renders (only on mount)
- [ ] Respect `prefers-reduced-motion` preference

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
