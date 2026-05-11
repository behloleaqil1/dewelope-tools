'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TorqueConverter - Converts between torque units: Nm, ft-lb, kgf-m, in-lb, etc.
 */
export default function TorqueConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('nm');
  const [toUnit, setToUnit] = useState('ft-lb');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();

  const TO_NM: Record<string, number> = {
    nm: 1,
    'ft-lb': 1.35582,
    'in-lb': 0.112985,
    'kgf-m': 9.80665,
    'kgf-cm': 0.0980665,
    'dyne-cm': 1e-7,
    'ozf-in': 0.00706155,
  };

  const UNITS = [
    { value: 'nm', label: 'Newton-meter (N·m)' },
    { value: 'ft-lb', label: 'Foot-pound (ft·lbf)' },
    { value: 'in-lb', label: 'Inch-pound (in·lbf)' },
    { value: 'kgf-m', label: 'Kilogram-force meter (kgf·m)' },
    { value: 'kgf-cm', label: 'Kilogram-force cm (kgf·cm)' },
    { value: 'dyne-cm', label: 'Dyne-centimeter (dyn·cm)' },
    { value: 'ozf-in', label: 'Ounce-force inch (ozf·in)' },
  ];

  function convert() {
    setError(undefined);
    setResult(null);

    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) { setError('Please enter a valid number'); return; }

    const nm = num * TO_NM[fromUnit];
    const converted = nm / TO_NM[toUnit];

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
        <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Torque value for {toolName}</label>
        <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter torque value" aria-label="Torque value" className="input-field" />
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label htmlFor={`${toolId}-from`} className="block text-xs text-gray-500 mb-1">From</label>
            <select id={`${toolId}-from`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label="Source torque unit" className="input-field text-sm">
              {UNITS.map((u) => (<option key={u.value} value={u.value}>{u.label}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-to`} className="block text-xs text-gray-500 mb-1">To</label>
            <select id={`${toolId}-to`} value={toUnit} onChange={(e) => setToUnit(e.target.value)} aria-label="Target torque unit" className="input-field text-sm">
              {UNITS.map((u) => (<option key={u.value} value={u.value}>{u.label}</option>))}
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert torque" className="btn-primary">Convert</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600 font-mono">{result}</div>
              <div className="text-sm text-gray-500 mt-1">{toLabel}</div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
