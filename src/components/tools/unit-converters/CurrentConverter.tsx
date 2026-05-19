'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CurrentConverter - Convert between Ampere, mA, µA, kA electrical current units.
 */
export default function CurrentConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('ampere');
  const [error, setError] = useState('');
  const [results, setResults] = useState<{ unit: string; value: string }[] | null>(null);

  const toAmpere: Record<string, number> = {
    nanoampere: 1e-9,
    microampere: 1e-6,
    milliampere: 1e-3,
    ampere: 1,
    kiloampere: 1e3,
    megaampere: 1e6,
  };

  const unitLabels: Record<string, string> = {
    nanoampere: 'Nanoampere (nA)',
    microampere: 'Microampere (µA)',
    milliampere: 'Milliampere (mA)',
    ampere: 'Ampere (A)',
    kiloampere: 'Kiloampere (kA)',
    megaampere: 'Megaampere (MA)',
  };

  const convert = () => {
    setError('');
    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) {
      setError('Please enter a valid number.');
      setResults(null);
      return;
    }

    const inAmperes = num * toAmpere[fromUnit];
    const converted = Object.entries(toAmpere).map(([unit, factor]) => ({
      unit: unitLabels[unit],
      value: (inAmperes / factor).toFixed(6),
    }));

    setResults(converted);
  };

  const copyText = results ? results.map((r) => `${r.unit}: ${r.value}`).join('\n') : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea error={error}>
          <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Value</label>
          <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 500" aria-label={`Value for ${toolName}`} className="input-field" />
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

      <button onClick={convert} aria-label="Convert current" className="btn-primary">Convert</button>

      <OutputArea hasContent={results !== null}>
        {results && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Conversion Results</label>
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
