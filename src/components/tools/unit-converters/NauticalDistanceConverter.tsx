'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NauticalDistanceConverter - Convert between nautical miles, km, statute miles, and fathoms.
 */
export default function NauticalDistanceConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('nautical-miles');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const units = [
    { id: 'nautical-miles', label: 'Nautical Miles (nmi)', toMeters: 1852 },
    { id: 'kilometers', label: 'Kilometers (km)', toMeters: 1000 },
    { id: 'statute-miles', label: 'Statute Miles (mi)', toMeters: 1609.344 },
    { id: 'fathoms', label: 'Fathoms (ftm)', toMeters: 1.8288 },
    { id: 'meters', label: 'Meters (m)', toMeters: 1 },
    { id: 'cables', label: 'Cables', toMeters: 185.2 },
  ];

  const convert = () => {
    setError('');
    setResult('');

    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) {
      setError('Please enter a valid number.');
      return;
    }

    const from = units.find((u) => u.id === fromUnit);
    if (!from) return;

    const meters = num * from.toMeters;

    const conversions = units.map((u) => {
      const converted = meters / u.toMeters;
      const formatted = converted < 0.001 ? converted.toExponential(4) : converted.toFixed(6).replace(/\.?0+$/, '');
      return `${u.label}: ${formatted}`;
    });

    setResult(conversions.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">
              Value
            </label>
            <input
              id={`${toolId}-value`}
              type="text"
              inputMode="decimal"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter distance value"
              aria-label={`Distance value for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-from`} className="block text-sm font-medium text-gray-700 mb-1">
              From Unit
            </label>
            <select
              id={`${toolId}-from`}
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              aria-label="Source unit"
              className="input-field"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert nautical distance" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Conversion Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
