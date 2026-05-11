'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpecificHeatConverter - Converts between specific heat capacity units:
 * J/(kg·K), cal/(g·°C), BTU/(lb·°F), kJ/(kg·K)
 */
export default function SpecificHeatConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('j-kg-k');
  const [toUnit, setToUnit] = useState('cal-g-c');
  const [error, setError] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const units = [
    { value: 'j-kg-k', label: 'J/(kg·K)' },
    { value: 'kj-kg-k', label: 'kJ/(kg·K)' },
    { value: 'cal-g-c', label: 'cal/(g·°C)' },
    { value: 'btu-lb-f', label: 'BTU/(lb·°F)' },
  ];

  // Conversion factors to J/(kg·K) as base
  const toBase: Record<string, number> = {
    'j-kg-k': 1,
    'kj-kg-k': 1000,
    'cal-g-c': 4186.8,
    'btu-lb-f': 4186.8,
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
          <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => { setValue(e.target.value); if (error) setError(''); }} placeholder="e.g. 4186.8" aria-label={`Value for ${toolName}`} className="input-field" />
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

      <button onClick={convert} aria-label="Convert specific heat" className="btn-primary">
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
