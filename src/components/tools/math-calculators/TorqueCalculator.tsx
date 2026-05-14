'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TorqueCalculator - Calculates torque using τ = F × r
 */
export default function TorqueCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [force, setForce] = useState('');
  const [radius, setRadius] = useState('');
  const [angle, setAngle] = useState('90');
  const [result, setResult] = useState<{ torque: number; formula: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult(null);

    const f = parseFloat(force);
    const r = parseFloat(radius);
    const a = parseFloat(angle);

    if (isNaN(f) || isNaN(r) || isNaN(a)) {
      setError('Please enter valid numeric values for all fields');
      return;
    }

    const angleRad = (a * Math.PI) / 180;
    const torque = f * r * Math.sin(angleRad);
    const formula = `τ = F × r × sin(θ) = ${f} × ${r} × sin(${a}°) = ${torque.toFixed(4)} N·m`;

    setResult({ torque, formula });
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-force`} className="block text-sm font-medium text-gray-700 mb-1">Force (N)</label>
        <input id={`${toolId}-force`} type="number" value={force} onChange={(e) => setForce(e.target.value)} placeholder="Enter force in Newtons" aria-label={`Force input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Radius / Lever arm (m)</label>
        <input id={`${toolId}-radius`} type="number" value={radius} onChange={(e) => setRadius(e.target.value)} placeholder="Enter distance from pivot" aria-label={`Radius input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <label htmlFor={`${toolId}-angle`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Angle (degrees)</label>
        <input id={`${toolId}-angle`} type="number" value={angle} onChange={(e) => setAngle(e.target.value)} placeholder="Angle between force and lever arm" aria-label={`Angle input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </InputArea>

      <button onClick={calculate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-lg font-semibold text-gray-800">Torque: {result.torque.toFixed(4)} N·m</div>
            <div className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200 font-mono">{result.formula}</div>
            <CopyToClipboard text={`${result.torque.toFixed(4)} N·m`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
