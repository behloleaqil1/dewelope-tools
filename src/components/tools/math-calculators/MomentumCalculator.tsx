'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MomentumCalculator - Calculates linear momentum using p = m × v
 */
export default function MomentumCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mass, setMass] = useState('');
  const [velocity, setVelocity] = useState('');
  const [result, setResult] = useState<{ momentum: number; formula: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult(null);

    const m = parseFloat(mass);
    const v = parseFloat(velocity);

    if (isNaN(m) || isNaN(v)) {
      setError('Please enter valid numeric values for mass and velocity');
      return;
    }
    if (m < 0) {
      setError('Mass cannot be negative');
      return;
    }

    const momentum = m * v;
    const formula = `p = m × v = ${m} × ${v} = ${momentum.toFixed(4)} kg·m/s`;

    setResult({ momentum, formula });
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-mass`} className="block text-sm font-medium text-gray-700 mb-1">Mass (kg)</label>
        <input id={`${toolId}-mass`} type="number" value={mass} onChange={(e) => setMass(e.target.value)} placeholder="Enter mass in kilograms" aria-label={`Mass input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <label htmlFor={`${toolId}-velocity`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Velocity (m/s)</label>
        <input id={`${toolId}-velocity`} type="number" value={velocity} onChange={(e) => setVelocity(e.target.value)} placeholder="Enter velocity in m/s" aria-label={`Velocity input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </InputArea>

      <button onClick={calculate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-lg font-semibold text-gray-800">Momentum: {result.momentum.toFixed(4)} kg·m/s</div>
            <div className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200 font-mono">{result.formula}</div>
            <CopyToClipboard text={`${result.momentum.toFixed(4)} kg·m/s`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
