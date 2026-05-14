'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HeatTransferCalculator - Calculates heat transfer using Q = mcΔT
 */
export default function HeatTransferCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mass, setMass] = useState('');
  const [specificHeat, setSpecificHeat] = useState('');
  const [tempChange, setTempChange] = useState('');
  const [result, setResult] = useState<{ heat: number; formula: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult(null);

    const m = parseFloat(mass);
    const c = parseFloat(specificHeat);
    const dt = parseFloat(tempChange);

    if (isNaN(m) || isNaN(c) || isNaN(dt)) {
      setError('Please enter valid numeric values for all fields');
      return;
    }
    if (m <= 0) {
      setError('Mass must be positive');
      return;
    }
    if (c <= 0) {
      setError('Specific heat capacity must be positive');
      return;
    }

    const heat = m * c * dt;
    const formula = `Q = mcΔT = ${m} × ${c} × ${dt} = ${heat.toFixed(2)} J`;

    setResult({ heat, formula });
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-mass`} className="block text-sm font-medium text-gray-700 mb-1">Mass (kg)</label>
        <input id={`${toolId}-mass`} type="number" value={mass} onChange={(e) => setMass(e.target.value)} placeholder="Enter mass in kg" aria-label={`Mass input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <label htmlFor={`${toolId}-heat`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Specific Heat Capacity (J/kg·°C)</label>
        <input id={`${toolId}-heat`} type="number" value={specificHeat} onChange={(e) => setSpecificHeat(e.target.value)} placeholder="e.g., 4186 for water" aria-label={`Specific heat capacity input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <label htmlFor={`${toolId}-temp`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Temperature Change (°C)</label>
        <input id={`${toolId}-temp`} type="number" value={tempChange} onChange={(e) => setTempChange(e.target.value)} placeholder="Enter temperature change" aria-label={`Temperature change input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </InputArea>

      <button onClick={calculate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-lg font-semibold text-gray-800">Heat Transfer: {result.heat.toFixed(2)} J</div>
            <div className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200 font-mono">{result.formula}</div>
            <CopyToClipboard text={`${result.heat.toFixed(2)} J`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
