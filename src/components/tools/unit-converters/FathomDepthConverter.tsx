'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FathomDepthConverter - Convert fathoms to meters, feet, yards, and cables.
 */
export default function FathomDepthConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('fathom');
  const [error, setError] = useState('');
  const [results, setResults] = useState<{ unit: string; value: string }[] | null>(null);

  const toFathom: Record<string, number> = {
    fathom: 1,
    meter: 0.546807,
    foot: 0.166667,
    yard: 0.5,
    cable: 100,
    nauticalMile: 1012.6859,
  };

  const unitLabels: Record<string, string> = {
    fathom: 'Fathoms (ftm)',
    meter: 'Meters (m)',
    foot: 'Feet (ft)',
    yard: 'Yards (yd)',
    cable: 'Cables',
    nauticalMile: 'Nautical Miles (nmi)',
  };

  const convert = () => {
    setError('');
    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) {
      setError('Please enter a valid number.');
      setResults(null);
      return;
    }

    const inFathoms = num / toFathom[fromUnit];
    const converted = Object.entries(toFathom).map(([unit, factor]) => ({
      unit: unitLabels[unit],
      value: (inFathoms * factor).toFixed(4),
    }));

    setResults(converted);
  };

  const copyText = results ? results.map((r) => `${r.unit}: ${r.value}`).join('\n') : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea error={error}>
          <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Value</label>
          <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 10" aria-label={`Value for ${toolName}`} className="input-field" />
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

      <button onClick={convert} aria-label="Convert depth" className="btn-primary">Convert</button>

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
