'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MagneticFluxDensityConverter - Convert between Tesla, gauss, and other magnetic units.
 */
export default function MagneticFluxDensityConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('T');
  const [result, setResult] = useState<{ unit: string; value: string }[] | null>(null);
  const [error, setError] = useState('');

  const TO_TESLA: Record<string, number> = {
    T: 1,
    mT: 0.001,
    uT: 0.000001,
    nT: 1e-9,
    G: 0.0001,
    kG: 0.1,
    Wb_m2: 1,
    gamma: 1e-9,
  };

  const UNITS = [
    { value: 'T', label: 'Tesla (T)' },
    { value: 'mT', label: 'Millitesla (mT)' },
    { value: 'uT', label: 'Microtesla (μT)' },
    { value: 'nT', label: 'Nanotesla (nT)' },
    { value: 'G', label: 'Gauss (G)' },
    { value: 'kG', label: 'Kilogauss (kG)' },
    { value: 'Wb_m2', label: 'Weber/m² (Wb/m²)' },
    { value: 'gamma', label: 'Gamma (γ)' },
  ];

  function convert() {
    setError('');
    setResult(null);
    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) { setError('Please enter a valid number'); return; }

    const tesla = num * TO_TESLA[fromUnit];
    const results = UNITS.map(u => ({
      unit: u.label,
      value: (tesla / TO_TESLA[u.value]).toLocaleString(undefined, { maximumFractionDigits: 10 }),
    }));
    setResult(results);
  }

  const copyText = result ? result.map(r => `${r.unit}: ${r.value}`).join('\n') : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Value</label>
        <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter magnetic flux density" aria-label={`Magnetic flux density for ${toolName}`} className="input-field" />
        <div className="mt-3">
          <label htmlFor={`${toolId}-from`} className="block text-xs text-gray-500 mb-1">From</label>
          <select id={`${toolId}-from`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label="Source magnetic unit" className="input-field">
            {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
          </select>
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert magnetic flux density" className="btn-primary">Convert</button>

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
