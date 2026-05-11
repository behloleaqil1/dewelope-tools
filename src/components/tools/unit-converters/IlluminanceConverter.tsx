'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * IlluminanceConverter - Convert between illuminance units: lux, foot-candle, phot, nox.
 */
export default function IlluminanceConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('lux');
  const [toUnit, setToUnit] = useState('foot-candle');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();

  // Conversion factors to lux
  const TO_LUX: Record<string, number> = {
    lux: 1,
    'foot-candle': 10.7639,
    phot: 10000,
    nox: 0.001,
    kilolux: 1000,
    millilux: 0.001,
  };

  const UNITS = [
    { value: 'lux', label: 'Lux (lx)' },
    { value: 'foot-candle', label: 'Foot-candle (fc)' },
    { value: 'phot', label: 'Phot (ph)' },
    { value: 'nox', label: 'Nox' },
    { value: 'kilolux', label: 'Kilolux (klx)' },
    { value: 'millilux', label: 'Millilux (mlx)' },
  ];

  function convert() {
    setError(undefined);
    setResult(null);

    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) {
      setError('Please enter a valid number');
      return;
    }

    if (num < 0) {
      setError('Value must be non-negative');
      return;
    }

    const lux = num * TO_LUX[fromUnit];
    const converted = lux / TO_LUX[toUnit];

    let formatted: string;
    if (Math.abs(converted) < 0.001 || Math.abs(converted) > 1e9) {
      formatted = converted.toExponential(6);
    } else {
      formatted = converted.toLocaleString(undefined, { maximumFractionDigits: 6 });
    }

    setResult(formatted);
  }

  const fromLabel = UNITS.find((u) => u.value === fromUnit)?.label || fromUnit;
  const toLabel = UNITS.find((u) => u.value === toUnit)?.label || toUnit;
  const copyText = result ? `${value} ${fromLabel} = ${result} ${toLabel}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">
          Illuminance value for {toolName}
        </label>
        <input
          id={`${toolId}-value`}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter illuminance value"
          aria-label="Illuminance value to convert"
          className="input-field"
        />
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label htmlFor={`${toolId}-from`} className="block text-xs text-gray-500 mb-1">From</label>
            <select
              id={`${toolId}-from`}
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              aria-label="Source illuminance unit"
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
              aria-label="Target illuminance unit"
              className="input-field text-sm"
            >
              {UNITS.map((u) => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert illuminance" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600 font-mono break-all">{result}</div>
              <div className="text-sm text-gray-500 mt-1">{toLabel}</div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono text-center">
              {value} {fromLabel} = {result} {toLabel}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
