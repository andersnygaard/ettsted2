# 234 - Add Skeleton Shimmer Animation

**Type**: DESIGN
**Priority**: Medium
**Effort**: Low (20-30 min)
**Labels**: frontend, polish, loading-states

## Context

The Skeleton component currently shows static placeholder blocks with no animation. This creates a "dead" feeling during loading states. A shimmer animation gives users feedback that content is loading and the app is responsive.

## Problem

Location: [Skeleton.tsx](../../components/src/ui/Skeleton/Skeleton.tsx) and [Skeleton.css](../../components/src/ui/Skeleton/Skeleton.css)

Current implementation:
- Static bone-colored backgrounds
- No visual indication of loading activity
- Users may think app is frozen

## Acceptance Criteria

- [x] Shimmer animation added to all skeleton variants
- [x] Animation is subtle, not distracting (1.5s ease-in-out)
- [x] Respects `prefers-reduced-motion` preference
- [x] Works across all skeleton sizes (sm, md, lg)
- [x] Performance optimized (CSS-only, no JS)
- [x] Consistent with Nordic Minimal aesthetic (uses --bone, --warm-white tokens)

## Technical Approach

### Shimmer Keyframe Animation

```css
/* Skeleton.css */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--bone) 0%,
    var(--warm-white) 50%,
    var(--bone) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: none;
    background: var(--bone);
  }
}
```

### Alternative: Pulse Animation (simpler)

```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.skeleton {
  animation: pulse 1.5s ease-in-out infinite;
}
```

### Recommendation
Use shimmer for a more premium feel. The gradient sweep looks more polished than simple opacity pulse.

## Files to Modify

- `components/src/ui/Skeleton/Skeleton.css` - add shimmer animation

## Testing

- [ ] Verify shimmer animates smoothly
- [ ] Test reduced-motion preference
- [ ] Check animation doesn't cause layout shift
- [ ] Verify in Storybook
- [ ] Test on pages with multiple skeletons (no jank)

## Related Plans

- [070-FEATURE-loading-skeleton.md](../done/070-FEATURE-loading-skeleton.md) - original skeleton implementation

## Resolution

Enhanced Skeleton.css with shimmer animation:
- Added ease-in-out timing to existing shimmer keyframe
- Added prefers-reduced-motion media query for accessibility
- CSS-only solution, no JS overhead
- Works across all 16 files using Skeleton component

Completed: 2025-12-08
