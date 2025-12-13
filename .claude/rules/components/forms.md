---
paths:
  - components/**/*
---

# Forms Rules

## Stack
React controlled inputs, Norwegian locale formatting

## Structure
- `/forms/NumberInput/` - Financial number input with Norwegian formatting
- `/forms/DateInput/` - Date picker with dd.MM.yyyy format
- `/forms/ProgressBar/` - Visual progress indicator
- `/forms/utils/numberFormat.ts` - Number formatting utilities
- `/forms/utils/dateFormat.ts` - Date formatting utilities

## Patterns
- Controlled components with `value` + `onChange` props
- Display value tracked separately for partial input during typing
- Format on blur, not on every keystroke
- `inputMode="decimal"` for mobile numeric keyboard

```typescript
// NumberInput pattern
const [displayValue, setDisplayValue] = useState('');
const isFocusedRef = useRef(false);

// Sync from prop when not focused
useEffect(() => {
  if (!isFocusedRef.current && value !== undefined) {
    setDisplayValue(formatNumber(value));
  }
}, [value]);

const handleChange = (e) => {
  setDisplayValue(e.target.value);
  const parsed = parseNumber(e.target.value);
  onChange(isNaN(parsed) ? undefined : parsed);
};

const handleBlur = () => {
  if (value !== undefined) {
    setDisplayValue(formatNumber(value)); // Re-format on blur
  }
};
```

## Norwegian Formatting
- Numbers: `123 456,78` (space thousands, comma decimal)
- Currency: `123 456,78 kr`
- Dates: `dd.MM.yyyy` (01.01.2024)
- Percentages: `7,50 %`

```typescript
import { formatCurrency, formatNumber, parseNumber } from '@finans/components';
import { formatDate, parseNorwegianDate } from '@finans/components';
```

## Decisions
- numeral.js for number formatting (pre-configured Norwegian locale)
- date-fns with `nb` locale for dates
- JetBrains Mono font for input fields (`--font-mono`)

## Gotchas
- Filter non-numeric input: `/[^\d\s,.-]/g`
- `inputMode="decimal"` not `type="number"` (allows comma input)
- Re-format on blur to normalize user input
- Error state via `aria-invalid` and `aria-describedby` for accessibility
- Tab navigation within input groups via `data-input-group` attribute
