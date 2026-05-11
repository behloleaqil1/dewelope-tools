'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FrequencyConverter - Converts between frequency units: Hz, kHz, MHz, GHz, THz, and RPM.
 */
export default function FrequencyConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('mhz');
  const [toUnit, setToUnit] = useState('ghz');
  const [result, setResult] = useState<string | null>(null);
  const [allResults, setAllResults] = useState<{ unit: string; value: string }[]>([]);
  const [error, setError] = useState<string | undefined>();

  // Conversion factors to Hz
  const TO_HZ: Record<string, number> = {
    hz: 1,
    khz: 1e3,
    mhz: 1e6,
    ghz: 1e9,
    thz: 1e12,
    rpm: 1 / 60,
  };

  const UNITS = [
    { value: 'hz', label: 'Hertz (Hz)' },
    { value: 'khz', label: 'Kilohertz (kHz)' },
    { value: 'mhz', label: 'Megahertz (MHz)' },
    { value: 'ghz', label: 'Gigahertz (GHz)' },
    { value: 'thz', label: 'Terahertz (THz)' },
    { value: 'rpm', label: 'RPM (rev/min)' },
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

    const hz = num * TO_HZ[fromUnit];
    const converted = hz / TO_HZ[toUnit];

    let formatted: string;
    if (Math.abs(converted) < 0.001 || Math.abs(converted) > 1e12) {
      formatted = converted.toExponential(4);
    } else {
      formatted = converted.toLocaleString(undefined, { maximumFractionDigits: 6 });
    }

    setResult(formatted);

    const all = UNITS.map((u) => {
      const val = hz / TO_HZ[u.value];
      let display: string;
      if (Math.abs(val) < 0.001 || Math.abs(val) > 1e12) {
        display = val.toExponential(4);
      } else {
        display = val.toLocaleString(undefined, { maximumFractionDigits: 6 });
      }
      return { unit: u.label, value: display };
    });
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
          Frequency value for {toolName}
        </label>
        <input
          id={`${toolId}-value`}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter frequency value"
          aria-label="Frequency value to convert"
          className="input-field"
        />
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label htmlFor={`${toolId}-from`} className="block text-xs text-gray-500 mb-1">From</label>
            <select
              id={`${toolId}-from`}
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              aria-label="Source frequency unit"
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
              aria-label="Target frequency unit"
              className="input-field text-sm"
            >
              {UNITS.map((u) => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert frequency" className="btn-primary">
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
