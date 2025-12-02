/**
 * DateInput Component
 *
 * Date input with Norwegian formatting (dd.MM.yyyy)
 *
 * Features:
 * - Displays dates in Norwegian format (01.01.2024)
 * - Parses dd.MM.yyyy input to Date objects
 * - Validates date input
 * - Error state styling
 * - Optional month picker mode (always returns 1st of month)
 * - JetBrains Mono font for input field
 *
 * Usage:
 *   <DateInput
 *     value={new Date('2024-01-01')}
 *     onChange={(date) => setDate(date)}
 *     label="Snapshot Date"
 *     error="Invalid date"
 *   />
 *
 *   // Month picker mode (for portfolio snapshots)
 *   <DateInput
 *     value={new Date('2024-01-01')}
 *     onChange={(date) => setDate(date)}
 *     label="Month"
 *     monthPicker
 *   />
 */

import { useState, useEffect } from 'react';
import { formatDate, parseNorwegianDate, getFirstDayOfMonth } from '../utils/dateFormat';
import './DateInput.css';

export interface DateInputProps {
  /**
   * Current date value (undefined for empty/invalid)
   */
  value: Date | undefined;

  /**
   * Callback when date changes
   */
  onChange: (value: Date | undefined) => void;

  /**
   * Label text (displayed above input)
   */
  label?: string;

  /**
   * Placeholder text (default: "dd.MM.yyyy")
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

  /**
   * Month picker mode - always returns 1st of month
   * Useful for portfolio snapshots
   */
  monthPicker?: boolean;
}

export function DateInput({
  value,
  onChange,
  label,
  placeholder = 'dd.MM.yyyy',
  error,
  disabled = false,
  required = false,
  name,
  id,
  monthPicker = false,
}: DateInputProps) {
  // Track display value separately to allow partial input
  const [displayValue, setDisplayValue] = useState<string>('');

  // Sync display value when value prop changes externally
  useEffect(() => {
    if (value instanceof Date && !isNaN(value.getTime())) {
      setDisplayValue(formatDate(value));
    } else if (value === undefined) {
      setDisplayValue('');
    }
  }, [value]);

  /**
   * Handle input changes - allow partial input, parse to Date
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setDisplayValue(input);

    // Parse Norwegian format to Date
    const parsed = parseNorwegianDate(input);

    // If month picker mode, always return 1st of month
    if (parsed && monthPicker) {
      const firstDay = getFirstDayOfMonth(parsed);
      onChange(firstDay);
    } else {
      onChange(parsed);
    }
  };

  /**
   * Re-format on blur to ensure consistent formatting
   */
  const handleBlur = () => {
    if (value instanceof Date && !isNaN(value.getTime())) {
      setDisplayValue(formatDate(value));
    } else {
      setDisplayValue('');
    }
  };

  /**
   * Focus on label click
   */
  const inputId = id || (name ? `date-input-${name}` : undefined);

  return (
    <div className={`date-input ${error ? 'date-input--error' : ''} ${disabled ? 'date-input--disabled' : ''}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="date-input__label"
        >
          {label}
          {required && <span className="date-input__required">*</span>}
        </label>
      )}

      <input
        type="text"
        inputMode="numeric"
        className="date-input__field"
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

      {error && (
        <span
          className="date-input__error-message"
          id={inputId ? `${inputId}-error` : undefined}
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
}
