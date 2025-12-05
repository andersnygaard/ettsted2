# 139-FEATURE: New Month Modal Copy Previous Values

**Priority**: Medium
**Effort**: Medium (1-2 hours)
**Labels**: frontend, ux

---

## Context

When creating a new monthly snapshot in the "Ny måned" modal, users often want to carry forward values from the previous month. Currently they must re-enter all values manually.

Options:
1. Auto-populate with last month's values (default)
2. Add a "Kopier fra forrige" button

Option 1 is recommended - most users update existing values rather than starting fresh.

---

## Acceptance Criteria

- [ ] New month modal pre-fills with values from most recent snapshot
- [ ] All account values are copied
- [ ] User can modify values before saving
- [ ] If no previous snapshot exists, start with zeros
- [ ] Clear visual indication that values are copied (optional)

---

## Technical Approach

1. Fetch latest snapshot when modal opens
2. Use those values as initial state for the form
3. User modifies as needed and submits

```tsx
// In NewMonthModal.tsx
const { data: latestSnapshot } = useQuery({
  queryKey: ['snapshots', 'latest'],
  queryFn: () => getLatestSnapshot(),
});

// Initialize form with latest values
useEffect(() => {
  if (latestSnapshot) {
    setFormData(prev => ({
      ...prev,
      accounts: latestSnapshot.accounts.map(a => ({
        name: a.name,
        value: a.value,
        assetClass: a.assetClass,
      })),
    }));
  }
}, [latestSnapshot]);
```

---

## Files to Modify

- [NewMonthModal.tsx](frontend/src/features/portfolio/NewMonthModal.tsx)
- Possibly [portfolioService.ts](frontend/src/shared/api/portfolioService.ts) - Add `getLatestSnapshot()`

---

## Alternative: Button Approach

If auto-fill is too aggressive, add a button:
```tsx
<button onClick={copyFromPrevious}>
  Kopier fra forrige måned
</button>
```

---

## Notes

- Consider showing "Verdier kopiert fra [forrige dato]" toast/notice
- Handle edge case: new user with no previous snapshots
