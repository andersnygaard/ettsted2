/**
 * NumberInput Component
 *
 * Financial number input with Norwegian formatting (space as thousands separator, comma as decimal)
 *
 * Features:
 * - Displays formatted numbers (123 456,78)
 * - Parses input back to raw numbers
 * - Handles partial input gracefully
 * - Optional suffix (default: "kr")
 * - Error state styling
 * - JetBrains Mono font for input field
 *
 * Usage:
 *   <NumberInput
 *     value={123456.78}
 *     onChange={(value) => setValue(value)}
 *     label="Beløp"
 *     suffix="kr"
 *     error="Må være større enn 0"
 *   />
 */

import { useState, useEffect } from 'react';
import { formatNumber, parseNumber } from '@/shared/utils/numberFormat';
import './NumberInput.css';

export interface NumberInputProps {
  /**
   * Current numeric value (undefined for empty/invalid)
   */
  value: number | undefined;

  /**
   * Callback when value changes
   */
  onChange: (value: number | undefined) => void;

  /**
   * Label text (displayed above input)
   */
  label?: string;

  /**
   * Suffix text (displayed to the right of input, default: "kr")
   */
  suffix?: string;

  /**
   * Placeholder text (default: "0")
   */
  placeholder?: string;

  /**
   * Error message (displayed below input)
   */
  error?: string;

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Required field indicator
   */
  required?: boolean;

  /**
   * Name attribute for form integration
   */
  name?: string;

  /**
   * ID attribute
   */
  id?: string;
}

export function NumberInput({
  value,
  onChange,
  label,
  suffix = 'kr',
  placeholder = '0',
  error,
  disabled = false,
  required = false,
  name,
  id,
}: NumberInputProps) {
  // Track display value separately to allow partial input
  const [displayValue, setDisplayValue] = useState<string>('');

  // Sync display value when value prop changes externally
  useEffect(() => {
    if (value !== undefined && !Number.isNaN(value)) {
      setDisplayValue(formatNumber(value));
    } else if (value === undefined) {
      setDisplayValue('');
    }
  }, [value]);

  /**
   * Handle input changes - allow partial input, parse to number
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setDisplayValue(input);

    // Parse Norwegian format to number
    const parsed = parseNumber(input);

    // Call onChange with parsed number (or undefined if invalid)
    onChange(Number.isNaN(parsed) ? undefined : parsed);
  };

  /**
   * Re-format on blur to ensure consistent formatting
   */
  const handleBlur = () => {
    if (value !== undefined && !Number.isNaN(value)) {
      setDisplayValue(formatNumber(value));
    } else {
      setDisplayValue('');
    }
  };

  /**
   * Focus on label click
   */
  const inputId = id || (name ? `number-input-${name}` : undefined);

  return (
    <div className={`number-input ${error ? 'number-input--error' : ''} ${disabled ? 'number-input--disabled' : ''}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="number-input__label"
        >
          {label}
          {required && <span className="number-input__required">*</span>}
        </label>
      )}

      <div className="number-input__wrapper">
        <input
          type="text"
          inputMode="decimal"
          className="number-input__field"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          name={name}
          id={inputId}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
        {suffix && <span className="number-input__suffix">{suffix}</span>}
      </div>

      {error && (
        <span
          className="number-input__error-message"
          id={inputId ? `${inputId}-error` : undefined}
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
}
