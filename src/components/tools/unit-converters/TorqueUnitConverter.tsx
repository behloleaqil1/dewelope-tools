'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TorqueUnitConverter - Convert between N·m, ft·lb, kgf·m, and other torque units.
 */
export default function TorqueUnitConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('Nm');
  const [result, setResult] = useState<{ unit: string; value: string }[] | null>(null);
  const [error, setError] = useState('');

  const TO_NM: Record<string, number> = {
    Nm: 1,
    kNm: 1000,
    ftlb: 1.3558179483,
    inlb: 0.1129848290,
    kgfm: 9.80665,
    kgfcm: 0.0980665,
    ozfin: 0.00706155,
    dynecm: 1e-7,
  };

  const UNITS = [
    { value: 'Nm', label: 'Newton-meter (N·m)' },
    { value: 'kNm', label: 'Kilonewton-meter (kN·m)' },
    { value: 'ftlb', label: 'Foot-pound (ft·lb)' },
    { value: 'inlb', label: 'Inch-pound (in·lb)' },
    { value: 'kgfm', label: 'Kilogram-force meter (kgf·m)' },
    { value: 'kgfcm', label: 'Kilogram-force cm (kgf·cm)' },
    { value: 'ozfin', label: 'Ounce-force inch (ozf·in)' },
    { value: 'dynecm', label: 'Dyne-centimeter (dyn·cm)' },
  ];

  function convert() {
    setError('');
    setResult(null);
    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) { setError('Please enter a valid number'); return; }

    const nm = num * TO_NM[fromUnit];
    const results = UNITS.map(u => ({
      unit: u.label,
      value: (nm / TO_NM[u.value]).toLocaleString(undefined, { maximumFractionDigits: 8 }),
    }));
    setResult(results);
  }

  const copyText = result ? result.map(r => `${r.unit}: ${r.value}`).join('\n') : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Value</label>
        <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter torque value" aria-label={`Torque value for ${toolName}`} className="input-field" />
        <div className="mt-3">
          <label htmlFor={`${toolId}-from`} className="block text-xs text-gray-500 mb-1">From</label>
          <select id={`${toolId}-from`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label="Source torque unit" className="input-field">
            {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
          </select>
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert torque" className="btn-primary">Convert</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {result.map(r => (
                <div key={r.unit} className="bg-gray-50 p-2 rounded border border-gray-200 text-sm">
                  <span className="text-gray-500">{r.unit}:</span> <span className="font-mono font-medium">{r.value}</span>
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
