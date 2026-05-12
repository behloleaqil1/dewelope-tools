'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TimeDilationCalculator - Calculate relativistic time dilation.
 * Uses the Lorentz factor to compute time dilation at various velocities.
 */
export default function TimeDilationCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [velocity, setVelocity] = useState('0.9');
  const [unit, setUnit] = useState<'fraction' | 'percentage' | 'ms'>('fraction');
  const [stationaryTime, setStationaryTime] = useState('1');
  const [timeUnit, setTimeUnit] = useState<'seconds' | 'minutes' | 'hours' | 'days' | 'years'>('years');
  const [output, setOutput] = useState('');

  const C = 299792458; // speed of light in m/s

  const calculate = () => {
    let v: number;

    if (unit === 'fraction') {
      v = parseFloat(velocity);
    } else if (unit === 'percentage') {
      v = parseFloat(velocity) / 100;
    } else {
      v = parseFloat(velocity) / C;
    }

    if (isNaN(v) || v < 0 || v >= 1) {
      setOutput('Velocity must be between 0 and the speed of light (exclusive).');
      return;
    }

    const t0 = parseFloat(stationaryTime);
    if (isNaN(t0) || t0 <= 0) {
      setOutput('Please enter a valid positive time value.');
      return;
    }

    const gamma = 1 / Math.sqrt(1 - v * v);
    const dilatedTime = t0 * gamma;
    const timeDifference = dilatedTime - t0;
    const velocityMs = v * C;
    const velocityKmh = velocityMs * 3.6;

    const lines = [
      `━━━ Input Parameters ━━━`,
      `Velocity: ${(v * 100).toFixed(6)}% of c`,
      `Velocity: ${velocityMs.toLocaleString(undefined, { maximumFractionDigits: 0 })} m/s`,
      `Velocity: ${velocityKmh.toLocaleString(undefined, { maximumFractionDigits: 0 })} km/h`,
      `Stationary Time: ${t0} ${timeUnit}`,
      ``,
      `━━━ Results ━━━`,
      `Lorentz Factor (γ): ${gamma.toFixed(8)}`,
      `Time for stationary observer: ${dilatedTime.toFixed(6)} ${timeUnit}`,
      `Time for moving observer: ${t0} ${timeUnit}`,
      `Time difference: ${timeDifference.toFixed(6)} ${timeUnit}`,
      ``,
      `━━━ Interpretation ━━━`,
      `A clock moving at ${(v * 100).toFixed(2)}% of c runs ${((1 - 1/gamma) * 100).toFixed(4)}% slower.`,
      `For every ${t0} ${timeUnit} experienced by the traveler,`,
      `${dilatedTime.toFixed(6)} ${timeUnit} pass for the stationary observer.`,
      ``,
      `Formula: t = t₀ × γ = t₀ / √(1 - v²/c²)`,
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-velocity`} className="block text-sm font-medium text-gray-700 mb-1">Velocity</label>
            <input id={`${toolId}-velocity`} type="number" step="any" value={velocity} onChange={(e) => setVelocity(e.target.value)} className="input-field" aria-label={`Velocity for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">Velocity Unit</label>
            <select id={`${toolId}-unit`} value={unit} onChange={(e) => setUnit(e.target.value as typeof unit)} className="input-field" aria-label="Velocity unit">
              <option value="fraction">Fraction of c (0-1)</option>
              <option value="percentage">Percentage of c (%)</option>
              <option value="ms">Meters per second (m/s)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-time`} className="block text-sm font-medium text-gray-700 mb-1">Proper Time (traveler)</label>
            <input id={`${toolId}-time`} type="number" step="any" value={stationaryTime} onChange={(e) => setStationaryTime(e.target.value)} className="input-field" aria-label="Proper time value" />
          </div>
          <div>
            <label htmlFor={`${toolId}-timeunit`} className="block text-sm font-medium text-gray-700 mb-1">Time Unit</label>
            <select id={`${toolId}-timeunit`} value={timeUnit} onChange={(e) => setTimeUnit(e.target.value as typeof timeUnit)} className="input-field" aria-label="Time unit">
              <option value="seconds">Seconds</option>
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
              <option value="days">Days</option>
              <option value="years">Years</option>
            </select>
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Time Dilation</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Time Dilation Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
