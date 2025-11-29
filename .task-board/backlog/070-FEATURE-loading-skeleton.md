# FEATURE: Loading Skeleton Components

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: Medium
**Labels**: component, ui, ux
**Estimated Effort**: Simple - 1-2 hours

## Context & Motivation

Skeleton loading states for pages while data is being fetched, providing better UX than blank screens.

## Reference

General UX best practices

## Desired Outcome

Skeleton components for each page type.

## Acceptance Criteria

- [ ] Create `/frontend/src/shared/components/Skeleton.tsx` base component
- [ ] Create page-specific skeletons:
  - [ ] DashboardSkeleton
  - [ ] PortfolioSkeleton
  - [ ] SparingSkeleton
  - [ ] GjeldSkeleton
  - [ ] PensjonSkeleton
- [ ] Shimmer animation effect
- [ ] Match actual page layouts

## Technical Approach

```tsx
// Skeleton.tsx
interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rectangular' | 'circular';
  className?: string;
}

export function Skeleton({ width, height, variant = 'rectangular', className }: SkeletonProps) {
  return (
    <div
      className={`skeleton skeleton--${variant} ${className || ''}`}
      style={{ width, height }}
    />
  );
}

// DashboardSkeleton.tsx
export function DashboardSkeleton() {
  return (
    <div className="container">
      <div className="page-header">
        <Skeleton width={200} height={44} />
        <Skeleton width={150} height={20} />
      </div>

      <div className="hero-section">
        <Skeleton width={100} height={16} />
        <Skeleton width={300} height={84} />
        <Skeleton width={180} height={40} />
      </div>

      <div className="quick-stats">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} height={100} />
        ))}
      </div>
    </div>
  );
}
```

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bone) 0%,
    var(--warm-white) 50%,
    var(--bone) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 2px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

## Dependencies

- `021-FEATURE-design-tokens.md`

---

**Next Steps**: Implement for each page
