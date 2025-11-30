# FEATURE: Pensjon (Pension) Page

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: Medium
**Labels**: page, pensjon, frontend
**Estimated Effort**: Medium - 2 hours

## Context & Motivation

The Pensjon page shows pension savings overview with breakdown by source and projections.

## Reference

Design file: `.docs/design-drafts/draft-1-pensjon.html`

## Desired Outcome

Complete Pensjon page matching the design draft.

## Acceptance Criteria

- [ ] Create `/frontend/src/features/pensjon/PensjonPage.tsx`
- [ ] Add route `/pensjon`
- [ ] PageHeader with title and subtitle
- [ ] HeroNumber showing sum pensjon with retirement estimate note
- [ ] BreakdownCards (Arbeidsgiver 70%, NAV 30%)
- [ ] OtpSection with progress bar
- [ ] StackedAreaChart showing "Pensjonsutvikling"
- [ ] Fade-up animations

## Technical Approach

```tsx
// PensjonPage.tsx
export function PensjonPage() {
  const { data, isLoading } = usePensjonData();

  if (isLoading) return <PensjonSkeleton />;

  return (
    <main className="pensjon-page">
      <div className="container container--narrow">
        <PageHeader
          title="Pensjon"
          subtitle="Oppspart pensjon og fremtidig utbetaling"
        />

        <HeroNumber
          label="Sum pensjon"
          value={formatCurrency(data.sumPensjon)}
          changeLabel="Estimert ved pensjonering"
        />

        <BreakdownCards items={[
          {
            icon: '🏢',
            value: data.arbeidsgiver,
            label: 'Pensjon arbeidsgiver',
            percentage: 70,
            iconBg: 'rgba(184, 197, 208, 0.3)'
          },
          {
            icon: '🏛️',
            value: data.nav,
            label: 'Pensjon NAV',
            percentage: 30,
            iconBg: 'rgba(212, 149, 106, 0.2)'
          }
        ]} />

        <OtpSection percentage={data.otpPercentage} trend="up" />

        <StackedAreaChart
          data={data.history}
          series={[
            { key: 'arbeidsgiver', color: 'var(--pale-blue)', label: 'Arbeidsgiver' },
            { key: 'nav', color: 'var(--orange)', label: 'NAV' }
          ]}
          title="Pensjonsutvikling"
        />
      </div>
    </main>
  );
}
```

## Dependencies

- `027-FEATURE-page-header-component.md`
- `032-FEATURE-hero-number-component.md`
- `054-FEATURE-breakdown-cards-component.md`
- `055-FEATURE-otp-section-component.md`
- `056-FEATURE-stacked-area-chart.md`

---

**Next Steps**: Implement after component dependencies
