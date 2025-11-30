# NumberInput Component

Financial number input component with Norwegian number formatting.

## Overview

The NumberInput component provides a user-friendly input field for entering financial amounts with automatic Norwegian number formatting (space as thousands separator, comma as decimal separator).

## Features

- **Norwegian number formatting**: Displays numbers as `123 456,78`
- **Smart parsing**: Converts user input back to raw numbers
- **Graceful partial input**: Handles incomplete numbers during typing
- **Optional suffix**: Default "kr" suffix, customizable
- **Error states**: Visual error feedback with custom messages
- **JetBrains Mono font**: Monospace font for clear number display
- **Accessibility**: Proper ARIA attributes and labels

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number \| undefined` | - | Current numeric value (required) |
| `onChange` | `(value: number \| undefined) => void` | - | Callback when value changes (required) |
| `label` | `string` | - | Label text displayed above input |
| `suffix` | `string` | `"kr"` | Suffix text displayed to the right |
| `placeholder` | `string` | `"0"` | Placeholder text |
| `error` | `string` | - | Error message displayed below input |
| `disabled` | `boolean` | `false` | Disabled state |
| `required` | `boolean` | `false` | Required field indicator |
| `name` | `string` | - | Name attribute for forms |
| `id` | `string` | - | ID attribute |

## Usage

### Basic Example

```tsx
import { NumberInput } from '@/shared/components';
import { useState } from 'react';

function MyComponent() {
  const [amount, setAmount] = useState<number | undefined>(123456.78);

  return (
    <NumberInput
      value={amount}
      onChange={setAmount}
      label="Beløp"
      suffix="kr"
    />
  );
}
```

### With Validation

```tsx
function ValidatedInput() {
  const [value, setValue] = useState<number | undefined>();
  const [error, setError] = useState<string>();

  const handleChange = (newValue: number | undefined) => {
    setValue(newValue);

    if (newValue !== undefined && newValue < 1000) {
      setError('Beløpet må være minst 1 000 kr');
    } else {
      setError(undefined);
    }
  };

  return (
    <NumberInput
      value={value}
      onChange={handleChange}
      label="Beløp"
      error={error}
      required
    />
  );
}
```

### Custom Suffix

```tsx
// Percentage input
<NumberInput
  value={7.5}
  onChange={setValue}
  label="Avkastning"
  suffix="%"
/>

// No suffix
<NumberInput
  value={42}
  onChange={setValue}
  label="Antall aksjer"
  suffix=""
/>
```

## Behavior

### Formatting

- **On display**: Numbers are formatted using `formatNumber()` from `@/shared/utils/numberFormat`
- **During input**: User can type partial numbers (e.g., "123 4")
- **On blur**: Input is re-formatted to standard Norwegian format

### Parsing

- **Spaces**: Removed (thousands separator)
- **Comma**: Converted to dot (decimal separator)
- **Invalid input**: Returns `undefined` to `onChange`

### Examples

| User Input | Parsed Value | Formatted Display |
|------------|--------------|-------------------|
| `123456.78` | `123456.78` | `123 456,78` |
| `123 456,78` | `123456.78` | `123 456,78` |
| `1234` | `1234` | `1 234,00` |
| `abc` | `undefined` | (cleared on blur) |
| `123,` | `123` | `123,00` |

## Styling

The component uses CSS custom properties from the Nordic Minimal design system:

- **Font**: `var(--font-mono)` (JetBrains Mono)
- **Colors**: `var(--charcoal)`, `var(--text-secondary)`, `var(--negative)`
- **Spacing**: `var(--space-xs)`, `var(--space-sm)`, etc.
- **Transitions**: `var(--transition-fast)`

### CSS Classes

- `.number-input` - Root container
- `.number-input--error` - Error state modifier
- `.number-input--disabled` - Disabled state modifier
- `.number-input__label` - Label element
- `.number-input__wrapper` - Input + suffix wrapper
- `.number-input__field` - Input field
- `.number-input__suffix` - Suffix text
- `.number-input__error-message` - Error message
- `.number-input__required` - Required indicator (*)

## Dependencies

- `@/shared/utils/numberFormat` - Norwegian number formatting utilities
- `@/styles/tokens.css` - Design system tokens

## Related Components

- `StatCard` - Displays formatted numbers
- `HeroNumber` - Large formatted numbers with change indicators
- `ProgressBar` - May include formatted values

## Accessibility

- Proper `<label>` association via `htmlFor`/`id`
- `aria-invalid` for error states
- `aria-describedby` links error messages
- `role="alert"` on error messages
- `inputMode="decimal"` for mobile keyboards
- Required indicator (*) for required fields

## Browser Support

Works in all modern browsers with support for:
- CSS custom properties
- React 18+
- ES6 modules
