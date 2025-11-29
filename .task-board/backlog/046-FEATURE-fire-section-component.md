# FEATURE: F.I.R.E. Section Component

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: High
**Labels**: component, ui, sparing
**Estimated Effort**: Medium - 2 hours

## Context & Motivation

The F.I.R.E. section on the Sparing page shows progress toward financial independence with a progress bar and 4 key metrics.

## Reference

Design file: `.docs/design-drafts/draft-1-sparing.html` (lines 167-250, 366-400)

## Desired Outcome

Complete F.I.R.E. progress section with all metrics.

## Acceptance Criteria

- [ ] Create `/frontend/src/features/sparing/FireSection.tsx`
- [ ] Props: `fireNumber`, `current`, `minRetireAge`, `yearsToSalary`, `annualWithdrawal`
- [ ] Header with title and subtitle
- [ ] Progress bar showing % toward F.I.R.E. number
- [ ] 4-column grid of metrics below
- [ ] Sage green accent for highlight values
- [ ] Warm-white card background

## Technical Approach

```tsx
// FireSection.tsx
interface FireSectionProps {
  fireNumber: number;
  current: number;
  minRetireAge: number;
  yearsToSalary: number;
  annualWithdrawal: number;
}

export function FireSection({
  fireNumber,
  current,
  minRetireAge,
  yearsToSalary,
  annualWithdrawal
}: FireSectionProps) {
  const percentage = (current / fireNumber) * 100;

  return (
    <div className="fire-section">
      <div className="fire-header">
        <h2>F.I.R.E. Fremgang</h2>
        <p>Financial Independence, Retire Early</p>
      </div>

      <div className="fire-progress">
        <ProgressBar
          value={percentage}
          variant="default"
          height={20}
          leftLabel={`${percentage.toFixed(2)}% oppnådd`}
          rightLabel={`${formatCurrency(current)} / ${formatCurrency(fireNumber)}`}
        />
      </div>

      <div className="fire-stats">
        <div className="fire-stat">
          <div className="fire-stat__value fire-stat__value--highlight">
            {(fireNumber / 1000000).toFixed(1)}M
          </div>
          <div className="fire-stat__label">Firetall</div>
        </div>
        <div className="fire-stat">
          <div className="fire-stat__value">{minRetireAge.toFixed(1)}</div>
          <div className="fire-stat__label">Min. pensjonsalder</div>
        </div>
        <div className="fire-stat">
          <div className="fire-stat__value">{yearsToSalary.toFixed(1)}</div>
          <div className="fire-stat__label">År til årslønn</div>
        </div>
        <div className="fire-stat">
          <div className="fire-stat__value">{formatNumber(annualWithdrawal)}</div>
          <div className="fire-stat__label">Årlig uttak (4%)</div>
        </div>
      </div>
    </div>
  );
}
```

## Dependencies

- `021-FEATURE-design-tokens.md`
- `033-FEATURE-progress-bar-component.md`

---

**Next Steps**: Implement for Sparing page
