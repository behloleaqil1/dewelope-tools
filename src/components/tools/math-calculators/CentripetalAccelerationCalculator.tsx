'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CentripetalAccelerationCalculator - Calculates centripetal acceleration using a = v²/r
 */
export default function CentripetalAccelerationCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [velocity, setVelocity] = useState('');
  const [radius, setRadius] = useState('');
  const [result, setResult] = useState<{ acceleration: number; force: string; formula: string } | null>(null);
  const [mass, setMass] = useState('');
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult(null);

    const v = parseFloat(velocity);
    const r = parseFloat(radius);
    const m = parseFloat(mass);

    if (isNaN(v) || isNaN(r)) {
      setError('Please enter valid numeric values for velocity and radius');
      return;
    }
    if (r <= 0) {
      setError('Radius must be positive');
      return;
    }

    const acceleration = (v * v) / r;
    let forceStr = '';
    if (!isNaN(m) && m > 0) {
      const force = m * acceleration;
      forceStr = `Centripetal Force: F = ma = ${m} × ${acceleration.toFixed(4)} = ${force.toFixed(4)} N`;
    }
    const formula = `a = v²/r = ${v}² / ${r} = ${acceleration.toFixed(4)} m/s²`;

    setResult({ acceleration, force: forceStr, formula });
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-velocity`} className="block text-sm font-medium text-gray-700 mb-1">Velocity (m/s)</label>
        <input id={`${toolId}-velocity`} type="number" value={velocity} onChange={(e) => setVelocity(e.target.value)} placeholder="Enter tangential velocity" aria-label={`Velocity input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Radius (m)</label>
        <input id={`${toolId}-radius`} type="number" value={radius} onChange={(e) => setRadius(e.target.value)} placeholder="Enter radius of circular path" aria-label={`Radius input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <label htmlFor={`${toolId}-mass`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Mass (kg, optional - for force calculation)</label>
        <input id={`${toolId}-mass`} type="number" value={mass} onChange={(e) => setMass(e.target.value)} placeholder="Optional: enter mass for force" aria-label={`Mass input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </InputArea>

      <button onClick={calculate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-lg font-semibold text-gray-800">Centripetal Acceleration: {result.acceleration.toFixed(4)} m/s²</div>
            {result.force && <div className="text-md text-gray-700">{result.force}</div>}
            <div className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200 font-mono">{result.formula}</div>
            <CopyToClipboard text={`a = ${result.acceleration.toFixed(4)} m/s²`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
