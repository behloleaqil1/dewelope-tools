'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ElectricFieldConverter - Convert between V/m, kV/m, N/C, and V/cm electric field units.
 * Uses V/m as the base unit for all conversions.
 */
export default function ElectricFieldConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('v-m');
  const [toUnit, setToUnit] = useState('kv-m');
  const [result, setResult] = useState<{ value: number; formula: string } | null>(null);
  const [error, setError] = useState('');

  const units: Record<string, { label: string; toVPerM: number }> = {
    'v-m': { label: 'Volts per meter (V/m)', toVPerM: 1 },
    'kv-m': { label: 'Kilovolts per meter (kV/m)', toVPerM: 1000 },
    'n-c': { label: 'Newtons per coulomb (N/C)', toVPerM: 1 },
    'v-cm': { label: 'Volts per centimeter (V/cm)', toVPerM: 100 },
  };

  const convert = () => {
    setError('');
    setResult(null);

    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) {
      setError('Please enter a valid number');
      return;
    }

    const inVPerM = num * units[fromUnit].toVPerM;
    const converted = inVPerM / units[toUnit].toVPerM;

    const fromLabel = units[fromUnit].label.split(' (')[1]?.replace(')', '') || fromUnit;
    const toLabel = units[toUnit].label.split(' (')[1]?.replace(')', '') || toUnit;
    const formula = `${num} ${fromLabel} = ${converted.toFixed(6)} ${toLabel}`;

    setResult({ value: converted, formula });
  };

  const copyText = result
    ? `${value} ${units[fromUnit].label} = ${result.value.toFixed(6)} ${units[toUnit].label}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">
              Value
            </label>
            <input
              id={`${toolId}-value`}
              type="text"
              inputMode="decimal"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter value to convert"
              aria-label={`Value for ${toolName}`}
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-from`} className="block text-sm font-medium text-gray-700 mb-1">
                From
              </label>
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
              <label htmlFor={`${toolId}-to`} className="block text-sm font-medium text-gray-700 mb-1">
                To
              </label>
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
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert electric field" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">{result.value.toFixed(6)}</div>
              <div className="text-xs text-gray-500 mt-1">{units[toUnit].label}</div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              {result.formula}
            </div>
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-200">
              Note: V/m and N/C are equivalent units (1 V/m = 1 N/C)
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
