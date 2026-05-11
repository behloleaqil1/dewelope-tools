'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TimeUnitConverter - Converts between time units: seconds, minutes, hours, days, weeks, months, years.
 */
export default function TimeUnitConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('hours');
  const [toUnit, setToUnit] = useState('minutes');
  const [result, setResult] = useState<string | null>(null);
  const [allResults, setAllResults] = useState<{ unit: string; value: string }[]>([]);
  const [error, setError] = useState<string | undefined>();

  // Conversion factors to seconds
  const TO_SECONDS: Record<string, number> = {
    millisecond: 0.001,
    second: 1,
    minute: 60,
    hour: 3600,
    day: 86400,
    week: 604800,
    month: 2629746, // average month (365.25/12 days)
    year: 31556952, // average year (365.25 days)
    decade: 315569520,
    century: 3155695200,
  };

  const UNITS = [
    { value: 'millisecond', label: 'Milliseconds (ms)' },
    { value: 'second', label: 'Seconds (s)' },
    { value: 'minute', label: 'Minutes (min)' },
    { value: 'hour', label: 'Hours (hr)' },
    { value: 'day', label: 'Days' },
    { value: 'week', label: 'Weeks' },
    { value: 'month', label: 'Months (avg)' },
    { value: 'year', label: 'Years (avg)' },
    { value: 'decade', label: 'Decades' },
    { value: 'century', label: 'Centuries' },
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

    const seconds = num * TO_SECONDS[fromUnit];
    const converted = seconds / TO_SECONDS[toUnit];

    let formatted: string;
    if (Math.abs(converted) < 0.001 || Math.abs(converted) > 1e12) {
      formatted = converted.toExponential(4);
    } else {
      formatted = converted.toLocaleString(undefined, { maximumFractionDigits: 4 });
    }

    setResult(formatted);

    // Show all conversions
    const all = UNITS.map((u) => {
      const val = seconds / TO_SECONDS[u.value];
      let display: string;
      if (Math.abs(val) < 0.001 || Math.abs(val) > 1e12) {
        display = val.toExponential(4);
      } else {
        display = val.toLocaleString(undefined, { maximumFractionDigits: 4 });
      }
      return { unit: u.label, value: display };
    });
    setAllResults(all);
  }

  const fromLabel = UNITS.find((u) => u.value === fromUnit)?.label || fromUnit;
  const toLabel = UNITS.find((u) => u.value === toUnit)?.label || toUnit;
  const copyText = result
    ? `${value} ${fromLabel} = ${result} ${toLabel}\n\nAll conversions:\n${allResults.map((r) => `${r.unit}: ${r.value}`).join('\n')}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">
          Time value for {toolName}
        </label>
        <input
          id={`${toolId}-value`}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter time value"
          aria-label="Time value to convert"
          className="input-field"
        />
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label htmlFor={`${toolId}-from`} className="block text-xs text-gray-500 mb-1">From</label>
            <select
              id={`${toolId}-from`}
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              aria-label="Source time unit"
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
              aria-label="Target time unit"
              className="input-field text-sm"
            >
              {UNITS.map((u) => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert time" className="btn-primary">
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
