# FEATURE: Sparing (Savings) Page

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: High
**Labels**: page, sparing, frontend
**Estimated Effort**: Medium - 2-3 hours

## Context & Motivation

The Sparing page shows savings overview and F.I.R.E. progress tracking.

## Reference

Design file: `.docs/design-drafts/draft-1-sparing.html`

## Desired Outcome

Complete Sparing page with hero number, stats, F.I.R.E. section, and chart.

## Acceptance Criteria

- [ ] Create `/frontend/src/features/sparing/SparingPage.tsx`
- [ ] Add route `/sparing`
- [ ] PageHeader with title and subtitle
- [ ] HeroNumber showing sum sparing with yearly change
- [ ] StatsRow with 3 metrics (Sparerate, Siste måned, Måneder fri)
- [ ] FireSection with progress and 4 metrics
- [ ] AreaChart showing "Spareutvikling"
- [ ] Fade-up animations

## Technical Approach

```tsx
// SparingPage.tsx
export function SparingPage() {
  const { data, isLoading } = useSparingData();

  if (isLoading) return <SparingSkeleton />;

  return (
    <main className="sparing-page">
      <div className="container container--narrow">
        <PageHeader
          title="Sparing"
          subtitle="Din vei mot økonomisk frihet"
        />

        <HeroNumber
          label="Sum sparing"
          value={formatCurrency(data.sumSparing)}
          change={data.yearlyChange}
          changeLabel={`i ${new Date().getFullYear()}`}
        />

        <StatsRow stats={[
          { value: `${data.sparerate.toFixed(2)}%`, label: 'Sparerate' },
          { value: `+${data.monthlyChange.toFixed(2)}%`, label: 'Siste måned' },
          { value: String(data.monthsFree), label: 'Måneder fri' },
        ]} />

        <FireSection
          fireNumber={data.fireNumber}
          current={data.sumSparing}
          minRetireAge={data.minRetireAge}
          yearsToSalary={data.yearsToSalary}
          annualWithdrawal={data.annualWithdrawal}
        />

        <AreaChart
          data={data.history}
          title="Spareutvikling"
          subtitle={`+${formatCurrency(data.totalGrowth)} total`}
          color="var(--muted-sage)"
        />
      </div>
    </main>
  );
}
```

## Dependencies

- `027-FEATURE-page-header-component.md`
- `032-FEATURE-hero-number-component.md`
- `047-FEATURE-stats-row-component.md`
- `046-FEATURE-fire-section-component.md`
- `048-FEATURE-area-chart-component.md`

---

**Next Steps**: Implement after component dependencies
