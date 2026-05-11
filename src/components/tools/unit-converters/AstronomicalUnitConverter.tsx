'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AstronomicalUnitConverter - Convert between AU, light-year, parsec, km, and miles.
 */

const UNITS = [
  { id: 'au', label: 'Astronomical Unit (AU)', toKm: 149597870.7 },
  { id: 'ly', label: 'Light-year', toKm: 9460730472580.8 },
  { id: 'pc', label: 'Parsec', toKm: 30856775814671.9 },
  { id: 'km', label: 'Kilometer', toKm: 1 },
  { id: 'mi', label: 'Mile', toKm: 1.60934 },
];

export default function AstronomicalUnitConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('au');
  const [error, setError] = useState<string | undefined>();
  const [results, setResults] = useState<{ unit: string; label: string; value: number }[] | null>(null);

  function handleConvert() {
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) { setError('Enter a valid positive number'); setResults(null); return; }

    setError(undefined);

    const fromDef = UNITS.find((u) => u.id === fromUnit);
    if (!fromDef) return;

    const inKm = num * fromDef.toKm;

    const converted = UNITS.filter((u) => u.id !== fromUnit).map((u) => ({
      unit: u.id,
      label: u.label,
      value: inKm / u.toKm,
    }));

    setResults(converted);
  }

  function formatNumber(n: number): string {
    if (n === 0) return '0';
    if (Math.abs(n) < 0.001 || Math.abs(n) > 1e12) {
      return n.toExponential(6);
    }
    return n.toLocaleString(undefined, { maximumFractionDigits: 6 });
  }

  const copyText = results
    ? results.map((r) => `${r.label}: ${formatNumber(r.value)}`).join('\n')
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Value</label>
            <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 1" aria-label={`Distance value for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-from`} className="block text-sm font-medium text-gray-700 mb-1">From Unit</label>
            <select id={`${toolId}-from`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="input-field text-sm" aria-label="Source unit">
              {UNITS.map((u) => (
                <option key={u.id} value={u.id}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={handleConvert} aria-label="Convert astronomical units" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={results !== null}>
        {results && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {results.map((r) => (
                <div key={r.unit} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">{r.label}</div>
                  <div className="text-lg font-bold text-gray-800 font-mono break-all">{formatNumber(r.value)}</div>
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
