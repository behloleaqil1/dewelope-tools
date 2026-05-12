'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BeamDeflectionCalculator - Calculate beam deflection for simply supported beams.
 * Supports point load at center, uniform distributed load, and point load at any position.
 */
export default function BeamDeflectionCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [loadType, setLoadType] = useState<'center' | 'uniform' | 'point'>('center');
  const [load, setLoad] = useState('1000');
  const [length, setLength] = useState('5');
  const [elasticity, setElasticity] = useState('200');
  const [momentOfInertia, setMomentOfInertia] = useState('0.0001');
  const [loadPosition, setLoadPosition] = useState('2.5');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const P = parseFloat(load);
    const L = parseFloat(length);
    const E = parseFloat(elasticity) * 1e9; // GPa to Pa
    const I = parseFloat(momentOfInertia); // m^4
    const a = parseFloat(loadPosition);

    if (isNaN(P) || isNaN(L) || isNaN(E) || isNaN(I) || L <= 0 || E <= 0 || I <= 0) {
      setOutput('Please enter valid positive values for all fields.');
      return;
    }

    let maxDeflection: number;
    let formula: string;
    let location: string;

    switch (loadType) {
      case 'center':
        // δ_max = PL³ / (48EI) at center
        maxDeflection = (P * Math.pow(L, 3)) / (48 * E * I);
        formula = 'δ_max = PL³ / (48EI)';
        location = 'at center (L/2)';
        break;
      case 'uniform':
        // δ_max = 5wL⁴ / (384EI) at center
        maxDeflection = (5 * P * Math.pow(L, 4)) / (384 * E * I);
        formula = 'δ_max = 5wL⁴ / (384EI)';
        location = 'at center (L/2)';
        break;
      case 'point':
        // Point load at distance a from left support
        const b = L - a;
        if (a <= 0 || a >= L) {
          setOutput('Load position must be between 0 and beam length.');
          return;
        }
        // δ_max at x = sqrt((L²-b²)/3) when a > b
        // Deflection at load point: δ = Pa²b² / (3EIL)
        maxDeflection = (P * Math.pow(a, 2) * Math.pow(b, 2)) / (3 * E * I * L);
        formula = 'δ = Pa²b² / (3EIL)';
        location = `at load point (a=${a}m, b=${b.toFixed(3)}m)`;
        break;
      default:
        return;
    }

    const deflectionMm = maxDeflection * 1000;
    const results = [
      `Load Type: ${loadType === 'center' ? 'Point Load at Center' : loadType === 'uniform' ? 'Uniform Distributed Load' : 'Point Load at Position'}`,
      `Formula: ${formula}`,
      ``,
      `Maximum Deflection: ${maxDeflection.toExponential(4)} m`,
      `Maximum Deflection: ${deflectionMm.toFixed(4)} mm`,
      `Location: ${location}`,
      ``,
      `--- Input Parameters ---`,
      `Load (${loadType === 'uniform' ? 'w' : 'P'}): ${P} ${loadType === 'uniform' ? 'N/m' : 'N'}`,
      `Beam Length (L): ${L} m`,
      `Elastic Modulus (E): ${elasticity} GPa`,
      `Moment of Inertia (I): ${I} m⁴`,
    ];

    if (loadType === 'point') {
      results.push(`Load Position (a): ${a} m`);
    }

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-loadtype`} className="block text-sm font-medium text-gray-700 mb-1">
              Load Type
            </label>
            <select
              id={`${toolId}-loadtype`}
              value={loadType}
              onChange={(e) => setLoadType(e.target.value as typeof loadType)}
              aria-label={`Load type for ${toolName}`}
              className="input-field"
            >
              <option value="center">Point Load at Center</option>
              <option value="uniform">Uniform Distributed Load</option>
              <option value="point">Point Load at Position</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-load`} className="block text-sm font-medium text-gray-700 mb-1">
              {loadType === 'uniform' ? 'Load (N/m)' : 'Load (N)'}
            </label>
            <input
              id={`${toolId}-load`}
              type="number"
              value={load}
              onChange={(e) => setLoad(e.target.value)}
              placeholder="Enter load"
              aria-label="Load value"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-length`} className="block text-sm font-medium text-gray-700 mb-1">
              Beam Length (m)
            </label>
            <input
              id={`${toolId}-length`}
              type="number"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              placeholder="Enter beam length"
              aria-label="Beam length"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-elasticity`} className="block text-sm font-medium text-gray-700 mb-1">
              Elastic Modulus (GPa)
            </label>
            <input
              id={`${toolId}-elasticity`}
              type="number"
              value={elasticity}
              onChange={(e) => setElasticity(e.target.value)}
              placeholder="e.g., 200 for steel"
              aria-label="Elastic modulus"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-inertia`} className="block text-sm font-medium text-gray-700 mb-1">
              Moment of Inertia (m⁴)
            </label>
            <input
              id={`${toolId}-inertia`}
              type="number"
              value={momentOfInertia}
              onChange={(e) => setMomentOfInertia(e.target.value)}
              placeholder="e.g., 0.0001"
              aria-label="Moment of inertia"
              className="input-field"
              step="any"
            />
          </div>
          {loadType === 'point' && (
            <div>
              <label htmlFor={`${toolId}-position`} className="block text-sm font-medium text-gray-700 mb-1">
                Load Position from Left (m)
              </label>
              <input
                id={`${toolId}-position`}
                type="number"
                value={loadPosition}
                onChange={(e) => setLoadPosition(e.target.value)}
                placeholder="Distance from left support"
                aria-label="Load position"
                className="input-field"
              />
            </div>
          )}
        </div>

        <button
          onClick={calculate}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
        >
          Calculate Deflection
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
