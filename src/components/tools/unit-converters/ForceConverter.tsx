'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ForceConverter - Converts between force units: Newton, kilonewton, pound-force, dyne, kgf, and poundal.
 */
export default function ForceConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('newton');
  const [toUnit, setToUnit] = useState('pound-force');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();

  // Conversion factors to Newtons
  const TO_NEWTON: Record<string, number> = {
    newton: 1,
    kilonewton: 1000,
    'pound-force': 4.44822,
    dyne: 1e-5,
    'kilogram-force': 9.80665,
    poundal: 0.138255,
    'gram-force': 0.00980665,
    kip: 4448.22,
  };

  const UNITS = [
    { value: 'newton', label: 'Newton (N)' },
    { value: 'kilonewton', label: 'Kilonewton (kN)' },
    { value: 'pound-force', label: 'Pound-force (lbf)' },
    { value: 'dyne', label: 'Dyne (dyn)' },
    { value: 'kilogram-force', label: 'Kilogram-force (kgf)' },
    { value: 'poundal', label: 'Poundal (pdl)' },
    { value: 'gram-force', label: 'Gram-force (gf)' },
    { value: 'kip', label: 'Kip (klbf)' },
  ];

  function convert() {
    setError(undefined);
    setResult(null);

    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) {
      setError('Please enter a valid number');
      return;
    }

    const newtons = num * TO_NEWTON[fromUnit];
    const converted = newtons / TO_NEWTON[toUnit];

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
          Force value for {toolName}
        </label>
        <input
          id={`${toolId}-value`}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter force value"
          aria-label="Force value to convert"
          className="input-field"
        />
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label htmlFor={`${toolId}-from`} className="block text-xs text-gray-500 mb-1">From</label>
            <select id={`${toolId}-from`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label="Source force unit" className="input-field text-sm">
              {UNITS.map((u) => (<option key={u.value} value={u.value}>{u.label}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-to`} className="block text-xs text-gray-500 mb-1">To</label>
            <select id={`${toolId}-to`} value={toUnit} onChange={(e) => setToUnit(e.target.value)} aria-label="Target force unit" className="input-field text-sm">
              {UNITS.map((u) => (<option key={u.value} value={u.value}>{u.label}</option>))}
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert force" className="btn-primary">Convert</button>

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
