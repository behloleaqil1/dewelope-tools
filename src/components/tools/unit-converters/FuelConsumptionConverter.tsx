'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FuelConsumptionConverter - Convert between L/100km, MPG (US/UK), km/L.
 */
export default function FuelConsumptionConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('l100km');
  const [error, setError] = useState('');
  const [results, setResults] = useState<{ unit: string; value: string }[] | null>(null);

  const unitLabels: Record<string, string> = {
    l100km: 'Liters/100km (L/100km)',
    mpgUS: 'Miles/gallon US (MPG)',
    mpgUK: 'Miles/gallon UK (MPG)',
    kmL: 'Kilometers/liter (km/L)',
    miL: 'Miles/liter (mi/L)',
  };

  const convert = () => {
    setError('');
    const num = parseFloat(value);
    if (!value.trim() || isNaN(num) || num <= 0) {
      setError('Please enter a valid positive number.');
      setResults(null);
      return;
    }

    // Convert to L/100km as base
    let l100km: number;
    switch (fromUnit) {
      case 'l100km': l100km = num; break;
      case 'mpgUS': l100km = 235.215 / num; break;
      case 'mpgUK': l100km = 282.481 / num; break;
      case 'kmL': l100km = 100 / num; break;
      case 'miL': l100km = 62.1371 / num; break;
      default: l100km = num;
    }

    const converted = [
      { unit: unitLabels.l100km, value: l100km.toFixed(4) },
      { unit: unitLabels.mpgUS, value: (235.215 / l100km).toFixed(4) },
      { unit: unitLabels.mpgUK, value: (282.481 / l100km).toFixed(4) },
      { unit: unitLabels.kmL, value: (100 / l100km).toFixed(4) },
      { unit: unitLabels.miL, value: (62.1371 / l100km).toFixed(4) },
    ];

    setResults(converted);
  };

  const copyText = results ? results.map((r) => `${r.unit}: ${r.value}`).join('\n') : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea error={error}>
          <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Value</label>
          <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 8.5" aria-label={`Value for ${toolName}`} className="input-field" />
        </InputArea>
        <div>
          <label htmlFor={`${toolId}-from`} className="block text-sm font-medium text-gray-700 mb-1">From Unit</label>
          <select id={`${toolId}-from`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label="Source unit" className="input-field">
            {Object.entries(unitLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <button onClick={convert} aria-label="Convert fuel consumption" className="btn-primary">Convert</button>

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
