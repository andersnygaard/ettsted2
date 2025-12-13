# FEATURE: Quick Stats Grid Component

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: High
**Labels**: component, ui, dashboard
**Estimated Effort**: Simple - 30 minutes

## Context & Motivation

The quick stats grid displays 4 key metrics in a responsive grid on the dashboard.

## Reference

Design file: `.docs/design-drafts/draft-1-nordic-minimal.html` (lines 145-150, 326-343)

## Desired Outcome

4-column responsive grid for stat cards.

## Acceptance Criteria

- [ ] Create `/frontend/src/features/dashboard/QuickStatsGrid.tsx`
- [ ] Uses StatCard component
- [ ] 4 columns on desktop, 2 on tablet, 1 on mobile
- [ ] 20px gap between cards
- [ ] Staggered fade-in animation

## Technical Approach

```tsx
// QuickStatsGrid.tsx
interface QuickStat {
  value: string;
  label: string;
  href: string;
}

interface QuickStatsGridProps {
  stats: QuickStat[];
}

export function QuickStatsGrid({ stats }: QuickStatsGridProps) {
  return (
    <div className="quick-stats">
      {stats.map((stat, index) => (
        <StatCard
          key={stat.label}
          value={stat.value}
          label={stat.label}
          href={stat.href}
          className={`animate-fade-up animate-delay-${index + 1}`}
        />
      ))}
    </div>
  );
}
```

```css
.quick-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 80px;
}

@media (max-width: 1024px) {
  .quick-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .quick-stats {
    grid-template-columns: 1fr;
  }
}
```

## Dependencies

- `031-FEATURE-stat-card-component.md`
- `024-FEATURE-animation-utilities.md`

---

**Next Steps**: Implement for dashboard page
