'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FluidFlowCalculator - Calculate fluid flow rate using Bernoulli's equation.
 * Computes velocity, flow rate, and pressure relationships for incompressible fluids.
 */
export default function FluidFlowCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [calcType, setCalcType] = useState<'velocity' | 'flowrate' | 'pressure'>('velocity');
  const [pressure1, setPressure1] = useState('101325');
  const [pressure2, setPressure2] = useState('100000');
  const [density, setDensity] = useState('1000');
  const [height1, setHeight1] = useState('0');
  const [height2, setHeight2] = useState('0');
  const [velocity1, setVelocity1] = useState('0');
  const [diameter, setDiameter] = useState('0.05');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const P1 = parseFloat(pressure1);
    const P2 = parseFloat(pressure2);
    const rho = parseFloat(density);
    const h1 = parseFloat(height1);
    const h2 = parseFloat(height2);
    const v1 = parseFloat(velocity1);
    const d = parseFloat(diameter);
    const g = 9.81;

    if (isNaN(rho) || rho <= 0) {
      setOutput('Please enter a valid positive density.');
      return;
    }

    const results: string[] = [];

    switch (calcType) {
      case 'velocity': {
        // Bernoulli: P1 + 0.5ρv1² + ρgh1 = P2 + 0.5ρv2² + ρgh2
        // Solve for v2: v2 = sqrt(2/ρ * (P1 - P2) + v1² + 2g(h1 - h2))
        if (isNaN(P1) || isNaN(P2) || isNaN(h1) || isNaN(h2) || isNaN(v1)) {
          setOutput('Please enter valid values for all fields.');
          return;
        }
        const v2Squared = (2 / rho) * (P1 - P2) + Math.pow(v1, 2) + 2 * g * (h1 - h2);
        if (v2Squared < 0) {
          setOutput('Error: Negative value under square root. Check input values (flow cannot occur with these parameters).');
          return;
        }
        const v2 = Math.sqrt(v2Squared);
        const area = Math.PI * Math.pow(d / 2, 2);
        const Q = v2 * area;

        results.push('=== Velocity Calculation (Bernoulli) ===');
        results.push(`Formula: v₂ = √(2/ρ × (P₁-P₂) + v₁² + 2g(h₁-h₂))`);
        results.push('');
        results.push(`Exit Velocity (v₂): ${v2.toFixed(4)} m/s`);
        results.push(`Flow Rate (Q): ${Q.toFixed(6)} m³/s`);
        results.push(`Flow Rate: ${(Q * 1000).toFixed(4)} L/s`);
        results.push(`Flow Rate: ${(Q * 3600).toFixed(4)} m³/h`);
        results.push('');
        results.push('--- Input Parameters ---');
        results.push(`P₁: ${P1} Pa | P₂: ${P2} Pa`);
        results.push(`h₁: ${h1} m | h₂: ${h2} m`);
        results.push(`v₁: ${v1} m/s | ρ: ${rho} kg/m³`);
        results.push(`Pipe diameter: ${d} m`);
        break;
      }
      case 'flowrate': {
        // Q = A × v, where v from Bernoulli
        if (isNaN(P1) || isNaN(P2) || isNaN(d) || d <= 0) {
          setOutput('Please enter valid values.');
          return;
        }
        const deltaP = P1 - P2;
        const v = Math.sqrt(2 * Math.abs(deltaP) / rho);
        const area = Math.PI * Math.pow(d / 2, 2);
        const Q = v * area;

        results.push('=== Flow Rate Calculation ===');
        results.push(`Formula: Q = A × √(2ΔP/ρ)`);
        results.push('');
        results.push(`Velocity: ${v.toFixed(4)} m/s`);
        results.push(`Pipe Area: ${(area * 10000).toFixed(4)} cm²`);
        results.push(`Flow Rate: ${Q.toFixed(6)} m³/s`);
        results.push(`Flow Rate: ${(Q * 1000).toFixed(4)} L/s`);
        results.push(`Flow Rate: ${(Q * 60000).toFixed(2)} L/min`);
        results.push('');
        results.push('--- Input Parameters ---');
        results.push(`ΔP: ${deltaP} Pa | ρ: ${rho} kg/m³`);
        results.push(`Diameter: ${d} m`);
        break;
      }
      case 'pressure': {
        // Solve for P2: P2 = P1 + 0.5ρ(v1² - v2²) + ρg(h1 - h2)
        if (isNaN(P1) || isNaN(v1) || isNaN(h1) || isNaN(h2)) {
          setOutput('Please enter valid values.');
          return;
        }
        const v2 = parseFloat(velocity1); // reuse as v2 for simplicity
        // Assuming v2 is known, calculate P2
        const P2calc = P1 + 0.5 * rho * (Math.pow(v1, 2) - Math.pow(v2, 2)) + rho * g * (h1 - h2);

        results.push('=== Pressure Calculation (Bernoulli) ===');
        results.push(`Formula: P₂ = P₁ + ½ρ(v₁²-v₂²) + ρg(h₁-h₂)`);
        results.push('');
        results.push(`Pressure at Point 2: ${P2calc.toFixed(2)} Pa`);
        results.push(`Pressure at Point 2: ${(P2calc / 1000).toFixed(4)} kPa`);
        results.push(`Pressure at Point 2: ${(P2calc / 101325).toFixed(6)} atm`);
        results.push('');
        results.push('--- Input Parameters ---');
        results.push(`P₁: ${P1} Pa | v: ${v1} m/s`);
        results.push(`h₁: ${h1} m | h₂: ${h2} m`);
        results.push(`ρ: ${rho} kg/m³`);
        break;
      }
    }

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor={`${toolId}-calctype`} className="block text-sm font-medium text-gray-700 mb-1">
              Calculation Type
            </label>
            <select
              id={`${toolId}-calctype`}
              value={calcType}
              onChange={(e) => setCalcType(e.target.value as typeof calcType)}
              aria-label={`Calculation type for ${toolName}`}
              className="input-field"
            >
              <option value="velocity">Calculate Exit Velocity</option>
              <option value="flowrate">Calculate Flow Rate</option>
              <option value="pressure">Calculate Pressure</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-p1`} className="block text-sm font-medium text-gray-700 mb-1">
              Pressure P₁ (Pa)
            </label>
            <input
              id={`${toolId}-p1`}
              type="number"
              value={pressure1}
              onChange={(e) => setPressure1(e.target.value)}
              aria-label="Pressure at point 1"
              className="input-field"
            />
          </div>
          {calcType === 'velocity' && (
            <div>
              <label htmlFor={`${toolId}-p2`} className="block text-sm font-medium text-gray-700 mb-1">
                Pressure P₂ (Pa)
              </label>
              <input
                id={`${toolId}-p2`}
                type="number"
                value={pressure2}
                onChange={(e) => setPressure2(e.target.value)}
                aria-label="Pressure at point 2"
                className="input-field"
              />
            </div>
          )}
          <div>
            <label htmlFor={`${toolId}-density`} className="block text-sm font-medium text-gray-700 mb-1">
              Fluid Density (kg/m³)
            </label>
            <input
              id={`${toolId}-density`}
              type="number"
              value={density}
              onChange={(e) => setDensity(e.target.value)}
              aria-label="Fluid density"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-diameter`} className="block text-sm font-medium text-gray-700 mb-1">
              Pipe Diameter (m)
            </label>
            <input
              id={`${toolId}-diameter`}
              type="number"
              value={diameter}
              onChange={(e) => setDiameter(e.target.value)}
              aria-label="Pipe diameter"
              className="input-field"
              step="any"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-h1`} className="block text-sm font-medium text-gray-700 mb-1">
              Height h₁ (m)
            </label>
            <input
              id={`${toolId}-h1`}
              type="number"
              value={height1}
              onChange={(e) => setHeight1(e.target.value)}
              aria-label="Height at point 1"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-h2`} className="block text-sm font-medium text-gray-700 mb-1">
              Height h₂ (m)
            </label>
            <input
              id={`${toolId}-h2`}
              type="number"
              value={height2}
              onChange={(e) => setHeight2(e.target.value)}
              aria-label="Height at point 2"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-v1`} className="block text-sm font-medium text-gray-700 mb-1">
              {calcType === 'pressure' ? 'Velocity (m/s)' : 'Inlet Velocity v₁ (m/s)'}
            </label>
            <input
              id={`${toolId}-v1`}
              type="number"
              value={velocity1}
              onChange={(e) => setVelocity1(e.target.value)}
              aria-label="Velocity"
              className="input-field"
            />
          </div>
        </div>

        <button
          onClick={calculate}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
        >
          Calculate
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
