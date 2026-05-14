'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MaterialDensityConverter - Convert between kg/m³, lb/ft³, g/cm³, and other density units.
 */
export default function MaterialDensityConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('kgm3');
  const [result, setResult] = useState<{ unit: string; value: string }[] | null>(null);
  const [error, setError] = useState('');

  const TO_KGM3: Record<string, number> = {
    kgm3: 1,
    gcm3: 1000,
    gml: 1000,
    kgl: 1,
    lbft3: 16.01846,
    lbin3: 27679.9,
    lbgal: 119.826,
    ozin3: 1729.99,
  };

  const UNITS = [
    { value: 'kgm3', label: 'kg/m³' },
    { value: 'gcm3', label: 'g/cm³' },
    { value: 'gml', label: 'g/mL' },
    { value: 'kgl', label: 'kg/L' },
    { value: 'lbft3', label: 'lb/ft³' },
    { value: 'lbin3', label: 'lb/in³' },
    { value: 'lbgal', label: 'lb/US gal' },
    { value: 'ozin3', label: 'oz/in³' },
  ];

  function convert() {
    setError('');
    setResult(null);
    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) { setError('Please enter a valid number'); return; }

    const kgm3 = num * TO_KGM3[fromUnit];
    const results = UNITS.map(u => ({
      unit: u.label,
      value: (kgm3 / TO_KGM3[u.value]).toLocaleString(undefined, { maximumFractionDigits: 8 }),
    }));
    setResult(results);
  }

  const copyText = result ? result.map(r => `${r.unit}: ${r.value}`).join('\n') : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Value</label>
        <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter density value" aria-label={`Density value for ${toolName}`} className="input-field" />
        <div className="mt-3">
          <label htmlFor={`${toolId}-from`} className="block text-xs text-gray-500 mb-1">From</label>
          <select id={`${toolId}-from`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label="Source density unit" className="input-field">
            {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
          </select>
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert density" className="btn-primary">Convert</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {result.map(r => (
                <div key={r.unit} className="bg-gray-50 p-2 rounded border border-gray-200 text-sm">
                  <span className="text-gray-500">{r.unit}:</span> <span className="font-mono font-medium">{r.value}</span>
                </div>
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
