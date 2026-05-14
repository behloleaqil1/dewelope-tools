'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * KineticEnergyCalculator - Calculates kinetic energy (KE = ½mv²).
 */
export default function KineticEnergyCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mass, setMass] = useState('');
  const [velocity, setVelocity] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<{ joules: number; kj: number; calories: number; kwh: number; evs: number } | null>(null);

  const calculate = () => {
    setError(undefined);
    setResult(null);
    const m = parseFloat(mass);
    const v = parseFloat(velocity);

    if (isNaN(m) || m <= 0) { setError('Enter a valid mass greater than 0'); return; }
    if (isNaN(v)) { setError('Enter a valid velocity'); return; }

    const joules = 0.5 * m * v * v;
    setResult({
      joules,
      kj: joules / 1000,
      calories: joules / 4.184,
      kwh: joules / 3600000,
      evs: joules / 1.602e-19,
    });
  };

  const copyText = result ? `Mass: ${mass} kg\nVelocity: ${velocity} m/s\nKinetic Energy: ${result.joules.toFixed(4)} J\nKinetic Energy: ${result.kj.toFixed(6)} kJ\nCalories: ${result.calories.toFixed(4)} cal\nkWh: ${result.kwh.toExponential(4)}\n\nFormula: KE = ½mv²` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-mass`} className="block text-sm font-medium text-gray-700 mb-1">Mass (kg)</label>
            <input id={`${toolId}-mass`} type="number" value={mass} onChange={(e) => setMass(e.target.value)} placeholder="5" aria-label={`Mass input for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-velocity`} className="block text-sm font-medium text-gray-700 mb-1">Velocity (m/s)</label>
            <input id={`${toolId}-velocity`} type="number" value={velocity} onChange={(e) => setVelocity(e.target.value)} placeholder="10" aria-label="Velocity input" className="input-field" />
          </div>
        </div>
      </InputArea>
      <button onClick={calculate} aria-label="Calculate kinetic energy" className="btn-primary">Calculate</button>
      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 text-center">
              <div className="text-xs text-gray-500 mb-1">KE = ½mv²</div>
              <div className="text-2xl font-bold text-orange-700">{result.joules.toFixed(4)} J</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.kj.toFixed(6)}</div>
                <div className="text-xs text-gray-500">Kilojoules (kJ)</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.calories.toFixed(4)}</div>
                <div className="text-xs text-gray-500">Calories</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.kwh.toExponential(4)}</div>
                <div className="text-xs text-gray-500">kWh</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.evs.toExponential(4)}</div>
                <div className="text-xs text-gray-500">eV</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
