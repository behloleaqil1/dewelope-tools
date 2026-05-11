'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CapacitanceConverter - Convert between Farad, µF, nF, pF, mF capacitance units.
 */
export default function CapacitanceConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('microfarad');
  const [toUnit, setToUnit] = useState('nanofarad');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();

  const UNITS = [
    { value: 'farad', label: 'Farad (F)' },
    { value: 'millifarad', label: 'Millifarad (mF)' },
    { value: 'microfarad', label: 'Microfarad (µF)' },
    { value: 'nanofarad', label: 'Nanofarad (nF)' },
    { value: 'picofarad', label: 'Picofarad (pF)' },
    { value: 'kilofarad', label: 'Kilofarad (kF)' },
    { value: 'megafarad', label: 'Megafarad (MF)' },
  ];

  // Conversion factors to Farad
  const TO_FARAD: Record<string, number> = {
    'farad': 1,
    'millifarad': 1e-3,
    'microfarad': 1e-6,
    'nanofarad': 1e-9,
    'picofarad': 1e-12,
    'kilofarad': 1e3,
    'megafarad': 1e6,
  };

  function convert() {
    setError(undefined);
    setResult(null);

    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) {
      setError('Please enter a valid number');
      return;
    }

    const farads = num * TO_FARAD[fromUnit];
    const converted = farads / TO_FARAD[toUnit];

    let formatted: string;
    if (Math.abs(converted) < 0.001 || Math.abs(converted) > 1e9) {
      formatted = converted.toExponential(6);
    } else {
      formatted = converted.toLocaleString(undefined, { maximumFractionDigits: 6 });
    }
    setResult(formatted);
  }

  const fromLabel = UNITS.find(u => u.value === fromUnit)?.label || fromUnit;
  const toLabel = UNITS.find(u => u.value === toUnit)?.label || toUnit;
  const copyText = result ? `${value} ${fromLabel} = ${result} ${toLabel}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">
          Capacitance value for {toolName}
        </label>
        <input
          id={`${toolId}-value`}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter capacitance value"
          aria-label="Capacitance value to convert"
          className="input-field"
        />
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label htmlFor={`${toolId}-from`} className="block text-xs text-gray-500 mb-1">From</label>
            <select id={`${toolId}-from`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label="Source capacitance unit" className="input-field text-sm">
              {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-to`} className="block text-xs text-gray-500 mb-1">To</label>
            <select id={`${toolId}-to`} value={toUnit} onChange={(e) => setToUnit(e.target.value)} aria-label="Target capacitance unit" className="input-field text-sm">
              {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert capacitance" className="btn-primary">
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
            <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded border border-blue-200">
              Common values: Electrolytic caps (1µF–10,000µF), Ceramic caps (1pF–100nF), Film caps (1nF–10µF)
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
