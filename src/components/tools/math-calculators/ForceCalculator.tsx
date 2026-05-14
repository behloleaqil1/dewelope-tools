'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ForceCalculator - Calculates force using Newton's second law (F = m × a).
 */
export default function ForceCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mass, setMass] = useState('');
  const [acceleration, setAcceleration] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<{ forceN: number; forceKN: number; forceLbf: number; forceDyn: number } | null>(null);

  const calculate = () => {
    setError(undefined);
    setResult(null);
    const m = parseFloat(mass);
    const a = parseFloat(acceleration);

    if (isNaN(m) || m <= 0) { setError('Enter a valid mass greater than 0'); return; }
    if (isNaN(a)) { setError('Enter a valid acceleration'); return; }

    const forceN = m * a;
    setResult({
      forceN,
      forceKN: forceN / 1000,
      forceLbf: forceN * 0.224809,
      forceDyn: forceN * 100000,
    });
  };

  const copyText = result ? `Mass: ${mass} kg\nAcceleration: ${acceleration} m/s²\nForce: ${result.forceN.toFixed(4)} N\nForce: ${result.forceKN.toFixed(6)} kN\nForce: ${result.forceLbf.toFixed(4)} lbf\nForce: ${result.forceDyn.toFixed(2)} dyn\n\nFormula: F = m × a` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-mass`} className="block text-sm font-medium text-gray-700 mb-1">Mass (kg)</label>
            <input id={`${toolId}-mass`} type="number" value={mass} onChange={(e) => setMass(e.target.value)} placeholder="10" aria-label={`Mass input for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-accel`} className="block text-sm font-medium text-gray-700 mb-1">Acceleration (m/s²)</label>
            <input id={`${toolId}-accel`} type="number" value={acceleration} onChange={(e) => setAcceleration(e.target.value)} placeholder="9.81" aria-label="Acceleration input" className="input-field" />
          </div>
        </div>
      </InputArea>
      <button onClick={calculate} aria-label="Calculate force" className="btn-primary">Calculate</button>
      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
              <div className="text-xs text-gray-500 mb-1">F = m × a</div>
              <div className="text-2xl font-bold text-blue-700">{result.forceN.toFixed(4)} N</div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.forceKN.toFixed(6)}</div>
                <div className="text-xs text-gray-500">kN</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.forceLbf.toFixed(4)}</div>
                <div className="text-xs text-gray-500">lbf</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.forceDyn.toFixed(2)}</div>
                <div className="text-xs text-gray-500">dyn</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
