'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ConcentrationConverter - Convert between mol/L, mg/L, ppm, ppb, g/L concentration units.
 */
export default function ConcentrationConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('mg-l');
  const [toUnit, setToUnit] = useState('ppm');
  const [molarMass, setMolarMass] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();

  const UNITS = [
    { value: 'mol-l', label: 'mol/L (Molar)' },
    { value: 'mmol-l', label: 'mmol/L' },
    { value: 'mg-l', label: 'mg/L' },
    { value: 'g-l', label: 'g/L' },
    { value: 'ppm', label: 'ppm (parts per million)' },
    { value: 'ppb', label: 'ppb (parts per billion)' },
    { value: 'percent', label: '% (w/v)' },
  ];

  // Conversion factors to mg/L (ppm equivalent for dilute aqueous solutions)
  function toMgL(val: number, unit: string, mm: number): number | null {
    switch (unit) {
      case 'mg-l': return val;
      case 'g-l': return val * 1000;
      case 'ppm': return val; // 1 ppm ≈ 1 mg/L for dilute aqueous
      case 'ppb': return val / 1000;
      case 'percent': return val * 10000;
      case 'mol-l': return mm > 0 ? val * mm * 1000 : null;
      case 'mmol-l': return mm > 0 ? val * mm : null;
      default: return null;
    }
  }

  function fromMgL(val: number, unit: string, mm: number): number | null {
    switch (unit) {
      case 'mg-l': return val;
      case 'g-l': return val / 1000;
      case 'ppm': return val;
      case 'ppb': return val * 1000;
      case 'percent': return val / 10000;
      case 'mol-l': return mm > 0 ? val / (mm * 1000) : null;
      case 'mmol-l': return mm > 0 ? val / mm : null;
      default: return null;
    }
  }

  function convert() {
    setError(undefined);
    setResult(null);

    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) {
      setError('Please enter a valid number');
      return;
    }

    const mm = parseFloat(molarMass) || 0;
    const needsMM = ['mol-l', 'mmol-l'].includes(fromUnit) || ['mol-l', 'mmol-l'].includes(toUnit);
    if (needsMM && mm <= 0) {
      setError('Molar mass is required for mol/L conversions');
      return;
    }

    const mgL = toMgL(num, fromUnit, mm);
    if (mgL === null) { setError('Conversion error'); return; }

    const converted = fromMgL(mgL, toUnit, mm);
    if (converted === null) { setError('Conversion error'); return; }

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
          Concentration value for {toolName}
        </label>
        <input
          id={`${toolId}-value`}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter concentration value"
          aria-label="Concentration value to convert"
          className="input-field"
        />
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label htmlFor={`${toolId}-from`} className="block text-xs text-gray-500 mb-1">From</label>
            <select id={`${toolId}-from`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label="Source concentration unit" className="input-field text-sm">
              {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-to`} className="block text-xs text-gray-500 mb-1">To</label>
            <select id={`${toolId}-to`} value={toUnit} onChange={(e) => setToUnit(e.target.value)} aria-label="Target concentration unit" className="input-field text-sm">
              {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-3">
          <label htmlFor={`${toolId}-mm`} className="block text-xs text-gray-500 mb-1">Molar Mass (g/mol) — required for mol/L conversions</label>
          <input
            id={`${toolId}-mm`}
            type="text"
            inputMode="decimal"
            value={molarMass}
            onChange={(e) => setMolarMass(e.target.value)}
            placeholder="e.g. 58.44 (NaCl)"
            aria-label="Molar mass"
            className="input-field text-sm"
          />
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert concentration" className="btn-primary">
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
              Note: ppm ≈ mg/L assumes dilute aqueous solutions (density ≈ 1 g/mL)
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
