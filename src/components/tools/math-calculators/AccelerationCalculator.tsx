'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AccelerationCalculator - Calculates acceleration from initial/final velocity and time (a = (vf - vi) / t).
 */
export default function AccelerationCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [initialV, setInitialV] = useState('');
  const [finalV, setFinalV] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<{ acceleration: number; deltaV: number; isDeceleration: boolean } | null>(null);

  const calculate = () => {
    setError(undefined);
    setResult(null);
    const vi = parseFloat(initialV);
    const vf = parseFloat(finalV);
    const t = parseFloat(time);

    if (isNaN(vi)) { setError('Enter a valid initial velocity'); return; }
    if (isNaN(vf)) { setError('Enter a valid final velocity'); return; }
    if (isNaN(t) || t <= 0) { setError('Enter a valid time greater than 0'); return; }

    const deltaV = vf - vi;
    const acceleration = deltaV / t;

    setResult({ acceleration, deltaV, isDeceleration: acceleration < 0 });
  };

  const copyText = result ? `Initial Velocity: ${initialV} m/s\nFinal Velocity: ${finalV} m/s\nTime: ${time} s\nChange in Velocity: ${result.deltaV.toFixed(4)} m/s\nAcceleration: ${result.acceleration.toFixed(4)} m/s²\nType: ${result.isDeceleration ? 'Deceleration' : 'Acceleration'}\n\nFormula: a = (vf - vi) / t` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor={`${toolId}-vi`} className="block text-sm font-medium text-gray-700 mb-1">Initial Velocity (m/s)</label>
            <input id={`${toolId}-vi`} type="number" value={initialV} onChange={(e) => setInitialV(e.target.value)} placeholder="0" aria-label={`Initial velocity for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-vf`} className="block text-sm font-medium text-gray-700 mb-1">Final Velocity (m/s)</label>
            <input id={`${toolId}-vf`} type="number" value={finalV} onChange={(e) => setFinalV(e.target.value)} placeholder="20" aria-label="Final velocity" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-time`} className="block text-sm font-medium text-gray-700 mb-1">Time (s)</label>
            <input id={`${toolId}-time`} type="number" value={time} onChange={(e) => setTime(e.target.value)} placeholder="5" aria-label="Time in seconds" className="input-field" />
          </div>
        </div>
      </InputArea>
      <button onClick={calculate} aria-label="Calculate acceleration" className="btn-primary">Calculate</button>
      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
              <div className="text-xs text-gray-500 mb-1">a = (v<sub>f</sub> - v<sub>i</sub>) / t</div>
              <div className="text-2xl font-bold text-blue-700">{result.acceleration.toFixed(4)} m/s²</div>
              <div className={`text-sm mt-1 ${result.isDeceleration ? 'text-orange-600' : 'text-green-600'}`}>
                {result.isDeceleration ? '↓ Deceleration' : '↑ Acceleration'}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.deltaV.toFixed(4)}</div>
                <div className="text-xs text-gray-500">Δv (m/s)</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{(result.acceleration / 9.81).toFixed(4)}</div>
                <div className="text-xs text-gray-500">g-force</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
