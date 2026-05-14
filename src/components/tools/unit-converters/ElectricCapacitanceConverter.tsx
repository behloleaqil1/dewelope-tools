'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ElectricCapacitanceConverter - Convert between farad, microfarad, nanofarad, picofarad.
 */
export default function ElectricCapacitanceConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('uF');
  const [result, setResult] = useState<{ unit: string; value: string }[] | null>(null);
  const [error, setError] = useState('');

  const TO_FARAD: Record<string, number> = {
    F: 1,
    mF: 1e-3,
    uF: 1e-6,
    nF: 1e-9,
    pF: 1e-12,
    fF: 1e-15,
    aF: 1e-18,
  };

  const UNITS = [
    { value: 'F', label: 'Farad (F)' },
    { value: 'mF', label: 'Millifarad (mF)' },
    { value: 'uF', label: 'Microfarad (μF)' },
    { value: 'nF', label: 'Nanofarad (nF)' },
    { value: 'pF', label: 'Picofarad (pF)' },
    { value: 'fF', label: 'Femtofarad (fF)' },
    { value: 'aF', label: 'Attofarad (aF)' },
  ];

  function convert() {
    setError('');
    setResult(null);
    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) { setError('Please enter a valid number'); return; }

    const farad = num * TO_FARAD[fromUnit];
    const results = UNITS.map(u => ({
      unit: u.label,
      value: (farad / TO_FARAD[u.value]).toLocaleString(undefined, { maximumFractionDigits: 10 }),
    }));
    setResult(results);
  }

  const copyText = result ? result.map(r => `${r.unit}: ${r.value}`).join('\n') : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Value</label>
        <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter capacitance value" aria-label={`Capacitance value for ${toolName}`} className="input-field" />
        <div className="mt-3">
          <label htmlFor={`${toolId}-from`} className="block text-xs text-gray-500 mb-1">From</label>
          <select id={`${toolId}-from`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label="Source capacitance unit" className="input-field">
            {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
          </select>
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert capacitance" className="btn-primary">Convert</button>

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
