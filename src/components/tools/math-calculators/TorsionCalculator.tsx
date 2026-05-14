'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TorsionCalculator - Calculates torsional shear stress using τ = T×r/J
 */
export default function TorsionCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [torque, setTorque] = useState('');
  const [radius, setRadius] = useState('');
  const [polarMoment, setPolarMoment] = useState('');
  const [shaftDiameter, setShaftDiameter] = useState('');
  const [useAutoJ, setUseAutoJ] = useState(false);
  const [result, setResult] = useState<{ shearStress: number; jValue: number; formula: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult(null);

    const T = parseFloat(torque);
    const r = parseFloat(radius);

    if (isNaN(T) || isNaN(r)) {
      setError('Please enter valid values for torque and radius');
      return;
    }

    let J: number;
    if (useAutoJ) {
      const d = parseFloat(shaftDiameter);
      if (isNaN(d) || d <= 0) { setError('Shaft diameter must be positive'); return; }
      J = (Math.PI * Math.pow(d, 4)) / 32;
    } else {
      J = parseFloat(polarMoment);
      if (isNaN(J) || J <= 0) { setError('Polar moment of inertia must be positive'); return; }
    }

    const shearStress = (T * r) / J;
    const formula = `τ = T×r/J = ${T} × ${r} / ${J.toExponential(4)} = ${shearStress.toFixed(4)} Pa`;

    setResult({ shearStress, jValue: J, formula });
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-torque`} className="block text-sm font-medium text-gray-700 mb-1">Applied Torque T (N·m)</label>
        <input id={`${toolId}-torque`} type="number" value={torque} onChange={(e) => setTorque(e.target.value)} placeholder="Enter torque" aria-label={`Torque input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Radial Distance r (m)</label>
        <input id={`${toolId}-radius`} type="number" step="any" value={radius} onChange={(e) => setRadius(e.target.value)} placeholder="Distance from center" aria-label={`Radius input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <div className="mt-3">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={useAutoJ} onChange={(e) => setUseAutoJ(e.target.checked)} aria-label={`Auto-calculate J for ${toolName}`} className="rounded" />
            Auto-calculate J from solid circular shaft diameter
          </label>
        </div>
        {useAutoJ ? (
          <><label htmlFor={`${toolId}-diameter`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Shaft Diameter (m)</label><input id={`${toolId}-diameter`} type="number" step="any" value={shaftDiameter} onChange={(e) => setShaftDiameter(e.target.value)} placeholder="Enter shaft diameter" aria-label={`Shaft diameter input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></>
        ) : (
          <><label htmlFor={`${toolId}-j`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Polar Moment of Inertia J (m⁴)</label><input id={`${toolId}-j`} type="number" step="any" value={polarMoment} onChange={(e) => setPolarMoment(e.target.value)} placeholder="Enter J value" aria-label={`Polar moment of inertia input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></>
        )}
      </InputArea>

      <button onClick={calculate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-lg font-semibold text-gray-800">Torsional Shear Stress: {result.shearStress.toFixed(4)} Pa</div>
            <div className="text-md text-gray-700">J = {result.jValue.toExponential(4)} m⁴</div>
            <div className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200 font-mono">{result.formula}</div>
            <CopyToClipboard text={`τ = ${result.shearStress.toFixed(4)} Pa`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
