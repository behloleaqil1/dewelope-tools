'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RadiationDoseConverter - Convert between Sievert, rem, Gray, rad radiation dose units.
 */
export default function RadiationDoseConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('millisievert');
  const [toUnit, setToUnit] = useState('millirem');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();

  // Equivalent dose units (Sievert-based) and absorbed dose units (Gray-based)
  // 1 Sv = 100 rem; 1 Gy = 100 rad; Sv and Gy are numerically equal for gamma/beta (Q=1)
  const UNITS = [
    { value: 'sievert', label: 'Sievert (Sv)', factor: 1 },
    { value: 'millisievert', label: 'Millisievert (mSv)', factor: 0.001 },
    { value: 'microsievert', label: 'Microsievert (µSv)', factor: 0.000001 },
    { value: 'rem', label: 'rem', factor: 0.01 },
    { value: 'millirem', label: 'millirem (mrem)', factor: 0.00001 },
    { value: 'gray', label: 'Gray (Gy)', factor: 1 },
    { value: 'milligray', label: 'Milligray (mGy)', factor: 0.001 },
    { value: 'microgray', label: 'Microgray (µGy)', factor: 0.000001 },
    { value: 'rad', label: 'rad', factor: 0.01 },
    { value: 'millirad', label: 'millirad (mrad)', factor: 0.00001 },
  ];

  function convert() {
    setError(undefined);
    setResult(null);

    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) {
      setError('Please enter a valid number');
      return;
    }

    const from = UNITS.find(u => u.value === fromUnit);
    const to = UNITS.find(u => u.value === toUnit);
    if (!from || !to) { setError('Invalid unit selection'); return; }

    // Convert to base (Sv/Gy equivalent) then to target
    const base = num * from.factor;
    const converted = base / to.factor;

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
          Radiation dose value for {toolName}
        </label>
        <input
          id={`${toolId}-value`}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter radiation dose value"
          aria-label="Radiation dose value to convert"
          className="input-field"
        />
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label htmlFor={`${toolId}-from`} className="block text-xs text-gray-500 mb-1">From</label>
            <select id={`${toolId}-from`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label="Source radiation unit" className="input-field text-sm">
              {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-to`} className="block text-xs text-gray-500 mb-1">To</label>
            <select id={`${toolId}-to`} value={toUnit} onChange={(e) => setToUnit(e.target.value)} aria-label="Target radiation unit" className="input-field text-sm">
              {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert radiation dose" className="btn-primary">
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
            <div className="text-xs text-gray-500 bg-yellow-50 p-2 rounded border border-yellow-200">
              Note: Sievert (equivalent dose) and Gray (absorbed dose) are numerically equal for gamma/beta radiation (quality factor Q=1).
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
