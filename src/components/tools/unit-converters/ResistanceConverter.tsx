'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ResistanceConverter - Convert between Ohm, mΩ, µΩ, kΩ, MΩ, GΩ units.
 */
export default function ResistanceConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('ohm');
  const [error, setError] = useState('');
  const [results, setResults] = useState<{ unit: string; value: string }[] | null>(null);

  const toOhm: Record<string, number> = {
    microohm: 1e-6,
    milliohm: 1e-3,
    ohm: 1,
    kilohm: 1e3,
    megohm: 1e6,
    gigohm: 1e9,
  };

  const unitLabels: Record<string, string> = {
    microohm: 'Microohm (µΩ)',
    milliohm: 'Milliohm (mΩ)',
    ohm: 'Ohm (Ω)',
    kilohm: 'Kilohm (kΩ)',
    megohm: 'Megohm (MΩ)',
    gigohm: 'Gigohm (GΩ)',
  };

  const convert = () => {
    setError('');
    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) {
      setError('Please enter a valid number.');
      setResults(null);
      return;
    }

    const inOhms = num * toOhm[fromUnit];
    const converted = Object.entries(toOhm).map(([unit, factor]) => ({
      unit: unitLabels[unit],
      value: (inOhms / factor).toFixed(6),
    }));

    setResults(converted);
  };

  const copyText = results ? results.map((r) => `${r.unit}: ${r.value}`).join('\n') : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea error={error}>
          <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Value</label>
          <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 4700" aria-label={`Value for ${toolName}`} className="input-field" />
        </InputArea>
        <div>
          <label htmlFor={`${toolId}-from`} className="block text-sm font-medium text-gray-700 mb-1">From Unit</label>
          <select id={`${toolId}-from`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label="Source unit" className="input-field">
            {Object.entries(unitLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <button onClick={convert} aria-label="Convert resistance" className="btn-primary">Convert</button>

      <OutputArea hasContent={results !== null}>
        {results && (
          <div className="space-y-2">
            <div className="space-y-1">
              {results.map((r, i) => (
                <div key={i} className="flex justify-between bg-gray-50 p-2 rounded border border-gray-200">
                  <span className="text-sm text-gray-600">{r.unit}</span>
                  <span className="text-sm font-mono font-bold text-gray-800">{r.value}</span>
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
