'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * StressStrainCalculator - Calculates stress (σ = F/A) and strain (ε = ΔL/L)
 */
export default function StressStrainCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [force, setForce] = useState('');
  const [area, setArea] = useState('');
  const [deltaL, setDeltaL] = useState('');
  const [originalL, setOriginalL] = useState('');
  const [result, setResult] = useState<{ stress: number; strain: number; youngsModulus: number; formula: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult(null);

    const f = parseFloat(force);
    const a = parseFloat(area);
    const dl = parseFloat(deltaL);
    const l = parseFloat(originalL);

    if (isNaN(f) || isNaN(a) || isNaN(dl) || isNaN(l)) {
      setError('Please enter valid numeric values for all fields');
      return;
    }
    if (a <= 0) { setError('Cross-sectional area must be positive'); return; }
    if (l <= 0) { setError('Original length must be positive'); return; }

    const stress = f / a;
    const strain = dl / l;
    const youngsModulus = strain !== 0 ? stress / strain : 0;
    const formula = `σ = F/A = ${f}/${a} = ${stress.toFixed(4)} Pa\nε = ΔL/L = ${dl}/${l} = ${strain.toFixed(6)}\nE = σ/ε = ${youngsModulus.toFixed(2)} Pa`;

    setResult({ stress, strain, youngsModulus, formula });
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-force`} className="block text-sm font-medium text-gray-700 mb-1">Applied Force (N)</label>
        <input id={`${toolId}-force`} type="number" value={force} onChange={(e) => setForce(e.target.value)} placeholder="Enter force" aria-label={`Force input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <label htmlFor={`${toolId}-area`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Cross-sectional Area (m²)</label>
        <input id={`${toolId}-area`} type="number" step="any" value={area} onChange={(e) => setArea(e.target.value)} placeholder="Enter area" aria-label={`Area input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <label htmlFor={`${toolId}-deltaL`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Change in Length ΔL (m)</label>
        <input id={`${toolId}-deltaL`} type="number" step="any" value={deltaL} onChange={(e) => setDeltaL(e.target.value)} placeholder="Enter deformation" aria-label={`Change in length input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <label htmlFor={`${toolId}-originalL`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Original Length (m)</label>
        <input id={`${toolId}-originalL`} type="number" value={originalL} onChange={(e) => setOriginalL(e.target.value)} placeholder="Enter original length" aria-label={`Original length input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </InputArea>

      <button onClick={calculate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-lg font-semibold text-gray-800">Stress (σ): {result.stress.toFixed(4)} Pa</div>
            <div className="text-md text-gray-700">Strain (ε): {result.strain.toFixed(6)}</div>
            <div className="text-md text-gray-700">Young&apos;s Modulus (E): {result.youngsModulus.toFixed(2)} Pa</div>
            <div className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200 font-mono whitespace-pre-line">{result.formula}</div>
            <CopyToClipboard text={`Stress: ${result.stress.toFixed(4)} Pa, Strain: ${result.strain.toFixed(6)}, Young's Modulus: ${result.youngsModulus.toFixed(2)} Pa`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
