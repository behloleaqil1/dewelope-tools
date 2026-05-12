'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BuoyancyCalculator - Calculate buoyant force using Archimedes' principle.
 * F_b = ρ_fluid × V_displaced × g
 */
export default function BuoyancyCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [fluidDensity, setFluidDensity] = useState('1000');
  const [volume, setVolume] = useState('0.5');
  const [objectMass, setObjectMass] = useState('400');
  const [gravity, setGravity] = useState('9.81');
  const [volumeUnit, setVolumeUnit] = useState<'m3' | 'L' | 'cm3'>('m3');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const rho = parseFloat(fluidDensity);
    let vol = parseFloat(volume);
    const mass = parseFloat(objectMass);
    const g = parseFloat(gravity);

    if (isNaN(rho) || isNaN(vol) || isNaN(g)) {
      setOutput('Please enter valid numbers for density, volume, and gravity.');
      return;
    }

    // Convert volume to m³
    if (volumeUnit === 'L') vol = vol / 1000;
    else if (volumeUnit === 'cm3') vol = vol / 1e6;

    const buoyantForce = rho * vol * g;
    const weightOfFluid = rho * vol * g;

    const results = [
      `═══ Input Parameters ═══`,
      `Fluid Density (ρ): ${rho} kg/m³`,
      `Displaced Volume (V): ${volume} ${volumeUnit === 'm3' ? 'm³' : volumeUnit === 'L' ? 'L' : 'cm³'} (${vol.toExponential(4)} m³)`,
      `Gravity (g): ${g} m/s²`,
      ``,
      `═══ Buoyant Force (Archimedes' Principle) ═══`,
      `F_b = ρ × V × g`,
      `F_b = ${rho} × ${vol.toExponential(4)} × ${g}`,
      `F_b = ${buoyantForce.toFixed(4)} N`,
      `F_b = ${(buoyantForce / 1000).toFixed(6)} kN`,
      ``,
      `Weight of Displaced Fluid: ${weightOfFluid.toFixed(4)} N (${(weightOfFluid / g).toFixed(4)} kg)`,
    ];

    if (!isNaN(mass) && mass > 0) {
      const objectWeight = mass * g;
      const netForce = buoyantForce - objectWeight;
      const willFloat = buoyantForce >= objectWeight;
      results.push(``);
      results.push(`═══ Object Analysis ═══`);
      results.push(`Object Mass: ${mass} kg`);
      results.push(`Object Weight: ${objectWeight.toFixed(4)} N`);
      results.push(`Net Force: ${netForce.toFixed(4)} N (${netForce >= 0 ? 'upward' : 'downward'})`);
      results.push(`Object will: ${willFloat ? '✓ FLOAT' : '✗ SINK'}`);
      if (willFloat) {
        const submergedFraction = (mass / (rho * vol)) * 100;
        results.push(`Submerged fraction: ${Math.min(100, submergedFraction).toFixed(1)}%`);
      }
    }

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-density`} className="block text-sm font-medium text-gray-700 mb-1">Fluid Density (kg/m³)</label>
            <input id={`${toolId}-density`} type="number" value={fluidDensity} onChange={(e) => setFluidDensity(e.target.value)} className="input-field" aria-label={`Fluid density for ${toolName}`} />
            <p className="text-xs text-gray-500 mt-1">Water ≈ 1000, Seawater ≈ 1025, Mercury ≈ 13600</p>
          </div>
          <div>
            <label htmlFor={`${toolId}-gravity`} className="block text-sm font-medium text-gray-700 mb-1">Gravity (m/s²)</label>
            <input id={`${toolId}-gravity`} type="number" value={gravity} onChange={(e) => setGravity(e.target.value)} className="input-field" aria-label="Gravitational acceleration" />
          </div>
          <div>
            <label htmlFor={`${toolId}-volume`} className="block text-sm font-medium text-gray-700 mb-1">Displaced Volume</label>
            <div className="flex gap-2">
              <input id={`${toolId}-volume`} type="number" value={volume} onChange={(e) => setVolume(e.target.value)} className="input-field flex-1" aria-label="Displaced volume" />
              <select value={volumeUnit} onChange={(e) => setVolumeUnit(e.target.value as 'm3' | 'L' | 'cm3')} className="input-field w-24" aria-label="Volume unit">
                <option value="m3">m³</option>
                <option value="L">L</option>
                <option value="cm3">cm³</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-mass`} className="block text-sm font-medium text-gray-700 mb-1">Object Mass (kg, optional)</label>
            <input id={`${toolId}-mass`} type="number" value={objectMass} onChange={(e) => setObjectMass(e.target.value)} className="input-field" aria-label="Object mass" />
            <p className="text-xs text-gray-500 mt-1">For float/sink analysis</p>
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Buoyant Force</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
