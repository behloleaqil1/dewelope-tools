'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BernoulliEquationCalculator - Applies Bernoulli's equation: P + ½ρv² + ρgh = constant
 * Calculates unknown at point 2 given conditions at point 1.
 */
export default function BernoulliEquationCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [p1, setP1] = useState('');
  const [v1, setV1] = useState('');
  const [h1, setH1] = useState('');
  const [v2, setV2] = useState('');
  const [h2, setH2] = useState('');
  const [density, setDensity] = useState('1000');
  const [result, setResult] = useState<{ p2: number; formula: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult(null);

    const P1 = parseFloat(p1);
    const V1 = parseFloat(v1);
    const H1 = parseFloat(h1);
    const V2 = parseFloat(v2);
    const H2 = parseFloat(h2);
    const rho = parseFloat(density);

    if (isNaN(P1) || isNaN(V1) || isNaN(H1) || isNaN(V2) || isNaN(H2) || isNaN(rho)) {
      setError('Please enter valid numeric values for all fields');
      return;
    }
    if (rho <= 0) {
      setError('Density must be positive');
      return;
    }

    const g = 9.81;
    const P2 = P1 + 0.5 * rho * (V1 * V1 - V2 * V2) + rho * g * (H1 - H2);
    const formula = `P₂ = P₁ + ½ρ(v₁² - v₂²) + ρg(h₁ - h₂) = ${P2.toFixed(2)} Pa`;

    setResult({ p2: P2, formula });
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="text-sm font-semibold text-gray-600 mb-2">Point 1 Conditions</div>
        <label htmlFor={`${toolId}-p1`} className="block text-sm font-medium text-gray-700 mb-1">Pressure at point 1 (Pa)</label>
        <input id={`${toolId}-p1`} type="number" value={p1} onChange={(e) => setP1(e.target.value)} placeholder="Pressure at point 1" aria-label={`Pressure at point 1 for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <label htmlFor={`${toolId}-v1`} className="block text-sm font-medium text-gray-700 mb-1 mt-2">Velocity at point 1 (m/s)</label>
        <input id={`${toolId}-v1`} type="number" value={v1} onChange={(e) => setV1(e.target.value)} placeholder="Velocity at point 1" aria-label={`Velocity at point 1 for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <label htmlFor={`${toolId}-h1`} className="block text-sm font-medium text-gray-700 mb-1 mt-2">Height at point 1 (m)</label>
        <input id={`${toolId}-h1`} type="number" value={h1} onChange={(e) => setH1(e.target.value)} placeholder="Height at point 1" aria-label={`Height at point 1 for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <div className="text-sm font-semibold text-gray-600 mb-2 mt-4">Point 2 Conditions</div>
        <label htmlFor={`${toolId}-v2`} className="block text-sm font-medium text-gray-700 mb-1">Velocity at point 2 (m/s)</label>
        <input id={`${toolId}-v2`} type="number" value={v2} onChange={(e) => setV2(e.target.value)} placeholder="Velocity at point 2" aria-label={`Velocity at point 2 for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <label htmlFor={`${toolId}-h2`} className="block text-sm font-medium text-gray-700 mb-1 mt-2">Height at point 2 (m)</label>
        <input id={`${toolId}-h2`} type="number" value={h2} onChange={(e) => setH2(e.target.value)} placeholder="Height at point 2" aria-label={`Height at point 2 for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <div className="text-sm font-semibold text-gray-600 mb-2 mt-4">Fluid Properties</div>
        <label htmlFor={`${toolId}-density`} className="block text-sm font-medium text-gray-700 mb-1">Fluid Density (kg/m³)</label>
        <input id={`${toolId}-density`} type="number" value={density} onChange={(e) => setDensity(e.target.value)} placeholder="Default: 1000 for water" aria-label={`Fluid density input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </InputArea>

      <button onClick={calculate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-lg font-semibold text-gray-800">Pressure at Point 2: {result.p2.toFixed(2)} Pa</div>
            <div className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200 font-mono">{result.formula}</div>
            <CopyToClipboard text={`P₂ = ${result.p2.toFixed(2)} Pa`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
