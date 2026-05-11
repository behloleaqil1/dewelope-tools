'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MagneticFluxConverter - Converts between Weber, Maxwell, volt-second, and other magnetic flux units.
 */
export default function MagneticFluxConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('weber');
  const [toUnit, setToUnit] = useState('maxwell');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ converted: number; formula: string } | null>(null);

  const units: Record<string, { label: string; toWeber: number }> = {
    weber: { label: 'Weber (Wb)', toWeber: 1 },
    maxwell: { label: 'Maxwell (Mx)', toWeber: 1e-8 },
    'volt-second': { label: 'Volt-second (V·s)', toWeber: 1 },
    microweber: { label: 'Microweber (µWb)', toWeber: 1e-6 },
    milliweber: { label: 'Milliweber (mWb)', toWeber: 1e-3 },
    kiloweber: { label: 'Kiloweber (kWb)', toWeber: 1000 },
    'unit-pole': { label: 'Unit Pole', toWeber: 1.256637e-7 },
  };

  const convert = () => {
    setError('');
    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) {
      setError('Please enter a valid number');
      setResult(null);
      return;
    }

    const inWeber = num * units[fromUnit].toWeber;
    const converted = inWeber / units[toUnit].toWeber;
    const formula = `${num} ${units[fromUnit].label} = ${converted} ${units[toUnit].label}`;

    setResult({ converted, formula });
  };

  const copyText = result
    ? `${value} ${units[fromUnit].label} = ${result.converted} ${units[toUnit].label}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">
          Value
        </label>
        <input
          id={`${toolId}-value`}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => { setValue(e.target.value); if (error) setError(''); }}
          placeholder="Enter value"
          aria-label={`Value input for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${toolId}-from`} className="block text-sm font-medium text-gray-700 mb-1">From</label>
          <select
            id={`${toolId}-from`}
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            aria-label={`Source unit for ${toolName}`}
            className="input-field"
          >
            {Object.entries(units).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${toolId}-to`} className="block text-sm font-medium text-gray-700 mb-1">To</label>
          <select
            id={`${toolId}-to`}
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            aria-label={`Target unit for ${toolName}`}
            className="input-field"
          >
            {Object.entries(units).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <button onClick={convert} aria-label="Convert magnetic flux" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">{result.converted.toExponential(6)}</div>
              <div className="text-xs text-gray-500 mt-1">{units[toUnit].label}</div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              {result.formula}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
