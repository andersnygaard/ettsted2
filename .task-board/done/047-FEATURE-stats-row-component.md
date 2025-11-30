# FEATURE: Stats Row Component

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: Medium
**Labels**: component, ui
**Estimated Effort**: Simple - 30 minutes

## Context & Motivation

3-column row of stat cards used on Sparing page (Sparerate, Siste måned, Måneder fri).

## Reference

Design file: `.docs/design-drafts/draft-1-sparing.html` (lines 138-165, 351-364)

## Desired Outcome

3-column responsive grid of stat cards.

## Acceptance Criteria

- [ ] Create `/frontend/src/shared/components/StatsRow.tsx`
- [ ] Props: `stats` (array of value/label pairs)
- [ ] 3 columns on desktop, 1 on mobile
- [ ] Uses JetBrains Mono for values
- [ ] Staggered fade-in animation

## Technical Approach

```tsx
// StatsRow.tsx
interface Stat {
  value: string;
  label: string;
}

interface StatsRowProps {
  stats: Stat[];
}

export function StatsRow({ stats }: StatsRowProps) {
  return (
    <div className="stats-row">
      {stats.map((stat, index) => (
        <div key={stat.label} className={`stat-card animate-fade-up animate-delay-${index + 1}`}>
          <div className="stat-card__value">{stat.value}</div>
          <div className="stat-card__label">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
```

```css
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 64px;
}

@media (max-width: 768px) {
  .stats-row {
    grid-template-columns: 1fr;
  }
}

.stat-card__value {
  font-family: var(--font-mono);
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 8px;
}

.stat-card__label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
}
```

## Dependencies

- `021-FEATURE-design-tokens.md`
- `024-FEATURE-animation-utilities.md`

---

**Next Steps**: Implement for Sparing page
