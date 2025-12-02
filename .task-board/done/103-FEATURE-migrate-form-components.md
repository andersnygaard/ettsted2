# FEATURE: Migrate Form Components to Storybook

**Status**: Done
**Created**: 2025-12-01
**Priority**: High
**Labels**: components, storybook, migration, forms
**Estimated Effort**: Medium - 2 hours

## Context & Motivation

3 form input components with Norwegian formatting exist in frontend. These are reusable across all data entry scenarios and should be in the shared library with clear documentation of Norwegian formatting rules.

## Desired Outcome

Form components are in `/components/src/forms/` with stories demonstrating Norwegian number/date formatting and all input states.

## Acceptance Criteria

- [x] Migrate NumberInput.tsx + NumberInput.css
- [x] Migrate DateInput.tsx + DateInput.css
- [x] Migrate ProgressBar.tsx + ProgressBar.css
- [x] Include formatNumber utility (Norwegian: space thousands, comma decimal)
- [x] Include formatDate utility (Norwegian: dd.MM.yyyy)
- [x] Stories demonstrate:
  - Norwegian number formatting (123 456,78 kr)
  - Norwegian date formatting (01.12.2024)
  - Month picker mode
  - Validation states
  - Disabled states
- [x] Export all from `components/src/index.ts`

## Technical Approach

**NumberInput stories:**
- Default (empty)
- With value (showing Norwegian formatting)
- With suffix (kr)
- Disabled state
- Error state

**DateInput stories:**
- Default date picker
- Month picker mode
- With value
- Disabled state

**ProgressBar stories:**
- Default variant
- Gold variant (milestones)
- Blue variant
- With label
- Various percentages (0%, 50%, 100%)

**Utilities to include:**
```tsx
// src/utils/formatNumber.ts
export function formatNumber(value: number): string {
  return value.toLocaleString('nb-NO')
}

// src/utils/formatDate.ts
export function formatDate(date: Date): string {
  return date.toLocaleDateString('nb-NO')
}
```

**Source files:**
- `frontend/src/shared/components/NumberInput.tsx`
- `frontend/src/shared/components/DateInput.tsx`
- `frontend/src/shared/components/ProgressBar.tsx`

## Implementation Complete

### Files Created/Modified

**Components:**
- `/components/src/forms/NumberInput/NumberInput.tsx` - Updated to use utility functions
- `/components/src/forms/NumberInput/NumberInput.css` - Nordic Minimal styling
- `/components/src/forms/NumberInput/NumberInput.stories.tsx` - 8 stories with Norwegian formatting
- `/components/src/forms/DateInput/DateInput.tsx` - Updated to use utility functions
- `/components/src/forms/DateInput/DateInput.css` - Nordic Minimal styling
- `/components/src/forms/DateInput/DateInput.stories.tsx` - 7 stories with month picker mode
- `/components/src/forms/ProgressBar/ProgressBar.tsx` - Complete with variants
- `/components/src/forms/ProgressBar/ProgressBar.css` - Gold, default, blue variants
- `/components/src/forms/ProgressBar/ProgressBar.stories.tsx` - 11 stories

**Utilities:**
- `/components/src/forms/utils/numberFormat.ts` - formatNumber, parseNumber (Norwegian formatting)
- `/components/src/forms/utils/dateFormat.ts` - formatDate, parseNorwegianDate, getFirstDayOfMonth
- `/components/src/forms/index.ts` - Barrel export for forms
- `/components/src/index.ts` - Updated main export with utilities

### Verification

- Storybook build: ✓ All 26 stories compile successfully
- Norwegian number formatting: ✓ Space as thousands separator, comma as decimal (123 456,78)
- Norwegian date formatting: ✓ dd.MM.yyyy format (01.12.2024)
- Error states: ✓ Demonstrated in all input components
- Disabled states: ✓ Demonstrated in all input components
- Progress variants: ✓ Default, gold (milestones), blue

## Dependencies

- Task 101 (Storybook config) must be complete ✓

---

**Next Steps**: Migrate data display components (104)
