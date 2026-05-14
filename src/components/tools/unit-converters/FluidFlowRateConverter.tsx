'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FluidFlowRateConverter - Convert between L/s, gal/min, m³/h, and other flow rates.
 */
export default function FluidFlowRateConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('lps');
  const [result, setResult] = useState<{ unit: string; value: string }[] | null>(null);
  const [error, setError] = useState('');

  // All to liters per second
  const TO_LPS: Record<string, number> = {
    lps: 1,
    lpm: 1 / 60,
    lph: 1 / 3600,
    m3s: 1000,
    m3h: 1000 / 3600,
    gpm: 0.0630902,
    gph: 0.0630902 / 60,
    cfm: 0.471947,
    cfs: 28.3168,
  };

  const UNITS = [
    { value: 'lps', label: 'Liters/second (L/s)' },
    { value: 'lpm', label: 'Liters/minute (L/min)' },
    { value: 'lph', label: 'Liters/hour (L/h)' },
    { value: 'm3s', label: 'Cubic meters/second (m³/s)' },
    { value: 'm3h', label: 'Cubic meters/hour (m³/h)' },
    { value: 'gpm', label: 'Gallons/minute (US gal/min)' },
    { value: 'gph', label: 'Gallons/hour (US gal/h)' },
    { value: 'cfm', label: 'Cubic feet/minute (CFM)' },
    { value: 'cfs', label: 'Cubic feet/second (CFS)' },
  ];

  function convert() {
    setError('');
    setResult(null);
    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) { setError('Please enter a valid number'); return; }

    const lps = num * TO_LPS[fromUnit];
    const results = UNITS.map(u => ({
      unit: u.label,
      value: (lps / TO_LPS[u.value]).toLocaleString(undefined, { maximumFractionDigits: 8 }),
    }));
    setResult(results);
  }

  const copyText = result ? result.map(r => `${r.unit}: ${r.value}`).join('\n') : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Value</label>
        <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter flow rate" aria-label={`Flow rate for ${toolName}`} className="input-field" />
        <div className="mt-3">
          <label htmlFor={`${toolId}-from`} className="block text-xs text-gray-500 mb-1">From</label>
          <select id={`${toolId}-from`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label="Source flow rate unit" className="input-field">
            {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
          </select>
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert flow rate" className="btn-primary">Convert</button>

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
