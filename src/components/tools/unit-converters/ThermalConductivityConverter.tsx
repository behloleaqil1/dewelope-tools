'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ThermalConductivityConverter - Converts between thermal conductivity units:
 * W/(m·K), BTU/(hr·ft·°F), cal/(s·cm·°C), W/(cm·K)
 */
export default function ThermalConductivityConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('w-m-k');
  const [toUnit, setToUnit] = useState('btu-hr-ft-f');
  const [error, setError] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const units = [
    { value: 'w-m-k', label: 'W/(m·K)' },
    { value: 'w-cm-k', label: 'W/(cm·K)' },
    { value: 'btu-hr-ft-f', label: 'BTU/(hr·ft·°F)' },
    { value: 'cal-s-cm-c', label: 'cal/(s·cm·°C)' },
  ];

  // Conversion factors to W/(m·K) as base
  const toBase: Record<string, number> = {
    'w-m-k': 1,
    'w-cm-k': 100,
    'btu-hr-ft-f': 1.730735,
    'cal-s-cm-c': 418.68,
  };

  const convert = () => {
    setError('');
    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) { setError('Enter a valid number'); setResult(null); return; }

    const baseValue = num * toBase[fromUnit];
    const converted = baseValue / toBase[toUnit];
    setResult(converted.toPrecision(8));
  };

  const getUnitLabel = (val: string) => units.find((u) => u.value === val)?.label || val;
  const copyText = result ? `${value} ${getUnitLabel(fromUnit)} = ${result} ${getUnitLabel(toUnit)}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputArea error={error}>
          <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Value</label>
          <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => { setValue(e.target.value); if (error) setError(''); }} placeholder="e.g. 1.0" aria-label={`Value for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-from`} className="block text-sm font-medium text-gray-700 mb-1">From</label>
          <select id={`${toolId}-from`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label={`Source unit for ${toolName}`} className="input-field">
            {units.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
          </select>
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-to`} className="block text-sm font-medium text-gray-700 mb-1">To</label>
          <select id={`${toolId}-to`} value={toUnit} onChange={(e) => setToUnit(e.target.value)} aria-label={`Target unit for ${toolName}`} className="input-field">
            {units.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
          </select>
        </InputArea>
      </div>

      <button onClick={convert} aria-label="Convert thermal conductivity" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-2">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-sm text-gray-500">{value} {getUnitLabel(fromUnit)} =</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">{result} {getUnitLabel(toUnit)}</div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
