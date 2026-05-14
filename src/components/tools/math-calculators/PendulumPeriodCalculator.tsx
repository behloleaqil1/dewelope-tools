'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PendulumPeriodCalculator - Calculates period of a simple pendulum using T = 2π√(L/g)
 */
export default function PendulumPeriodCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [length, setLength] = useState('');
  const [gravity, setGravity] = useState('9.81');
  const [result, setResult] = useState<{ period: number; frequency: number; formula: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult(null);

    const l = parseFloat(length);
    const g = parseFloat(gravity);

    if (isNaN(l) || isNaN(g)) {
      setError('Please enter valid numeric values');
      return;
    }
    if (l <= 0) {
      setError('Length must be positive');
      return;
    }
    if (g <= 0) {
      setError('Gravitational acceleration must be positive');
      return;
    }

    const period = 2 * Math.PI * Math.sqrt(l / g);
    const frequency = 1 / period;
    const formula = `T = 2π√(L/g) = 2π√(${l}/${g}) = ${period.toFixed(4)} s`;

    setResult({ period, frequency, formula });
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-length`} className="block text-sm font-medium text-gray-700 mb-1">Pendulum Length (m)</label>
        <input id={`${toolId}-length`} type="number" value={length} onChange={(e) => setLength(e.target.value)} placeholder="Enter length in meters" aria-label={`Pendulum length input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <label htmlFor={`${toolId}-gravity`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Gravitational acceleration (m/s²)</label>
        <input id={`${toolId}-gravity`} type="number" value={gravity} onChange={(e) => setGravity(e.target.value)} placeholder="Default: 9.81 m/s²" aria-label={`Gravity input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </InputArea>

      <button onClick={calculate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-lg font-semibold text-gray-800">Period: {result.period.toFixed(4)} s</div>
            <div className="text-md text-gray-700">Frequency: {result.frequency.toFixed(4)} Hz</div>
            <div className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200 font-mono">{result.formula}</div>
            <CopyToClipboard text={`Period: ${result.period.toFixed(4)} s, Frequency: ${result.frequency.toFixed(4)} Hz`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
