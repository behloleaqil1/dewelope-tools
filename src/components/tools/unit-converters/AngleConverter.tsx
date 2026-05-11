'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AngleConverter - Converts between angle units: degrees, radians, gradians, turns, and arcminutes.
 */
export default function AngleConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('degree');
  const [toUnit, setToUnit] = useState('radian');
  const [result, setResult] = useState<string | null>(null);
  const [allResults, setAllResults] = useState<{ unit: string; value: string }[]>([]);
  const [error, setError] = useState<string | undefined>();

  // Conversion factors to degrees
  const TO_DEGREES: Record<string, number> = {
    degree: 1,
    radian: 180 / Math.PI,
    gradian: 0.9,
    turn: 360,
    arcminute: 1 / 60,
    arcsecond: 1 / 3600,
  };

  const UNITS = [
    { value: 'degree', label: 'Degrees (°)' },
    { value: 'radian', label: 'Radians (rad)' },
    { value: 'gradian', label: 'Gradians (gon)' },
    { value: 'turn', label: 'Turns' },
    { value: 'arcminute', label: 'Arcminutes (′)' },
    { value: 'arcsecond', label: 'Arcseconds (″)' },
  ];

  function convert() {
    setError(undefined);
    setResult(null);
    setAllResults([]);

    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) {
      setError('Please enter a valid number');
      return;
    }

    const degrees = num * TO_DEGREES[fromUnit];
    const converted = degrees / TO_DEGREES[toUnit];

    setResult(converted.toLocaleString(undefined, { maximumFractionDigits: 8 }));

    const all = UNITS.map((u) => ({
      unit: u.label,
      value: (degrees / TO_DEGREES[u.value]).toLocaleString(undefined, { maximumFractionDigits: 8 }),
    }));
    setAllResults(all);
  }

  const fromLabel = UNITS.find((u) => u.value === fromUnit)?.label || fromUnit;
  const toLabel = UNITS.find((u) => u.value === toUnit)?.label || toUnit;
  const copyText = result
    ? `${value} ${fromLabel} = ${result} ${toLabel}\n\n${allResults.map((r) => `${r.unit}: ${r.value}`).join('\n')}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">
          Angle value for {toolName}
        </label>
        <input
          id={`${toolId}-value`}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter angle value"
          aria-label="Angle value to convert"
          className="input-field"
        />
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label htmlFor={`${toolId}-from`} className="block text-xs text-gray-500 mb-1">From</label>
            <select
              id={`${toolId}-from`}
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              aria-label="Source angle unit"
              className="input-field text-sm"
            >
              {UNITS.map((u) => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-to`} className="block text-xs text-gray-500 mb-1">To</label>
            <select
              id={`${toolId}-to`}
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              aria-label="Target angle unit"
              className="input-field text-sm"
            >
              {UNITS.map((u) => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert angle" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600 font-mono">{result}</div>
              <div className="text-sm text-gray-500 mt-1">{toLabel}</div>
            </div>
            <details className="bg-gray-50 rounded-lg border border-gray-200">
              <summary className="px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 rounded-lg">
                All conversions
              </summary>
              <div className="px-4 pb-3 grid grid-cols-2 gap-2">
                {allResults.map((r) => (
                  <div key={r.unit} className="text-sm">
                    <span className="text-gray-500">{r.unit}:</span>{' '}
                    <span className="font-mono font-medium text-gray-800">{r.value}</span>
                  </div>
                ))}
              </div>
            </details>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
