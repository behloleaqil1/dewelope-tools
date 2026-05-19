'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NauticalSpeedConverter - Convert between knots, km/h, mph, m/s, and Beaufort scale.
 */
export default function NauticalSpeedConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('knots');
  const [error, setError] = useState('');
  const [results, setResults] = useState<{ unit: string; value: string }[] | null>(null);

  const toKnots: Record<string, number> = {
    knots: 1,
    kmh: 0.539957,
    mph: 0.868976,
    ms: 1.94384,
  };

  const unitLabels: Record<string, string> = {
    knots: 'Knots (kn)',
    kmh: 'Kilometers/hour (km/h)',
    mph: 'Miles/hour (mph)',
    ms: 'Meters/second (m/s)',
  };

  const getBeaufort = (knots: number): string => {
    if (knots < 1) return '0 - Calm';
    if (knots < 4) return '1 - Light air';
    if (knots < 7) return '2 - Light breeze';
    if (knots < 11) return '3 - Gentle breeze';
    if (knots < 17) return '4 - Moderate breeze';
    if (knots < 22) return '5 - Fresh breeze';
    if (knots < 28) return '6 - Strong breeze';
    if (knots < 34) return '7 - Near gale';
    if (knots < 41) return '8 - Gale';
    if (knots < 48) return '9 - Strong gale';
    if (knots < 56) return '10 - Storm';
    if (knots < 64) return '11 - Violent storm';
    return '12 - Hurricane';
  };

  const convert = () => {
    setError('');
    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) { setError('Please enter a valid number.'); setResults(null); return; }

    const inKnots = num * toKnots[fromUnit];
    const converted = Object.entries(toKnots).map(([unit, factor]) => ({
      unit: unitLabels[unit],
      value: (inKnots / factor).toFixed(4),
    }));
    converted.push({ unit: 'Beaufort Scale', value: getBeaufort(inKnots) });
    setResults(converted);
  };

  const copyText = results ? results.map((r) => `${r.unit}: ${r.value}`).join('\n') : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea error={error}>
          <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Value</label>
          <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 25" aria-label={`Value for ${toolName}`} className="input-field" />
        </InputArea>
        <div>
          <label htmlFor={`${toolId}-from`} className="block text-sm font-medium text-gray-700 mb-1">From Unit</label>
          <select id={`${toolId}-from`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label="Source unit" className="input-field">
            {Object.entries(unitLabels).map(([key, label]) => (<option key={key} value={key}>{label}</option>))}
          </select>
        </div>
      </div>
      <button onClick={convert} aria-label="Convert nautical speed" className="btn-primary">Convert</button>
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
