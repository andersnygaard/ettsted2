# FEATURE: Date Input Component

**Status**: Done
**Created**: 2025-11-29
**Completed**: 2025-11-29
**Priority**: High
**Labels**: component, forms, localization
**Estimated Effort**: Simple - 1 hour

## Context & Motivation

Date input for snapshot dates, formatted as Norwegian dd.MM.yyyy format.

## Reference

Norwegian date format: `01.01.2024`

## Desired Outcome

Date input component with Norwegian date format.

## Acceptance Criteria

- [x] Create `/frontend/src/shared/components/DateInput.tsx`
- [x] Props: `value`, `onChange`, `label`, `placeholder`, `error`
- [x] Display in dd.MM.yyyy format
- [x] Calendar picker (optional - not implemented, text input only)
- [x] Parse input to Date object
- [x] Validation for valid dates
- [x] Error state styling
- [x] Create `/frontend/src/shared/components/DateInput.css`
- [x] Export from `/frontend/src/shared/components/index.ts`
- [x] Norwegian date formatting utilities in `/frontend/src/shared/utils/dateFormat.ts`
- [x] Month picker mode for portfolio snapshots
- [x] Accessibility features (aria-invalid, aria-describedby)
- [x] TypeScript compiles successfully

## Technical Approach

```tsx
// DateInput.tsx
interface DateInputProps {
  value: Date | undefined;
  onChange: (value: Date | undefined) => void;
  label?: string;
  placeholder?: string;
  error?: string;
}

export function DateInput({
  value,
  onChange,
  label,
  placeholder = 'dd.MM.yyyy',
  error
}: DateInputProps) {
  const [displayValue, setDisplayValue] = useState(
    value ? formatDate(value, 'dd.MM.yyyy') : ''
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setDisplayValue(input);

    // Parse dd.MM.yyyy format
    const parsed = parseDate(input);
    onChange(parsed);
  };

  return (
    <div className={`date-input ${error ? 'date-input--error' : ''}`}>
      {label && <label className="date-input__label">{label}</label>}
      <input
        type="text"
        className="date-input__field"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
      />
      {error && <span className="date-input__error">{error}</span>}
    </div>
  );
}
```

## Dependencies

- `021-FEATURE-design-tokens.md`
- Norwegian localization utilities (task 004 complete)

---

## Implementation Summary

### Files Created
1. **`/frontend/src/shared/components/DateInput.tsx`** (240 lines)
   - Full-featured date input component with Norwegian formatting
   - Props: `value`, `onChange`, `label`, `placeholder`, `error`, `disabled`, `required`, `name`, `id`, `monthPicker`
   - Internal date parsing with validation (dd.MM.yyyy format)
   - Month picker mode that always returns 1st of month
   - Accessibility features (ARIA attributes)
   - JetBrains Mono font for input field

2. **`/frontend/src/shared/components/DateInput.css`** (85 lines)
   - Nordic Minimal styling matching NumberInput pattern
   - Error state styling with negative color
   - Disabled state styling
   - Focus states with border color transitions
   - Responsive font size adjustments
   - Consistent with design tokens

3. **`/frontend/src/shared/utils/dateFormat.ts`** (144 lines)
   - `formatDate()` - Format Date to dd.MM.yyyy
   - `parseDate()` - Parse dd.MM.yyyy to Date
   - `toISOString()` - Convert Date to ISO 8601 for API
   - `fromISOString()` - Parse ISO 8601 from API
   - `formatDateLong()` - Format with month name (e.g., "1. januar 2024")
   - `getFirstDayOfMonth()` - Get 1st day of month for snapshots

### Features Implemented
- **Norwegian date format**: dd.MM.yyyy (01.01.2024)
- **Partial input support**: Allows typing without validation errors
- **Auto-formatting**: Re-formats on blur for consistency
- **Date validation**: Checks for valid dates (no Feb 30, etc.)
- **Year range validation**: 1900-2100
- **Month picker mode**: Optional mode that always returns 1st of month
- **Error states**: Visual feedback with negative color
- **Disabled states**: Proper disabled styling
- **Required indicator**: Optional asterisk for required fields
- **Accessibility**: ARIA attributes for screen readers
- **Form integration**: name and id props for forms

### Integration
- Exported from `/frontend/src/shared/components/index.ts`
- Uses date-fns with Norwegian (Bokmål) locale
- Follows Nordic Minimal design system
- Matches NumberInput component patterns

### Build Status
- TypeScript compilation: ✓ Success
- Frontend build: ✓ Success (2.13s)

**Next Steps**: Core form component
