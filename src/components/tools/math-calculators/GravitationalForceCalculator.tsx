'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * GravitationalForceCalculator - Calculates gravitational force using F = Gm₁m₂/r²
 */
export default function GravitationalForceCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mass1, setMass1] = useState('');
  const [mass2, setMass2] = useState('');
  const [distance, setDistance] = useState('');
  const [result, setResult] = useState<{ force: number; formula: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  const G = 6.674e-11;

  function calculate() {
    setError(undefined);
    setResult(null);

    const m1 = parseFloat(mass1);
    const m2 = parseFloat(mass2);
    const r = parseFloat(distance);

    if (isNaN(m1) || isNaN(m2) || isNaN(r)) {
      setError('Please enter valid numeric values for all fields');
      return;
    }
    if (m1 <= 0 || m2 <= 0) {
      setError('Masses must be positive');
      return;
    }
    if (r <= 0) {
      setError('Distance must be positive');
      return;
    }

    const force = (G * m1 * m2) / (r * r);
    const formula = `F = Gm₁m₂/r² = (6.674×10⁻¹¹ × ${m1} × ${m2}) / ${r}² = ${force.toExponential(4)} N`;

    setResult({ force, formula });
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-m1`} className="block text-sm font-medium text-gray-700 mb-1">Mass 1 (kg)</label>
        <input id={`${toolId}-m1`} type="number" value={mass1} onChange={(e) => setMass1(e.target.value)} placeholder="e.g., 5.972e24 for Earth" aria-label={`Mass 1 input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <label htmlFor={`${toolId}-m2`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Mass 2 (kg)</label>
        <input id={`${toolId}-m2`} type="number" value={mass2} onChange={(e) => setMass2(e.target.value)} placeholder="e.g., 70 for a person" aria-label={`Mass 2 input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <label htmlFor={`${toolId}-distance`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Distance between centers (m)</label>
        <input id={`${toolId}-distance`} type="number" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="e.g., 6.371e6 for Earth radius" aria-label={`Distance input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </InputArea>

      <button onClick={calculate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-lg font-semibold text-gray-800">Gravitational Force: {result.force.toExponential(4)} N</div>
            <div className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200 font-mono">{result.formula}</div>
            <div className="text-xs text-gray-500">G = 6.674 × 10⁻¹¹ N·m²/kg²</div>
            <CopyToClipboard text={`F = ${result.force.toExponential(4)} N`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
