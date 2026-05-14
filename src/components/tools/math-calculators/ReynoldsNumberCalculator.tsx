'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ReynoldsNumberCalculator - Calculates Reynolds number using Re = ρvD/μ
 */
export default function ReynoldsNumberCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [density, setDensity] = useState('');
  const [velocity, setVelocity] = useState('');
  const [diameter, setDiameter] = useState('');
  const [viscosity, setViscosity] = useState('');
  const [result, setResult] = useState<{ re: number; flowType: string; formula: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult(null);

    const rho = parseFloat(density);
    const v = parseFloat(velocity);
    const d = parseFloat(diameter);
    const mu = parseFloat(viscosity);

    if (isNaN(rho) || isNaN(v) || isNaN(d) || isNaN(mu)) {
      setError('Please enter valid numeric values for all fields');
      return;
    }
    if (mu <= 0) {
      setError('Dynamic viscosity must be positive');
      return;
    }

    const re = (rho * v * d) / mu;
    let flowType = 'Laminar';
    if (re > 4000) flowType = 'Turbulent';
    else if (re > 2300) flowType = 'Transitional';

    const formula = `Re = ρvD/μ = (${rho} × ${v} × ${d}) / ${mu} = ${re.toFixed(2)}`;

    setResult({ re, flowType, formula });
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-density`} className="block text-sm font-medium text-gray-700 mb-1">Fluid Density (kg/m³)</label>
        <input id={`${toolId}-density`} type="number" value={density} onChange={(e) => setDensity(e.target.value)} placeholder="e.g., 1000 for water" aria-label={`Fluid density input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <label htmlFor={`${toolId}-velocity`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Flow Velocity (m/s)</label>
        <input id={`${toolId}-velocity`} type="number" value={velocity} onChange={(e) => setVelocity(e.target.value)} placeholder="Enter flow velocity" aria-label={`Flow velocity input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <label htmlFor={`${toolId}-diameter`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Characteristic Length / Diameter (m)</label>
        <input id={`${toolId}-diameter`} type="number" value={diameter} onChange={(e) => setDiameter(e.target.value)} placeholder="Enter pipe diameter" aria-label={`Diameter input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <label htmlFor={`${toolId}-viscosity`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Dynamic Viscosity (Pa·s)</label>
        <input id={`${toolId}-viscosity`} type="number" step="any" value={viscosity} onChange={(e) => setViscosity(e.target.value)} placeholder="e.g., 0.001 for water" aria-label={`Dynamic viscosity input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </InputArea>

      <button onClick={calculate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-lg font-semibold text-gray-800">Reynolds Number: {result.re.toFixed(2)}</div>
            <div className="text-md text-gray-700">Flow Regime: <span className={result.flowType === 'Laminar' ? 'text-green-600' : result.flowType === 'Turbulent' ? 'text-red-600' : 'text-yellow-600'}>{result.flowType}</span></div>
            <div className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200 font-mono">{result.formula}</div>
            <CopyToClipboard text={`Re = ${result.re.toFixed(2)} (${result.flowType})`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
