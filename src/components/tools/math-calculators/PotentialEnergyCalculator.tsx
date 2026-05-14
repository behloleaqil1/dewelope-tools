'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PotentialEnergyCalculator - Calculates gravitational potential energy (PE = mgh).
 */
export default function PotentialEnergyCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mass, setMass] = useState('');
  const [height, setHeight] = useState('');
  const [gravity, setGravity] = useState('9.81');
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<{ joules: number; kj: number; calories: number; ftLbf: number } | null>(null);

  const calculate = () => {
    setError(undefined);
    setResult(null);
    const m = parseFloat(mass);
    const h = parseFloat(height);
    const g = parseFloat(gravity);

    if (isNaN(m) || m <= 0) { setError('Enter a valid mass greater than 0'); return; }
    if (isNaN(h)) { setError('Enter a valid height'); return; }
    if (isNaN(g) || g <= 0) { setError('Enter a valid gravitational acceleration'); return; }

    const joules = m * g * h;
    setResult({
      joules,
      kj: joules / 1000,
      calories: joules / 4.184,
      ftLbf: joules * 0.737562,
    });
  };

  const copyText = result ? `Mass: ${mass} kg\nHeight: ${height} m\nGravity: ${gravity} m/s²\nPotential Energy: ${result.joules.toFixed(4)} J\nPotential Energy: ${result.kj.toFixed(6)} kJ\nCalories: ${result.calories.toFixed(4)} cal\nFoot-pounds: ${result.ftLbf.toFixed(4)} ft·lbf\n\nFormula: PE = mgh` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor={`${toolId}-mass`} className="block text-sm font-medium text-gray-700 mb-1">Mass (kg)</label>
            <input id={`${toolId}-mass`} type="number" value={mass} onChange={(e) => setMass(e.target.value)} placeholder="10" aria-label={`Mass input for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">Height (m)</label>
            <input id={`${toolId}-height`} type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="5" aria-label="Height input" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-gravity`} className="block text-sm font-medium text-gray-700 mb-1">Gravity (m/s²)</label>
            <input id={`${toolId}-gravity`} type="number" value={gravity} onChange={(e) => setGravity(e.target.value)} placeholder="9.81" aria-label="Gravitational acceleration" className="input-field" />
          </div>
        </div>
      </InputArea>
      <button onClick={calculate} aria-label="Calculate potential energy" className="btn-primary">Calculate</button>
      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center">
              <div className="text-xs text-gray-500 mb-1">PE = m × g × h</div>
              <div className="text-2xl font-bold text-green-700">{result.joules.toFixed(4)} J</div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.kj.toFixed(6)}</div>
                <div className="text-xs text-gray-500">kJ</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.calories.toFixed(4)}</div>
                <div className="text-xs text-gray-500">Calories</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.ftLbf.toFixed(4)}</div>
                <div className="text-xs text-gray-500">ft·lbf</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
