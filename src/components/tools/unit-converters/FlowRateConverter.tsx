'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FlowRateConverter - Convert between flow rate units: L/min, gal/min, m³/h, ft³/min, and more.
 */
export default function FlowRateConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('lpm');
  const [toUnit, setToUnit] = useState('gpm');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();

  // Conversion factors to liters per minute
  const TO_LPM: Record<string, number> = {
    lpm: 1,
    gpm: 3.78541,
    m3h: 16.6667,
    cfm: 28.3168,
    lph: 1 / 60,
    gph: 3.78541 / 60,
    m3min: 1000,
    mlmin: 0.001,
  };

  const UNITS = [
    { value: 'lpm', label: 'Liters/min (L/min)' },
    { value: 'gpm', label: 'Gallons/min (gal/min)' },
    { value: 'm3h', label: 'Cubic meters/hour (m³/h)' },
    { value: 'cfm', label: 'Cubic feet/min (ft³/min)' },
    { value: 'lph', label: 'Liters/hour (L/h)' },
    { value: 'gph', label: 'Gallons/hour (gal/h)' },
    { value: 'm3min', label: 'Cubic meters/min (m³/min)' },
    { value: 'mlmin', label: 'Milliliters/min (mL/min)' },
  ];

  function convert() {
    setError(undefined);
    setResult(null);

    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) {
      setError('Please enter a valid number');
      return;
    }

    const lpm = num * TO_LPM[fromUnit];
    const converted = lpm / TO_LPM[toUnit];

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
          Flow rate value for {toolName}
        </label>
        <input
          id={`${toolId}-value`}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter flow rate value"
          aria-label="Flow rate value to convert"
          className="input-field"
        />
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label htmlFor={`${toolId}-from`} className="block text-xs text-gray-500 mb-1">From</label>
            <select id={`${toolId}-from`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label="Source flow rate unit" className="input-field text-sm">
              {UNITS.map((u) => (<option key={u.value} value={u.value}>{u.label}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-to`} className="block text-xs text-gray-500 mb-1">To</label>
            <select id={`${toolId}-to`} value={toUnit} onChange={(e) => setToUnit(e.target.value)} aria-label="Target flow rate unit" className="input-field text-sm">
              {UNITS.map((u) => (<option key={u.value} value={u.value}>{u.label}</option>))}
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert flow rate" className="btn-primary">Convert</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600 font-mono">{result}</div>
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
