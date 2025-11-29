# FEATURE: Number Input Component

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: High
**Labels**: component, forms, localization
**Estimated Effort**: Simple - 1-2 hours

## Context & Motivation

Financial data entry requires Norwegian-formatted number inputs (space as thousands separator, comma as decimal). This component handles formatting on display and parsing on input.

## Reference

Norwegian number format: `123 456,78`

## Desired Outcome

Input component that displays/accepts Norwegian number format.

## Acceptance Criteria

- [ ] Create `/frontend/src/shared/components/NumberInput.tsx`
- [ ] Props: `value`, `onChange`, `label`, `suffix`, `placeholder`
- [ ] Display value formatted as Norwegian number
- [ ] Parse input back to raw number
- [ ] Handle partial input gracefully
- [ ] Optional "kr" suffix
- [ ] Error state styling
- [ ] Uses JetBrains Mono font

## Technical Approach

```tsx
// NumberInput.tsx
interface NumberInputProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  label?: string;
  suffix?: string;
  placeholder?: string;
  error?: string;
}

export function NumberInput({
  value,
  onChange,
  label,
  suffix = 'kr',
  placeholder = '0',
  error
}: NumberInputProps) {
  const [displayValue, setDisplayValue] = useState(
    value !== undefined ? formatNumber(value) : ''
  );

  useEffect(() => {
    if (value !== undefined) {
      setDisplayValue(formatNumber(value));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setDisplayValue(input);

    // Parse Norwegian format: "123 456,78" → 123456.78
    const normalized = input
      .replace(/\s/g, '')     // Remove spaces
      .replace(',', '.');      // Comma to dot

    const parsed = parseFloat(normalized);
    onChange(isNaN(parsed) ? undefined : parsed);
  };

  const handleBlur = () => {
    // Re-format on blur
    if (value !== undefined) {
      setDisplayValue(formatNumber(value));
    }
  };

  return (
    <div className={`number-input ${error ? 'number-input--error' : ''}`}>
      {label && <label className="number-input__label">{label}</label>}
      <div className="number-input__wrapper">
        <input
          type="text"
          inputMode="decimal"
          className="number-input__field"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
        />
        {suffix && <span className="number-input__suffix">{suffix}</span>}
      </div>
      {error && <span className="number-input__error">{error}</span>}
    </div>
  );
}
```

## Dependencies

- `021-FEATURE-design-tokens.md`
- Norwegian localization utilities (task 004 complete)

---

**Next Steps**: Core form component
