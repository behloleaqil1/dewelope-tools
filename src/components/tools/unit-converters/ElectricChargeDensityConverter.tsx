'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ElectricChargeDensityConverter - Convert between C/m³, C/cm³, mC/m³, µC/m³.
 */
export default function ElectricChargeDensityConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('cPerM3');
  const [error, setError] = useState('');
  const [results, setResults] = useState<{ unit: string; value: string }[] | null>(null);

  const toCPerM3: Record<string, number> = {
    microCPerM3: 1e-6,
    milliCPerM3: 1e-3,
    cPerM3: 1,
    cPerCm3: 1e6,
    cPerL: 1e3,
  };

  const unitLabels: Record<string, string> = {
    microCPerM3: 'Microcoulomb/m³ (µC/m³)',
    milliCPerM3: 'Millicoulomb/m³ (mC/m³)',
    cPerM3: 'Coulomb/m³ (C/m³)',
    cPerCm3: 'Coulomb/cm³ (C/cm³)',
    cPerL: 'Coulomb/liter (C/L)',
  };

  const convert = () => {
    setError('');
    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) { setError('Please enter a valid number.'); setResults(null); return; }

    const inCPerM3 = num * toCPerM3[fromUnit];
    const converted = Object.entries(toCPerM3).map(([unit, factor]) => ({
      unit: unitLabels[unit],
      value: (inCPerM3 / factor).toExponential(6),
    }));
    setResults(converted);
  };

  const copyText = results ? results.map((r) => `${r.unit}: ${r.value}`).join('\n') : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea error={error}>
          <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Value</label>
          <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 1.5" aria-label={`Value for ${toolName}`} className="input-field" />
        </InputArea>
        <div>
          <label htmlFor={`${toolId}-from`} className="block text-sm font-medium text-gray-700 mb-1">From Unit</label>
          <select id={`${toolId}-from`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label="Source unit" className="input-field">
            {Object.entries(unitLabels).map(([key, label]) => (<option key={key} value={key}>{label}</option>))}
          </select>
        </div>
      </div>
      <button onClick={convert} aria-label="Convert charge density" className="btn-primary">Convert</button>
      <OutputArea hasContent={results !== null}>
        {results && (
          <div className="space-y-2">
            <div className="space-y-1">
              {results.map((r, i) => (
                <div key={i} className="flex justify-between bg-gray-50 p-2 rounded border border-gray-200">
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
