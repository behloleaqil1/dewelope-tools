'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * EnergyConverter - Converts between energy units: Joules, Calories, kWh, BTU, eV, and foot-pounds.
 */
export default function EnergyConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('joule');
  const [toUnit, setToUnit] = useState('calorie');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();

  // Conversion factors to Joules
  const TO_JOULES: Record<string, number> = {
    joule: 1,
    kilojoule: 1000,
    calorie: 4.184,
    kilocalorie: 4184,
    kwh: 3600000,
    btu: 1055.06,
    ev: 1.602176634e-19,
    'foot-pound': 1.35582,
    'watt-hour': 3600,
    erg: 1e-7,
  };

  const UNITS = [
    { value: 'joule', label: 'Joule (J)' },
    { value: 'kilojoule', label: 'Kilojoule (kJ)' },
    { value: 'calorie', label: 'Calorie (cal)' },
    { value: 'kilocalorie', label: 'Kilocalorie (kcal)' },
    { value: 'kwh', label: 'Kilowatt-hour (kWh)' },
    { value: 'btu', label: 'BTU' },
    { value: 'ev', label: 'Electron Volt (eV)' },
    { value: 'foot-pound', label: 'Foot-pound (ft·lbf)' },
    { value: 'watt-hour', label: 'Watt-hour (Wh)' },
    { value: 'erg', label: 'Erg' },
  ];

  function convert() {
    setError(undefined);
    setResult(null);

    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) {
      setError('Please enter a valid number');
      return;
    }

    const joules = num * TO_JOULES[fromUnit];
    const converted = joules / TO_JOULES[toUnit];

    // Format with appropriate precision
    let formatted: string;
    if (Math.abs(converted) < 0.001 || Math.abs(converted) > 1e9) {
      formatted = converted.toExponential(6);
    } else {
      formatted = converted.toLocaleString(undefined, { maximumFractionDigits: 6 });
    }

    setResult(formatted);
  }

  const fromLabel = UNITS.find((u) => u.value === fromUnit)?.label || fromUnit;
  const toLabel = UNITS.find((u) => u.value === toUnit)?.label || toUnit;
  const copyText = result ? `${value} ${fromLabel} = ${result} ${toLabel}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">
          Energy value for {toolName}
        </label>
        <input
          id={`${toolId}-value`}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter energy value"
          aria-label="Energy value to convert"
          className="input-field"
        />
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label htmlFor={`${toolId}-from`} className="block text-xs text-gray-500 mb-1">From</label>
            <select
              id={`${toolId}-from`}
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              aria-label="Source energy unit"
              className="input-field text-sm"
            >
              {UNITS.map((u) => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-to`} className="block text-xs text-gray-500 mb-1">To</label>
            <select
              id={`${toolId}-to`}
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              aria-label="Target energy unit"
              className="input-field text-sm"
            >
              {UNITS.map((u) => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert energy" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600 font-mono break-all">{result}</div>
              <div className="text-sm text-gray-500 mt-1">{toLabel}</div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono text-center">
              {value} {fromLabel} = {result} {toLabel}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
