# FEATURE: Sparing Data Hook

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: High
**Labels**: frontend, hooks, data
**Estimated Effort**: Simple - 1-2 hours

## Context & Motivation

Custom hook to fetch and calculate F.I.R.E. metrics for the Sparing page.

## Reference

Sparing page requirements and F.I.R.E. calculations in CLAUDE.md

## Desired Outcome

TanStack Query hook providing sparing and F.I.R.E. data.

## Acceptance Criteria

- [ ] Create `/frontend/src/features/sparing/useSparingData.ts`
- [ ] Fetches snapshots for history
- [ ] Calculates sum sparing and yearly change
- [ ] Calculates F.I.R.E. number (25x annual expenses)
- [ ] Calculates minimum retirement age
- [ ] Calculates years until savings = annual salary
- [ ] Calculates annual withdrawal at 4%
- [ ] Calculates months of financial freedom
- [ ] Returns historical data for chart

## Technical Approach

```typescript
// useSparingData.ts
interface SparingData {
  sumSparing: number;
  yearlyChange: number;
  monthlyChange: number;
  sparerate: number;
  monthsFree: number;
  fireNumber: number;
  fireProgress: number;
  minRetireAge: number;
  yearsToSalary: number;
  annualWithdrawal: number;
  totalGrowth: number;
  history: { date: Date; value: number }[];
}

export function useSparingData() {
  return useQuery({
    queryKey: ['sparing'],
    queryFn: async (): Promise<SparingData> => {
      const { data: snapshots } = await apiClient.get('/snapshots');

      const latest = snapshots[0];
      const yearStart = snapshots.find(s => isStartOfYear(s.date));
      const first = snapshots[snapshots.length - 1];

      const sumSparing = calculateSumSparing(latest.accounts);
      const annualExpenses = 256000; // TODO: Get from user settings
      const annualIncome = 800000; // TODO: Get from user settings
      const currentAge = 35; // TODO: Get from user settings

      const fireNumber = annualExpenses * 25;
      const sparerate = ((annualIncome - annualExpenses) / annualIncome) * 100;
      const monthsFree = Math.floor(sumSparing / (annualExpenses / 12));
      const annualWithdrawal = sumSparing * 0.04;

      // Calculate years to F.I.R.E. using compound growth formula
      const yearsToFire = calculateYearsToFire(sumSparing, fireNumber, sparerate, annualIncome);
      const minRetireAge = currentAge + yearsToFire;

      const yearsToSalary = calculateYearsToValue(sumSparing, annualIncome, sparerate, annualIncome);

      return {
        sumSparing,
        yearlyChange: calculateYearlyChange(latest, yearStart),
        monthlyChange: calculateMonthlyChange(snapshots),
        sparerate,
        monthsFree,
        fireNumber,
        fireProgress: (sumSparing / fireNumber) * 100,
        minRetireAge,
        yearsToSalary,
        annualWithdrawal,
        totalGrowth: sumSparing - calculateSumSparing(first.accounts),
        history: snapshots.map(s => ({
          date: parseDate(s.date),
          value: calculateSumSparing(s.accounts)
        })).reverse()
      };
    }
  });
}
```

## Dependencies

- Portfolio API endpoints (complete)

---

**Next Steps**: Implement for Sparing page
