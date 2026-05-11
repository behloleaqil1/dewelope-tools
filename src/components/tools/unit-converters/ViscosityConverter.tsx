'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ViscosityConverter - Convert between Pa·s, cP, P, lb/(ft·s) and other viscosity units.
 * Base unit: Pascal-second (Pa·s)
 */
export default function ViscosityConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('pascal-second');
  const [error, setError] = useState('');
  const [results, setResults] = useState<{ unit: string; value: string }[] | null>(null);

  const toPascalSecond: Record<string, number> = {
    'pascal-second': 1,
    'millipascal-second': 0.001,
    'centipoise': 0.001,
    'poise': 0.1,
    'pound-per-foot-second': 1.48816,
    'kilogram-per-meter-second': 1,
  };

  const unitLabels: Record<string, string> = {
    'pascal-second': 'Pascal-second (Pa·s)',
    'millipascal-second': 'Millipascal-second (mPa·s)',
    'centipoise': 'Centipoise (cP)',
    'poise': 'Poise (P)',
    'pound-per-foot-second': 'Pound per foot-second (lb/(ft·s))',
    'kilogram-per-meter-second': 'Kilogram per meter-second (kg/(m·s))',
  };

  const convert = () => {
    setError('');
    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) {
      setError('Please enter a valid number');
      setResults(null);
      return;
    }

    const inPascalSecond = num * toPascalSecond[fromUnit];
    const converted = Object.entries(toPascalSecond).map(([unit, factor]) => ({
      unit: unitLabels[unit],
      value: (inPascalSecond / factor).toFixed(6),
    }));

    setResults(converted);
  };

  const copyText = results ? results.map((r) => `${r.unit}: ${r.value}`).join('\n') : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea error={error}>
          <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Value</label>
          <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 1" aria-label={`Value for ${toolName}`} className="input-field" />
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

      <button onClick={convert} aria-label="Convert viscosity" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={results !== null}>
        {results && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Conversion Results</label>
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
