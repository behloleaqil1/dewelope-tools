'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ShearForceCalculator - Calculates shear stress using τ = F/A
 */
export default function ShearForceCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [force, setForce] = useState('');
  const [area, setArea] = useState('');
  const [result, setResult] = useState<{ shearStress: number; formula: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult(null);

    const f = parseFloat(force);
    const a = parseFloat(area);

    if (isNaN(f) || isNaN(a)) {
      setError('Please enter valid numeric values');
      return;
    }
    if (a <= 0) {
      setError('Area must be positive');
      return;
    }

    const shearStress = f / a;
    const formula = `τ = F/A = ${f} / ${a} = ${shearStress.toFixed(4)} Pa`;

    setResult({ shearStress, formula });
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-force`} className="block text-sm font-medium text-gray-700 mb-1">Shear Force (N)</label>
        <input id={`${toolId}-force`} type="number" value={force} onChange={(e) => setForce(e.target.value)} placeholder="Enter shear force" aria-label={`Shear force input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <label htmlFor={`${toolId}-area`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Cross-sectional Area (m²)</label>
        <input id={`${toolId}-area`} type="number" step="any" value={area} onChange={(e) => setArea(e.target.value)} placeholder="Enter area" aria-label={`Area input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </InputArea>

      <button onClick={calculate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-lg font-semibold text-gray-800">Shear Stress: {result.shearStress.toFixed(4)} Pa</div>
            <div className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200 font-mono">{result.formula}</div>
            <CopyToClipboard text={`τ = ${result.shearStress.toFixed(4)} Pa`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
