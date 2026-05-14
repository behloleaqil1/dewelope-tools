'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ElasticCollisionCalculator - Calculates final velocities in a 1D elastic collision
 * using conservation of momentum and kinetic energy.
 */
export default function ElasticCollisionCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [m1, setM1] = useState('');
  const [v1, setV1] = useState('');
  const [m2, setM2] = useState('');
  const [v2, setV2] = useState('');
  const [result, setResult] = useState<{ v1f: number; v2f: number; formula: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult(null);

    const mass1 = parseFloat(m1);
    const vel1 = parseFloat(v1);
    const mass2 = parseFloat(m2);
    const vel2 = parseFloat(v2);

    if (isNaN(mass1) || isNaN(vel1) || isNaN(mass2) || isNaN(vel2)) {
      setError('Please enter valid numeric values for all fields');
      return;
    }
    if (mass1 <= 0 || mass2 <= 0) {
      setError('Masses must be positive');
      return;
    }

    const v1f = ((mass1 - mass2) * vel1 + 2 * mass2 * vel2) / (mass1 + mass2);
    const v2f = ((mass2 - mass1) * vel2 + 2 * mass1 * vel1) / (mass1 + mass2);
    const formula = `v₁' = ((m₁-m₂)v₁ + 2m₂v₂)/(m₁+m₂) = ${v1f.toFixed(4)} m/s\nv₂' = ((m₂-m₁)v₂ + 2m₁v₁)/(m₁+m₂) = ${v2f.toFixed(4)} m/s`;

    setResult({ v1f, v2f, formula });
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="text-sm font-semibold text-gray-600 mb-2">Object 1</div>
        <label htmlFor={`${toolId}-m1`} className="block text-sm font-medium text-gray-700 mb-1">Mass 1 (kg)</label>
        <input id={`${toolId}-m1`} type="number" value={m1} onChange={(e) => setM1(e.target.value)} placeholder="Mass of object 1" aria-label={`Mass 1 input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <label htmlFor={`${toolId}-v1`} className="block text-sm font-medium text-gray-700 mb-1 mt-2">Velocity 1 (m/s)</label>
        <input id={`${toolId}-v1`} type="number" value={v1} onChange={(e) => setV1(e.target.value)} placeholder="Initial velocity of object 1" aria-label={`Velocity 1 input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <div className="text-sm font-semibold text-gray-600 mb-2 mt-4">Object 2</div>
        <label htmlFor={`${toolId}-m2`} className="block text-sm font-medium text-gray-700 mb-1">Mass 2 (kg)</label>
        <input id={`${toolId}-m2`} type="number" value={m2} onChange={(e) => setM2(e.target.value)} placeholder="Mass of object 2" aria-label={`Mass 2 input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <label htmlFor={`${toolId}-v2`} className="block text-sm font-medium text-gray-700 mb-1 mt-2">Velocity 2 (m/s)</label>
        <input id={`${toolId}-v2`} type="number" value={v2} onChange={(e) => setV2(e.target.value)} placeholder="Initial velocity of object 2" aria-label={`Velocity 2 input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </InputArea>

      <button onClick={calculate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-lg font-semibold text-gray-800">Final Velocity 1: {result.v1f.toFixed(4)} m/s</div>
            <div className="text-lg font-semibold text-gray-800">Final Velocity 2: {result.v2f.toFixed(4)} m/s</div>
            <div className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200 font-mono whitespace-pre-line">{result.formula}</div>
            <CopyToClipboard text={`v₁' = ${result.v1f.toFixed(4)} m/s, v₂' = ${result.v2f.toFixed(4)} m/s`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
