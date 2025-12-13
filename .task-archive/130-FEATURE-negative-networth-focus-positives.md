# 130-FEATURE: Focus on Positives When Net Worth is Negative

**Priority**: Medium
**Effort**: Medium (1-2 hours)
**Labels**: frontend, ux, dashboard

---

## Context

When a user's net worth is negative (more debt than savings), the dashboard should focus on positive metrics to keep them motivated:

1. Show "Sum sparing" as the hero number instead of "Netto formue"
2. Show next milestone based on savings growth instead of net worth
3. Keep the negative net worth visible but de-emphasized

---

## Acceptance Criteria

- [ ] When `netWorth < 0`, display "Sum sparing" as hero value
- [ ] Milestone section tracks savings progress, not net worth progress
- [ ] Hero change percentage reflects savings change
- [ ] Net worth still visible somewhere (quick stats or secondary)
- [ ] Positive messaging (avoid showing large negative numbers prominently)

---

## Technical Approach

1. Add conditional logic in `DashboardPage.tsx`
2. If `data.netWorth < 0`:
   - Hero: Show `sumSparing` with label "Sum sparing"
   - Milestone: Calculate based on `sumSparing` progress
   - Quick stats: Show net worth here instead
3. Update `useDashboardData` if needed to provide savings milestone data

```tsx
const isNegativeNetWorth = data.netWorth < 0;

// Hero section
<div className="hero-section">
  <div className="hero-label">
    {isNegativeNetWorth ? 'Sum sparing' : 'Netto formue'}
  </div>
  <div className="hero-value">
    {formatCurrency(isNegativeNetWorth ? data.sumSparing : data.netWorth)}
  </div>
</div>

// Milestone section
const milestoneBase = isNegativeNetWorth ? data.sumSparing : data.currentTowardsMilestone;
```

---

## Files to Modify

- [DashboardPage.tsx](frontend/src/features/dashboard/DashboardPage.tsx)
- [useDashboardData.ts](frontend/src/features/dashboard/useDashboardData.ts) - May need savings milestone calculation

---

## UX Notes

- Users with negative net worth are often in early debt payoff stages
- Showing savings growth is more motivating than emphasizing debt
- Consider subtle messaging like "Du sparer godt!" when savings grow
