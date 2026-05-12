'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AstronomicalTimeConverter - Convert between Earth time and Mars sols, Jupiter days, etc.
 */
export default function AstronomicalTimeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('earth-days');
  const [result, setResult] = useState<{ unit: string; value: string }[] | null>(null);
  const [error, setError] = useState('');

  // Duration in Earth hours
  const units: Record<string, { label: string; hours: number }> = {
    'earth-days': { label: 'Earth Days', hours: 24 },
    'earth-hours': { label: 'Earth Hours', hours: 1 },
    'mars-sols': { label: 'Mars Sols', hours: 24.6597 },
    'jupiter-days': { label: 'Jupiter Days', hours: 9.925 },
    'saturn-days': { label: 'Saturn Days', hours: 10.656 },
    'venus-days': { label: 'Venus Days', hours: 5832.5 },
    'mercury-days': { label: 'Mercury Days', hours: 1407.6 },
    'moon-days': { label: 'Lunar Days', hours: 708.7 },
  };

  const convert = () => {
    setError('');
    setResult(null);

    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) {
      setError('Please enter a valid number');
      return;
    }

    const sourceHours = num * units[fromUnit].hours;
    const conversions = Object.entries(units).map(([key, unit]) => ({
      unit: unit.label,
      value: key === fromUnit ? num.toFixed(6) : (sourceHours / unit.hours).toFixed(6),
    }));

    setResult(conversions);
  };

  const copyText = result ? result.map(r => `${r.unit}: ${r.value}`).join('\n') : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Value</label>
          <input id={`${toolId}-value`} type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 1" aria-label={`Value for ${toolName}`} className="input-field" />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-from`} className="block text-sm font-medium text-gray-700 mb-1">From Unit</label>
          <select id={`${toolId}-from`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="input-field" aria-label={`Source unit for ${toolName}`}>
            {Object.entries(units).map(([key, unit]) => (
              <option key={key} value={key}>{unit.label}</option>
            ))}
          </select>
        </InputArea>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <button onClick={convert} className="btn-primary" aria-label="Convert time">Convert</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Conversion Results</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {result.map((r, i) => (
                <div key={i} className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-center">
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
