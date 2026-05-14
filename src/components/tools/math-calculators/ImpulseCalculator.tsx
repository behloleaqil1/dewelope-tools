'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ImpulseCalculator - Calculates impulse using J = F × Δt
 */
export default function ImpulseCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [force, setForce] = useState('');
  const [time, setTime] = useState('');
  const [result, setResult] = useState<{ impulse: number; formula: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult(null);

    const f = parseFloat(force);
    const dt = parseFloat(time);

    if (isNaN(f) || isNaN(dt)) {
      setError('Please enter valid numeric values for force and time');
      return;
    }
    if (dt < 0) {
      setError('Time interval cannot be negative');
      return;
    }

    const impulse = f * dt;
    const formula = `J = F × Δt = ${f} × ${dt} = ${impulse.toFixed(4)} N·s`;

    setResult({ impulse, formula });
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-force`} className="block text-sm font-medium text-gray-700 mb-1">Force (N)</label>
        <input id={`${toolId}-force`} type="number" value={force} onChange={(e) => setForce(e.target.value)} placeholder="Enter force in Newtons" aria-label={`Force input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <label htmlFor={`${toolId}-time`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Time interval (s)</label>
        <input id={`${toolId}-time`} type="number" value={time} onChange={(e) => setTime(e.target.value)} placeholder="Enter time in seconds" aria-label={`Time interval input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </InputArea>

      <button onClick={calculate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-lg font-semibold text-gray-800">Impulse: {result.impulse.toFixed(4)} N·s</div>
            <div className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200 font-mono">{result.formula}</div>
            <CopyToClipboard text={`${result.impulse.toFixed(4)} N·s`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
