'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ElectricalFrequencyConverter - Convert between Hz, kHz, MHz, GHz, RPM, rad/s.
 */
export default function ElectricalFrequencyConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('hertz');
  const [error, setError] = useState('');
  const [results, setResults] = useState<{ unit: string; value: string }[] | null>(null);

  const toHz: Record<string, number> = {
    hertz: 1,
    kilohertz: 1e3,
    megahertz: 1e6,
    gigahertz: 1e9,
    terahertz: 1e12,
    rpm: 1 / 60,
    radPerSec: 1 / (2 * Math.PI),
  };

  const unitLabels: Record<string, string> = {
    hertz: 'Hertz (Hz)',
    kilohertz: 'Kilohertz (kHz)',
    megahertz: 'Megahertz (MHz)',
    gigahertz: 'Gigahertz (GHz)',
    terahertz: 'Terahertz (THz)',
    rpm: 'RPM',
    radPerSec: 'Radians/second (rad/s)',
  };

  const convert = () => {
    setError('');
    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) { setError('Please enter a valid number.'); setResults(null); return; }

    const inHz = num * toHz[fromUnit];
    const converted = Object.entries(toHz).map(([unit, factor]) => ({
      unit: unitLabels[unit],
      value: (inHz / factor).toFixed(6),
    }));
    setResults(converted);
  };

  const copyText = results ? results.map((r) => `${r.unit}: ${r.value}`).join('\n') : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea error={error}>
          <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Value</label>
          <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 1000" aria-label={`Value for ${toolName}`} className="input-field" />
        </InputArea>
        <div>
          <label htmlFor={`${toolId}-from`} className="block text-sm font-medium text-gray-700 mb-1">From Unit</label>
          <select id={`${toolId}-from`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label="Source unit" className="input-field">
            {Object.entries(unitLabels).map(([key, label]) => (<option key={key} value={key}>{label}</option>))}
          </select>
        </div>
      </div>
      <button onClick={convert} aria-label="Convert frequency" className="btn-primary">Convert</button>
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
