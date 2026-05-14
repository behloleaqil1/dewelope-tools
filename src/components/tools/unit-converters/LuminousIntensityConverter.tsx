'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * LuminousIntensityConverter - Convert between candela, lumen, lux, and related units.
 */
export default function LuminousIntensityConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('cd');
  const [result, setResult] = useState<{ unit: string; value: string }[] | null>(null);
  const [error, setError] = useState('');

  // Conversion factors to candela
  const TO_CANDELA: Record<string, number> = {
    cd: 1,
    mcd: 0.001,
    kcd: 1000,
    cp: 0.981, // candlepower
    lm_sr: 1, // lumen per steradian = candela
    HK: 0.903, // Hefnerkerze
  };

  const UNITS = [
    { value: 'cd', label: 'Candela (cd)' },
    { value: 'mcd', label: 'Millicandela (mcd)' },
    { value: 'kcd', label: 'Kilocandela (kcd)' },
    { value: 'cp', label: 'Candlepower (cp)' },
    { value: 'lm_sr', label: 'Lumen/steradian (lm/sr)' },
    { value: 'HK', label: 'Hefnerkerze (HK)' },
  ];

  function convert() {
    setError('');
    setResult(null);
    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) { setError('Please enter a valid number'); return; }

    const candela = num * TO_CANDELA[fromUnit];
    const results = UNITS.map(u => ({
      unit: u.label,
      value: (candela / TO_CANDELA[u.value]).toLocaleString(undefined, { maximumFractionDigits: 8 }),
    }));
    setResult(results);
  }

  const copyText = result ? result.map(r => `${r.unit}: ${r.value}`).join('\n') : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Value</label>
        <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter luminous intensity" aria-label={`Luminous intensity for ${toolName}`} className="input-field" />
        <div className="mt-3">
          <label htmlFor={`${toolId}-from`} className="block text-xs text-gray-500 mb-1">From</label>
          <select id={`${toolId}-from`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label="Source luminous unit" className="input-field">
            {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
          </select>
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert luminous intensity" className="btn-primary">Convert</button>

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
