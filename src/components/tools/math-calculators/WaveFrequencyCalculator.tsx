'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * WaveFrequencyCalculator - Calculates wave frequency using f = v/λ
 */
export default function WaveFrequencyCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [velocity, setVelocity] = useState('');
  const [wavelength, setWavelength] = useState('');
  const [result, setResult] = useState<{ frequency: number; period: number; formula: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult(null);

    const v = parseFloat(velocity);
    const lambda = parseFloat(wavelength);

    if (isNaN(v) || isNaN(lambda)) {
      setError('Please enter valid numeric values');
      return;
    }
    if (lambda <= 0) {
      setError('Wavelength must be positive');
      return;
    }

    const frequency = v / lambda;
    const period = 1 / frequency;
    const formula = `f = v/λ = ${v} / ${lambda} = ${frequency.toFixed(4)} Hz`;

    setResult({ frequency, period, formula });
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-velocity`} className="block text-sm font-medium text-gray-700 mb-1">Wave Speed (m/s)</label>
        <input id={`${toolId}-velocity`} type="number" value={velocity} onChange={(e) => setVelocity(e.target.value)} placeholder="e.g., 343 for sound in air" aria-label={`Wave speed input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <label htmlFor={`${toolId}-wavelength`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Wavelength (m)</label>
        <input id={`${toolId}-wavelength`} type="number" value={wavelength} onChange={(e) => setWavelength(e.target.value)} placeholder="Enter wavelength" aria-label={`Wavelength input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </InputArea>

      <button onClick={calculate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-lg font-semibold text-gray-800">Frequency: {result.frequency.toFixed(4)} Hz</div>
            <div className="text-md text-gray-700">Period: {result.period.toFixed(6)} s</div>
            <div className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200 font-mono">{result.formula}</div>
            <CopyToClipboard text={`f = ${result.frequency.toFixed(4)} Hz, T = ${result.period.toFixed(6)} s`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
