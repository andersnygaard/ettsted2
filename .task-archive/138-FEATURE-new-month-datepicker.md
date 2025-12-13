# 138-FEATURE: New Month Modal Date Picker

**Priority**: Medium
**Effort**: Medium (1-2 hours)
**Labels**: frontend, components, ux

---

## Context

The "Ny måned" (New Month) modal for adding portfolio snapshots should have a proper date picker instead of a text input for the date field.

This improves UX and ensures correct date format (dd.MM.yyyy).

---

## Acceptance Criteria

- [ ] Date field uses a date picker component
- [ ] Default to first day of current month
- [ ] Output format: dd.MM.yyyy (Norwegian format)
- [ ] Month/year selection (not full calendar - we only track monthly)
- [ ] Prevent selecting future months
- [ ] Consistent with Nordic Minimal design

---

## Technical Approach

Options:
1. **Native HTML date input** - Simple but limited styling
2. **Custom month picker** - More control, Nordic Minimal styling
3. **Library** (react-datepicker) - Feature-rich but adds dependency

Recommend option 2 or 3. A month picker is sufficient since snapshots are monthly.

Simple month picker:
```tsx
<div className="month-picker">
  <select value={month} onChange={setMonth}>
    {months.map(m => <option key={m} value={m}>{m}</option>)}
  </select>
  <select value={year} onChange={setYear}>
    {years.map(y => <option key={y} value={y}>{y}</option>)}
  </select>
</div>
```

Or use existing `DateInput` component from `@finans/components` if it supports picking.

---

## Files to Modify

- [NewMonthModal.tsx](frontend/src/features/portfolio/NewMonthModal.tsx)
- [NewMonthModal.css](frontend/src/features/portfolio/NewMonthModal.css)

---

## Related

- May want to reuse/extend `DateInput` component from components workspace
