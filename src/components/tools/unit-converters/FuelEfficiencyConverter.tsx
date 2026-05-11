'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FuelEfficiencyConverter - Convert between MPG, km/L, L/100km fuel efficiency units.
 */
export default function FuelEfficiencyConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('mpg-us');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ mpgUs: string; mpgUk: string; kmL: string; l100km: string } | null>(null);

  const units = [
    { value: 'mpg-us', label: 'MPG (US)' },
    { value: 'mpg-uk', label: 'MPG (UK)' },
    { value: 'km-l', label: 'km/L' },
    { value: 'l-100km', label: 'L/100km' },
  ];

  const convert = () => {
    setError('');
    setResult(null);
    const num = parseFloat(value);
    if (!value.trim() || isNaN(num) || num <= 0) {
      setError('Enter a valid positive number');
      return;
    }

    // Convert everything to km/L first
    let kmL: number;
    switch (fromUnit) {
      case 'mpg-us': kmL = num * 0.425144; break;
      case 'mpg-uk': kmL = num * 0.354006; break;
      case 'km-l': kmL = num; break;
      case 'l-100km': kmL = 100 / num; break;
      default: kmL = num;
    }

    setResult({
      mpgUs: (kmL / 0.425144).toFixed(4),
      mpgUk: (kmL / 0.354006).toFixed(4),
      kmL: kmL.toFixed(4),
      l100km: (100 / kmL).toFixed(4),
    });
  };

  const copyText = result
    ? `MPG (US): ${result.mpgUs}\nMPG (UK): ${result.mpgUk}\nkm/L: ${result.kmL}\nL/100km: ${result.l100km}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea error={error}>
          <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Value</label>
          <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 30" aria-label={`Value for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">From Unit</label>
          <select id={`${toolId}-unit`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label={`Unit for ${toolName}`} className="input-field">
            {units.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
          </select>
        </InputArea>
      </div>

      <button onClick={convert} aria-label="Convert fuel efficiency" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.mpgUs}</div>
                <div className="text-xs text-gray-500 mt-1">MPG (US)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.mpgUk}</div>
                <div className="text-xs text-gray-500 mt-1">MPG (UK)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-green-600">{result.kmL}</div>
                <div className="text-xs text-gray-500 mt-1">km/L</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-purple-600">{result.l100km}</div>
                <div className="text-xs text-gray-500 mt-1">L/100km</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
