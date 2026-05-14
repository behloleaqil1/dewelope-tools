'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ThermalExpansionCalculator - Calculates linear thermal expansion using ΔL = α × L₀ × ΔT
 */
export default function ThermalExpansionCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [alpha, setAlpha] = useState('');
  const [originalLength, setOriginalLength] = useState('');
  const [tempChange, setTempChange] = useState('');
  const [result, setResult] = useState<{ deltaL: number; finalLength: number; formula: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult(null);

    const a = parseFloat(alpha);
    const l0 = parseFloat(originalLength);
    const dt = parseFloat(tempChange);

    if (isNaN(a) || isNaN(l0) || isNaN(dt)) {
      setError('Please enter valid numeric values for all fields');
      return;
    }
    if (l0 <= 0) {
      setError('Original length must be positive');
      return;
    }

    const deltaL = a * l0 * dt;
    const finalLength = l0 + deltaL;
    const formula = `ΔL = α × L₀ × ΔT = ${a} × ${l0} × ${dt} = ${deltaL.toFixed(6)} m`;

    setResult({ deltaL, finalLength, formula });
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-alpha`} className="block text-sm font-medium text-gray-700 mb-1">Coefficient of linear expansion (α, per °C)</label>
        <input id={`${toolId}-alpha`} type="number" step="any" value={alpha} onChange={(e) => setAlpha(e.target.value)} placeholder="e.g., 0.000012 for steel" aria-label={`Expansion coefficient input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <label htmlFor={`${toolId}-length`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Original Length (m)</label>
        <input id={`${toolId}-length`} type="number" value={originalLength} onChange={(e) => setOriginalLength(e.target.value)} placeholder="Enter original length" aria-label={`Original length input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <label htmlFor={`${toolId}-temp`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Temperature Change (°C)</label>
        <input id={`${toolId}-temp`} type="number" value={tempChange} onChange={(e) => setTempChange(e.target.value)} placeholder="Enter temperature change" aria-label={`Temperature change input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </InputArea>

      <button onClick={calculate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-lg font-semibold text-gray-800">Change in Length: {result.deltaL.toFixed(6)} m</div>
            <div className="text-md text-gray-700">Final Length: {result.finalLength.toFixed(6)} m</div>
            <div className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200 font-mono">{result.formula}</div>
            <CopyToClipboard text={`ΔL = ${result.deltaL.toFixed(6)} m, Final Length = ${result.finalLength.toFixed(6)} m`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
