'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * KinematicViscosityConverter - Convert between stokes, m²/s, centistokes, and ft²/s.
 */
export default function KinematicViscosityConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('cSt');
  const [result, setResult] = useState<{ unit: string; value: string }[] | null>(null);
  const [error, setError] = useState('');

  const TO_M2S: Record<string, number> = {
    'm2s': 1,
    'cm2s': 1e-4,
    'St': 1e-4,
    'cSt': 1e-6,
    'mm2s': 1e-6,
    'ft2s': 0.09290304,
    'in2s': 6.4516e-4,
  };

  const UNITS = [
    { value: 'm2s', label: 'm²/s' },
    { value: 'cm2s', label: 'cm²/s' },
    { value: 'St', label: 'Stokes (St)' },
    { value: 'cSt', label: 'Centistokes (cSt)' },
    { value: 'mm2s', label: 'mm²/s' },
    { value: 'ft2s', label: 'ft²/s' },
    { value: 'in2s', label: 'in²/s' },
  ];

  function convert() {
    setError('');
    setResult(null);
    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) { setError('Please enter a valid number'); return; }

    const m2s = num * TO_M2S[fromUnit];
    const results = UNITS.map(u => ({
      unit: u.label,
      value: (m2s / TO_M2S[u.value]).toLocaleString(undefined, { maximumFractionDigits: 10 }),
    }));
    setResult(results);
  }

  const copyText = result ? result.map(r => `${r.unit}: ${r.value}`).join('\n') : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Value</label>
        <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter kinematic viscosity" aria-label={`Kinematic viscosity for ${toolName}`} className="input-field" />
        <div className="mt-3">
          <label htmlFor={`${toolId}-from`} className="block text-xs text-gray-500 mb-1">From</label>
          <select id={`${toolId}-from`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label="Source viscosity unit" className="input-field">
            {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
          </select>
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert kinematic viscosity" className="btn-primary">Convert</button>

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
