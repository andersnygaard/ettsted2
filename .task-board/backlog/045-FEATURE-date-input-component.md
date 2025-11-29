# FEATURE: Date Input Component

**Status**: Backlog
**Created**: 2025-11-29
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

- [ ] Create `/frontend/src/shared/components/DateInput.tsx`
- [ ] Props: `value`, `onChange`, `label`, `placeholder`
- [ ] Display in dd.MM.yyyy format
- [ ] Calendar picker (optional)
- [ ] Parse input to Date object
- [ ] Validation for valid dates
- [ ] Error state styling

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

**Next Steps**: Core form component
