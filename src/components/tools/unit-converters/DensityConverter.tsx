'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DensityConverter - Converts between density units: kg/m³, g/cm³, lb/ft³, etc.
 */
export default function DensityConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('kg-m3');
  const [toUnit, setToUnit] = useState('g-cm3');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();

  const TO_KG_M3: Record<string, number> = {
    'kg-m3': 1,
    'g-cm3': 1000,
    'g-ml': 1000,
    'kg-l': 1000,
    'lb-ft3': 16.0185,
    'lb-in3': 27679.9,
    'oz-in3': 1729.99,
    'g-l': 1,
  };

  const UNITS = [
    { value: 'kg-m3', label: 'kg/m³' },
    { value: 'g-cm3', label: 'g/cm³' },
    { value: 'g-ml', label: 'g/mL' },
    { value: 'kg-l', label: 'kg/L' },
    { value: 'lb-ft3', label: 'lb/ft³' },
    { value: 'lb-in3', label: 'lb/in³' },
    { value: 'oz-in3', label: 'oz/in³' },
    { value: 'g-l', label: 'g/L' },
  ];

  function convert() {
    setError(undefined);
    setResult(null);

    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) { setError('Please enter a valid number'); return; }

    const kgm3 = num * TO_KG_M3[fromUnit];
    const converted = kgm3 / TO_KG_M3[toUnit];

    setResult(converted.toLocaleString(undefined, { maximumFractionDigits: 6 }));
  }

  const fromLabel = UNITS.find((u) => u.value === fromUnit)?.label || fromUnit;
  const toLabel = UNITS.find((u) => u.value === toUnit)?.label || toUnit;
  const copyText = result ? `${value} ${fromLabel} = ${result} ${toLabel}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Density value for {toolName}</label>
        <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter density value" aria-label="Density value" className="input-field" />
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label htmlFor={`${toolId}-from`} className="block text-xs text-gray-500 mb-1">From</label>
            <select id={`${toolId}-from`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label="Source density unit" className="input-field text-sm">
              {UNITS.map((u) => (<option key={u.value} value={u.value}>{u.label}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-to`} className="block text-xs text-gray-500 mb-1">To</label>
            <select id={`${toolId}-to`} value={toUnit} onChange={(e) => setToUnit(e.target.value)} aria-label="Target density unit" className="input-field text-sm">
              {UNITS.map((u) => (<option key={u.value} value={u.value}>{u.label}</option>))}
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert density" className="btn-primary">Convert</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600 font-mono">{result}</div>
              <div className="text-sm text-gray-500 mt-1">{toLabel}</div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
