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
import { formatDate, getFirstDayOfMonth } from '@/shared/utils/dateFormat';
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
   * Parse Norwegian date format (dd.MM.yyyy) to Date object
   * Returns undefined if invalid
   */
  const parseNorwegianDate = (input: string): Date | undefined => {
    // Allow partial input during typing
    if (!input || input.trim() === '') {
      return undefined;
    }

    // Expected format: dd.MM.yyyy
    const parts = input.split('.');
    if (parts.length !== 3) {
      return undefined;
    }

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    // Basic validation
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return undefined;
    }

    if (month < 1 || month > 12) {
      return undefined;
    }

    if (day < 1 || day > 31) {
      return undefined;
    }

    // Year should be reasonable (e.g., 1900-2100)
    if (year < 1900 || year > 2100) {
      return undefined;
    }

    // Create date object (month is 0-indexed in JavaScript)
    const date = new Date(year, month - 1, day);

    // Validate the date is correct (e.g., Feb 30 would roll over to Mar 2)
    if (
      date.getDate() !== day ||
      date.getMonth() !== month - 1 ||
      date.getFullYear() !== year
    ) {
      return undefined;
    }

    return date;
  };

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
