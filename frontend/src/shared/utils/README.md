# Norwegian Localization Utilities

Utilities for formatting and parsing numbers and dates according to Norwegian conventions.

## Installation

These utilities are already configured and ready to use. The Norwegian locale is initialized automatically when the app starts (see `/frontend/src/main.tsx`).

## Number Formatting

### formatCurrency(value: number): string

Format a number as Norwegian currency with "kr" suffix.

```typescript
import { formatCurrency } from '@/shared/utils/numberFormat';

formatCurrency(123456.78);  // "123 456,78 kr"
formatCurrency(1234);       // "1 234,00 kr"
formatCurrency(0.5);        // "0,50 kr"
```

### formatNumber(value: number, decimals?: number): string

Format a number with Norwegian separators (space for thousands, comma for decimals).

```typescript
import { formatNumber } from '@/shared/utils/numberFormat';

formatNumber(123456.78);     // "123 456,78" (default: 2 decimals)
formatNumber(123456.78, 0);  // "123 457" (rounded)
formatNumber(123456.78, 1);  // "123 456,8"
```

### parseNumber(value: string): number

Parse a Norwegian-formatted number string to a JavaScript number.

```typescript
import { parseNumber } from '@/shared/utils/numberFormat';

parseNumber("123 456,78");  // 123456.78
parseNumber("1 234");       // 1234
parseNumber("123456.78");   // 123456.78 (also handles standard format)
```

### formatPercentage(value: number, decimals?: number): string

Format a decimal value as a percentage (e.g., 0.075 = 7.5%).

```typescript
import { formatPercentage } from '@/shared/utils/numberFormat';

formatPercentage(0.075);     // "7,50 %"
formatPercentage(0.5, 0);    // "50 %"
```

## Date Formatting

### formatDate(date: Date): string

Format a Date object to Norwegian date string (dd.MM.yyyy).

```typescript
import { formatDate } from '@/shared/utils/dateFormat';

formatDate(new Date('2024-01-01'));  // "01.01.2024"
formatDate(new Date());              // "29.11.2025" (current date)
```

### parseDate(dateString: string): Date

Parse a Norwegian date string to a Date object.

```typescript
import { parseDate } from '@/shared/utils/dateFormat';

const date = parseDate("01.01.2024");  // Date object for 2024-01-01
```

### formatDateLong(date: Date): string

Format a date with the month name spelled out (Norwegian).

```typescript
import { formatDateLong } from '@/shared/utils/dateFormat';

formatDateLong(new Date('2024-01-01'));  // "1. januar 2024"
```

### toISOString(date: Date): string

Convert a Date object to ISO 8601 string for API communication.

```typescript
import { toISOString } from '@/shared/utils/dateFormat';

toISOString(new Date('2024-01-01'));  // "2024-01-01T00:00:00.000Z"
```

### fromISOString(isoString: string): Date

Parse an ISO 8601 string from API to a Date object.

```typescript
import { fromISOString } from '@/shared/utils/dateFormat';

fromISOString("2024-01-01T00:00:00.000Z");  // Date object
```

### getFirstDayOfMonth(date: Date): Date

Get the first day of the month for a given date (useful for monthly snapshots).

```typescript
import { getFirstDayOfMonth } from '@/shared/utils/dateFormat';

const firstDay = getFirstDayOfMonth(new Date('2024-01-15'));
console.log(formatDate(firstDay));  // "01.01.2024"
```

## Best Practices

### Display vs Storage

Always:
- **Store** numbers as JSON numbers (not strings): `{ value: 123456.78 }`
- **Store** dates as ISO 8601 strings: `{ date: "2024-01-01T00:00:00.000Z" }`
- **Display** numbers formatted: `"123 456,78 kr"`
- **Display** dates formatted: `"01.01.2024"`

### Form Input Handling

When building forms:

1. Accept Norwegian formatted input from user
2. Parse to native number/Date using utilities
3. Send to API as JSON number/ISO string
4. Display using format utilities

```typescript
// Example: Portfolio snapshot form
const handleSubmit = (formData: any) => {
  const snapshot = {
    date: toISOString(parseDate(formData.dateInput)),  // Norwegian -> ISO
    value: parseNumber(formData.valueInput),            // Norwegian -> number
  };

  // Send to API
  api.post('/snapshots', snapshot);
};

// Display in UI
const displayValue = formatCurrency(snapshot.value);  // number -> Norwegian
const displayDate = formatDate(fromISOString(snapshot.date));  // ISO -> Norwegian
```

## Norwegian Formatting Rules

### Numbers
- **Thousands separator**: Space (` `)
- **Decimal separator**: Comma (`,`)
- **Currency**: "kr" as suffix (not prefix)

Examples:
- `123 456,78 kr`
- `1 234`
- `0,5`

### Dates
- **Display format**: dd.MM.yyyy (e.g., "01.01.2024")
- **Storage format**: ISO 8601 (e.g., "2024-01-01T00:00:00.000Z")
- **Long format**: "1. januar 2024"

### Locale
- **Norwegian Bokmål** (`nb`), not Nynorsk

## Testing

To manually test the utilities:

1. Import the manual test file in a component:
   ```typescript
   import '@/shared/utils/__manual-test';
   ```

2. Check the browser console for test output.

Alternatively, use the utilities directly in the browser console:

```typescript
import { formatCurrency } from '@/shared/utils/numberFormat';
console.log(formatCurrency(123456.78));  // "123 456,78 kr"
```

## Dependencies

- **numeral** (^2.0.6) - Number formatting
- **date-fns** (^2.30.0) - Date manipulation and formatting
- **@types/numeral** (^2.0.5) - TypeScript types for numeral

These are already included in the frontend package.json.
