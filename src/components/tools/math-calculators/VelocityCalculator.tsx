'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * VelocityCalculator - Calculates velocity from distance and time (v = d/t).
 */
export default function VelocityCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [distance, setDistance] = useState('');
  const [time, setTime] = useState('');
  const [distUnit, setDistUnit] = useState('m');
  const [timeUnit, setTimeUnit] = useState('s');
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<{ velocity: number; unit: string; conversions: { label: string; value: string }[] } | null>(null);

  const calculate = () => {
    setError(undefined);
    setResult(null);
    const d = parseFloat(distance);
    const t = parseFloat(time);
    if (isNaN(d) || d < 0) { setError('Enter a valid distance'); return; }
    if (isNaN(t) || t <= 0) { setError('Enter a valid time greater than 0'); return; }

    // Convert to meters and seconds
    const distFactors: Record<string, number> = { m: 1, km: 1000, mi: 1609.344, ft: 0.3048 };
    const timeFactors: Record<string, number> = { s: 1, min: 60, h: 3600 };

    const meters = d * distFactors[distUnit];
    const seconds = t * timeFactors[timeUnit];
    const velocityMs = meters / seconds;

    const conversions = [
      { label: 'm/s', value: velocityMs.toFixed(4) },
      { label: 'km/h', value: (velocityMs * 3.6).toFixed(4) },
      { label: 'mph', value: (velocityMs * 2.23694).toFixed(4) },
      { label: 'ft/s', value: (velocityMs * 3.28084).toFixed(4) },
      { label: 'knots', value: (velocityMs * 1.94384).toFixed(4) },
    ];

    setResult({ velocity: velocityMs, unit: 'm/s', conversions });
  };

  const copyText = result ? `Velocity: ${result.velocity.toFixed(4)} m/s\n${result.conversions.map(c => `${c.label}: ${c.value}`).join('\n')}\n\nFormula: v = d/t = ${distance} ${distUnit} / ${time} ${timeUnit}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-dist`} className="block text-sm font-medium text-gray-700 mb-1">Distance</label>
            <div className="flex gap-2">
              <input id={`${toolId}-dist`} type="number" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="100" aria-label={`Distance input for ${toolName}`} className="input-field flex-1" />
              <select value={distUnit} onChange={(e) => setDistUnit(e.target.value)} aria-label="Distance unit" className="input-field w-20">
                <option value="m">m</option>
                <option value="km">km</option>
                <option value="mi">mi</option>
                <option value="ft">ft</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-time`} className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <div className="flex gap-2">
              <input id={`${toolId}-time`} type="number" value={time} onChange={(e) => setTime(e.target.value)} placeholder="10" aria-label="Time input" className="input-field flex-1" />
              <select value={timeUnit} onChange={(e) => setTimeUnit(e.target.value)} aria-label="Time unit" className="input-field w-20">
                <option value="s">s</option>
                <option value="min">min</option>
                <option value="h">h</option>
              </select>
            </div>
          </div>
        </div>
      </InputArea>
      <button onClick={calculate} aria-label="Calculate velocity" className="btn-primary">Calculate</button>
      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
              <div className="text-xs text-gray-500">Formula: v = d ÷ t</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {result.conversions.map(c => (
                <div key={c.label} className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                  <div className="text-lg font-bold text-gray-800">{c.value}</div>
                  <div className="text-xs text-gray-500">{c.label}</div>
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
