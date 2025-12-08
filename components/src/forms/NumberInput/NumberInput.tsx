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

import { useState, useEffect, useRef } from 'react';
import { formatNumber, parseNumber } from '../utils/numberFormat';
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

  /**
   * Data attribute for grouping inputs (e.g., for tab navigation)
   */
  dataInputGroup?: string;

  /**
   * Callback when user attempts to type in disabled field
   * If provided and returns true, the field will be enabled
   */
  onActivate?: () => void;

  /**
   * Callback when input loses focus
   */
  onBlur?: () => void;
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
  dataInputGroup,
  onActivate,
  onBlur: onBlurProp,
}: NumberInputProps) {
  // Track display value separately to allow partial input
  const [displayValue, setDisplayValue] = useState<string>('');
  // Track focus state to avoid reformatting while user is typing
  const isFocusedRef = useRef(false);
  // Ref to input element for focus management
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync display value when value prop changes externally (not from user input)
  useEffect(() => {
    // Skip update if user is actively typing
    if (isFocusedRef.current) return;

    if (value !== undefined && !Number.isNaN(value)) {
      setDisplayValue(formatNumber(value));
    } else if (value === undefined) {
      setDisplayValue('');
    }
  }, [value]);

  /**
   * Filter input to only allow numeric characters and formatting
   * Allows: digits, comma (decimal), space (thousands), minus (negative)
   */
  const filterNumericInput = (input: string): string => {
    // Only allow digits, comma, space, minus, and period
    return input.replace(/[^\d\s,.-]/g, '');
  };

  /**
   * Handle input changes - filter non-numeric, parse to number
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = e.target.value;
    const input = filterNumericInput(rawInput);

    // Only update if filtered value differs (prevents cursor jump on same value)
    if (input !== rawInput) {
      // Input contained invalid characters - use filtered value
      setDisplayValue(input);
    } else {
      setDisplayValue(input);
    }

    // Parse Norwegian format to number
    const parsed = parseNumber(input);

    // Call onChange with parsed number (or undefined if invalid)
    onChange(Number.isNaN(parsed) ? undefined : parsed);
  };

  /**
   * Track focus state and select all text for easy replacement
   */
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    isFocusedRef.current = true;
    e.target.select();
  };

  /**
   * Re-format on blur to ensure consistent formatting
   */
  const handleBlur = () => {
    isFocusedRef.current = false;
    if (value !== undefined && !Number.isNaN(value)) {
      setDisplayValue(formatNumber(value));
    } else {
      setDisplayValue('');
    }
    onBlurProp?.();
  };

  /**
   * Handle keyboard navigation and input
   * - Enter: blur input
   * - Tab: if dataInputGroup set, navigate to next input in group
   * - Numeric keys on disabled field: activate if onActivate provided
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
      return;
    }

    // Handle Tab navigation within input group
    if (e.key === 'Tab' && dataInputGroup && !e.shiftKey) {
      const allGroupInputs = document.querySelectorAll<HTMLInputElement>(
        `[data-input-group="${dataInputGroup}"]`
      );
      if (allGroupInputs.length > 1) {
        const inputsArray = Array.from(allGroupInputs);
        const currentIndex = inputsArray.indexOf(e.currentTarget);
        const nextIndex = currentIndex + 1;

        if (nextIndex < inputsArray.length) {
          e.preventDefault();
          inputsArray[nextIndex].focus();
          inputsArray[nextIndex].select();
        }
      }
    }

    // Handle Shift+Tab navigation within input group
    if (e.key === 'Tab' && dataInputGroup && e.shiftKey) {
      const allGroupInputs = document.querySelectorAll<HTMLInputElement>(
        `[data-input-group="${dataInputGroup}"]`
      );
      if (allGroupInputs.length > 1) {
        const inputsArray = Array.from(allGroupInputs);
        const currentIndex = inputsArray.indexOf(e.currentTarget);
        const prevIndex = currentIndex - 1;

        if (prevIndex >= 0) {
          e.preventDefault();
          inputsArray[prevIndex].focus();
          inputsArray[prevIndex].select();
        }
      }
    }

    // If disabled and user presses a number key, activate if callback provided
    if (disabled && onActivate && /^[0-9]$/.test(e.key)) {
      e.preventDefault();
      onActivate();
      // After activation, we need to wait for re-render then type the digit
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          // Simulate typing the digit
          const newValue = e.key;
          setDisplayValue(newValue);
          const parsed = parseNumber(newValue);
          onChange(Number.isNaN(parsed) ? undefined : parsed);
        }
      }, 0);
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
          ref={inputRef}
          type="text"
          inputMode="decimal"
          className="number-input__field"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          name={name}
          id={inputId}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
          data-input-group={dataInputGroup}
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
