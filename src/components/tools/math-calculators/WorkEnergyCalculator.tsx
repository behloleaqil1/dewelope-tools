'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * WorkEnergyCalculator - Calculates work done using W = F × d × cos(θ)
 */
export default function WorkEnergyCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [force, setForce] = useState('');
  const [distance, setDistance] = useState('');
  const [angle, setAngle] = useState('0');
  const [result, setResult] = useState<{ work: number; formula: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult(null);

    const f = parseFloat(force);
    const d = parseFloat(distance);
    const a = parseFloat(angle);

    if (isNaN(f) || isNaN(d) || isNaN(a)) {
      setError('Please enter valid numeric values for all fields');
      return;
    }
    if (d < 0) {
      setError('Distance cannot be negative');
      return;
    }

    const angleRad = (a * Math.PI) / 180;
    const work = f * d * Math.cos(angleRad);
    const formula = `W = F × d × cos(θ) = ${f} × ${d} × cos(${a}°) = ${work.toFixed(4)} J`;

    setResult({ work, formula });
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-force`} className="block text-sm font-medium text-gray-700 mb-1">Force (N)</label>
        <input id={`${toolId}-force`} type="number" value={force} onChange={(e) => setForce(e.target.value)} placeholder="Enter force in Newtons" aria-label={`Force input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <label htmlFor={`${toolId}-distance`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Distance (m)</label>
        <input id={`${toolId}-distance`} type="number" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="Enter distance in meters" aria-label={`Distance input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <label htmlFor={`${toolId}-angle`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Angle between force and displacement (degrees)</label>
        <input id={`${toolId}-angle`} type="number" value={angle} onChange={(e) => setAngle(e.target.value)} placeholder="Enter angle (0 for same direction)" aria-label={`Angle input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </InputArea>

      <button onClick={calculate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-lg font-semibold text-gray-800">Work Done: {result.work.toFixed(4)} J</div>
            <div className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200 font-mono">{result.formula}</div>
            <CopyToClipboard text={`${result.work.toFixed(4)} J`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
