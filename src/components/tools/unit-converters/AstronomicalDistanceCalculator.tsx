'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AstronomicalDistanceCalculator - Converts distances between astronomical units.
 * Supports kilometers, light-seconds, light-minutes, light-years, AU, and parsecs.
 */
export default function AstronomicalDistanceCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('km');
  const [results, setResults] = useState<{ unit: string; label: string; value: string }[] | null>(null);
  const [error, setError] = useState('');

  // Conversion factors to kilometers
  const toKm: Record<string, number> = {
    km: 1,
    'light-second': 299792.458,
    'light-minute': 17987547.48,
    'light-hour': 1079252848.8,
    'light-year': 9.461e12,
    au: 149597870.7,
    parsec: 3.0857e13,
  };

  const unitLabels: Record<string, string> = {
    km: 'Kilometers',
    'light-second': 'Light-seconds',
    'light-minute': 'Light-minutes',
    'light-hour': 'Light-hours',
    'light-year': 'Light-years',
    au: 'Astronomical Units (AU)',
    parsec: 'Parsecs',
  };

  const convert = () => {
    setError('');
    setResults(null);

    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) {
      setError('Please enter a valid number.');
      return;
    }

    if (num < 0) {
      setError('Distance cannot be negative.');
      return;
    }

    const km = num * toKm[fromUnit];

    const converted = Object.entries(toKm).map(([unit, factor]) => ({
      unit,
      label: unitLabels[unit],
      value: unit === fromUnit ? num.toString() : formatNumber(km / factor),
    }));

    setResults(converted);
  };

  function formatNumber(n: number): string {
    if (n === 0) return '0';
    if (Math.abs(n) < 0.001 || Math.abs(n) > 1e9) {
      return n.toExponential(6);
    }
    return n.toLocaleString('en-US', { maximumFractionDigits: 6 });
  }

  const copyText = results
    ? results.map((r) => `${r.label}: ${r.value}`).join('\n')
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">
              Distance Value
            </label>
            <input
              id={`${toolId}-value`}
              type="text"
              inputMode="decimal"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g. 1"
              aria-label={`Distance value for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">
              From Unit
            </label>
            <select
              id={`${toolId}-unit`}
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              aria-label="Source distance unit"
              className="input-field"
            >
              {Object.entries(unitLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert astronomical distance" className="btn-primary">
        Convert Distance
      </button>

      <OutputArea hasContent={results !== null}>
        {results && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Conversion Results</h3>
              <CopyToClipboard text={copyText} />
            </div>
            <div className="space-y-2">
              {results.map((r) => (
                <div
                  key={r.unit}
                  className={`flex justify-between items-center p-3 rounded-lg border ${r.unit === fromUnit ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}
                >
                  <span className="text-sm font-medium text-gray-700">{r.label}</span>
                  <span className="font-mono text-sm text-gray-800">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
