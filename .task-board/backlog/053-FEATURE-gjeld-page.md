# FEATURE: Gjeld (Debt) Page

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: Medium
**Labels**: page, gjeld, frontend
**Estimated Effort**: Medium - 2 hours

## Context & Motivation

The Gjeld page shows debt overview with coverage visualization, active loans, and trend chart.

## Reference

Design file: `.docs/design-drafts/draft-1-gjeld.html`

## Desired Outcome

Complete Gjeld page matching the design draft.

## Acceptance Criteria

- [ ] Create `/frontend/src/features/gjeld/GjeldPage.tsx`
- [ ] Add route `/gjeld`
- [ ] PageHeader with title and subtitle
- [ ] HeroNumber showing sum gjeld with monthly change
- [ ] DekningSection with donut chart
- [ ] LoansList showing active loans
- [ ] AreaChart showing "Gjeldsutvikling" (decreasing trend)
- [ ] Fade-up animations

## Technical Approach

```tsx
// GjeldPage.tsx
export function GjeldPage() {
  const { data, isLoading } = useGjeldData();

  if (isLoading) return <GjeldSkeleton />;

  return (
    <main className="gjeld-page">
      <div className="container container--narrow">
        <PageHeader
          title="Gjeld"
          subtitle="Oversikt over lån og nedbetaling"
        />

        <HeroNumber
          label="Sum gjeld"
          value={formatCurrency(data.sumGjeld)}
          change={data.monthlyChange}
          changeLabel="denne måneden"
        />

        <DekningSection
          sumSparing={data.sumSparing}
          sumGjeld={data.sumGjeld}
        />

        <LoansList loans={data.loans} />

        <AreaChart
          data={data.history}
          title="Gjeldsutvikling"
          subtitle="Nedgang over tid"
          color="var(--pale-blue)"
        />
      </div>
    </main>
  );
}
```

## Dependencies

- `027-FEATURE-page-header-component.md`
- `032-FEATURE-hero-number-component.md`
- `051-FEATURE-dekning-section-component.md`
- `052-FEATURE-loans-list-component.md`
- `048-FEATURE-area-chart-component.md`

---

**Next Steps**: Implement after component dependencies
