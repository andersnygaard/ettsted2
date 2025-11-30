/**
 * NumberInput Component Examples
 *
 * Demonstrates various usage patterns for the NumberInput component
 */

import { useState } from 'react';
import { NumberInput } from './NumberInput';

export function NumberInputExamples() {
  const [basicValue, setBasicValue] = useState<number | undefined>(123456.78);
  const [requiredValue, setRequiredValue] = useState<number | undefined>(undefined);
  const [withError, setWithError] = useState<number | undefined>(undefined);

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h1>NumberInput Component Examples</h1>

      {/* Basic usage */}
      <div>
        <h2>Basic Usage</h2>
        <NumberInput
          value={basicValue}
          onChange={setBasicValue}
          label="Beløp"
          suffix="kr"
        />
        <p style={{ marginTop: '1rem', fontSize: '14px', color: '#6B6B6B' }}>
          Current value: {basicValue !== undefined ? basicValue : 'undefined'}
        </p>
      </div>

      {/* Required field */}
      <div>
        <h2>Required Field</h2>
        <NumberInput
          value={requiredValue}
          onChange={setRequiredValue}
          label="Obligatorisk beløp"
          suffix="kr"
          required
          placeholder="Vennligst fyll inn beløp"
        />
        <p style={{ marginTop: '1rem', fontSize: '14px', color: '#6B6B6B' }}>
          Current value: {requiredValue !== undefined ? requiredValue : 'undefined'}
        </p>
      </div>

      {/* With error */}
      <div>
        <h2>With Error State</h2>
        <NumberInput
          value={withError}
          onChange={(value) => {
            setWithError(value);
          }}
          label="Beløp (må være over 1000)"
          suffix="kr"
          error={withError !== undefined && withError < 1000 ? 'Beløpet må være minst 1 000 kr' : undefined}
        />
        <p style={{ marginTop: '1rem', fontSize: '14px', color: '#6B6B6B' }}>
          Current value: {withError !== undefined ? withError : 'undefined'}
        </p>
      </div>

      {/* Without suffix */}
      <div>
        <h2>Without Suffix</h2>
        <NumberInput
          value={basicValue}
          onChange={setBasicValue}
          label="Antall aksjer"
          suffix=""
        />
      </div>

      {/* Custom suffix */}
      <div>
        <h2>Custom Suffix</h2>
        <NumberInput
          value={basicValue}
          onChange={setBasicValue}
          label="Avkastning"
          suffix="%"
        />
      </div>

      {/* Disabled */}
      <div>
        <h2>Disabled State</h2>
        <NumberInput
          value={123456.78}
          onChange={() => {}}
          label="Ikke-redigerbart beløp"
          suffix="kr"
          disabled
        />
      </div>
    </div>
  );
}
