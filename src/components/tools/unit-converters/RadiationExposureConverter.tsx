'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RadiationExposureConverter - Convert between sievert, rem, gray, and rad.
 */
export default function RadiationExposureConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('sv');
  const [result, setResult] = useState<{ unit: string; value: string }[] | null>(null);
  const [error, setError] = useState('');

  const TO_SIEVERT: Record<string, number> = {
    sv: 1,
    msv: 0.001,
    usv: 0.000001,
    rem: 0.01,
    mrem: 0.00001,
    gy: 1, // Gray (assuming quality factor 1)
    mgy: 0.001,
    rad: 0.01,
  };

  const UNITS = [
    { value: 'sv', label: 'Sievert (Sv)' },
    { value: 'msv', label: 'Millisievert (mSv)' },
    { value: 'usv', label: 'Microsievert (μSv)' },
    { value: 'rem', label: 'Rem' },
    { value: 'mrem', label: 'Millirem (mrem)' },
    { value: 'gy', label: 'Gray (Gy)' },
    { value: 'mgy', label: 'Milligray (mGy)' },
    { value: 'rad', label: 'Rad' },
  ];

  function convert() {
    setError('');
    setResult(null);
    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) { setError('Please enter a valid number'); return; }

    const sv = num * TO_SIEVERT[fromUnit];
    const results = UNITS.map(u => ({
      unit: u.label,
      value: (sv / TO_SIEVERT[u.value]).toLocaleString(undefined, { maximumFractionDigits: 8 }),
    }));
    setResult(results);
  }

  const copyText = result ? result.map(r => `${r.unit}: ${r.value}`).join('\n') : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Value</label>
        <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter radiation value" aria-label={`Radiation value for ${toolName}`} className="input-field" />
        <div className="mt-3">
          <label htmlFor={`${toolId}-from`} className="block text-xs text-gray-500 mb-1">From</label>
          <select id={`${toolId}-from`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label="Source radiation unit" className="input-field">
            {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
          </select>
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert radiation units" className="btn-primary">Convert</button>

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
