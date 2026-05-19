'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ArcLengthCalculator - Calculate arc length from radius and central angle.
 */
export default function ArcLengthCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [radius, setRadius] = useState('');
  const [angle, setAngle] = useState('');
  const [angleUnit, setAngleUnit] = useState<'degrees' | 'radians'>('degrees');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ arcLength: number; sectorArea: number; chordLength: number; formula: string } | null>(null);

  const calculate = () => {
    setError('');
    setResult(null);
    const r = parseFloat(radius);
    const a = parseFloat(angle);
    if (isNaN(r) || r <= 0) { setError('Please enter a valid positive radius.'); return; }
    if (isNaN(a) || a <= 0) { setError('Please enter a valid positive angle.'); return; }

    const rad = angleUnit === 'degrees' ? (a * Math.PI) / 180 : a;
    if (angleUnit === 'degrees' && a > 360) { setError('Angle cannot exceed 360°.'); return; }
    if (angleUnit === 'radians' && a > 2 * Math.PI) { setError('Angle cannot exceed 2π radians.'); return; }

    const arcLength = r * rad;
    const sectorArea = 0.5 * r * r * rad;
    const chordLength = 2 * r * Math.sin(rad / 2);

    setResult({
      arcLength,
      sectorArea,
      chordLength,
      formula: `Arc Length = r × θ = ${r} × ${rad.toFixed(6)} = ${arcLength.toFixed(6)}\nSector Area = ½r²θ = ½ × ${r}² × ${rad.toFixed(6)} = ${sectorArea.toFixed(6)}\nChord = 2r·sin(θ/2) = 2 × ${r} × sin(${(rad / 2).toFixed(6)}) = ${chordLength.toFixed(6)}`,
    });
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">Radius</label>
            <input id={`${toolId}-radius`} type="text" inputMode="decimal" value={radius} onChange={(e) => setRadius(e.target.value)} placeholder="e.g. 10" aria-label={`Radius for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-angle`} className="block text-sm font-medium text-gray-700 mb-1">Central Angle</label>
            <input id={`${toolId}-angle`} type="text" inputMode="decimal" value={angle} onChange={(e) => setAngle(e.target.value)} placeholder="e.g. 90" aria-label={`Central angle for ${toolName}`} className="input-field" />
          </div>
        </div>
        <div className="mt-3">
          <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">Angle Unit</label>
          <select id={`${toolId}-unit`} value={angleUnit} onChange={(e) => setAngleUnit(e.target.value as 'degrees' | 'radians')} aria-label="Angle unit" className="input-field">
            <option value="degrees">Degrees</option>
            <option value="radians">Radians</option>
          </select>
        </div>
      </InputArea>

      <button onClick={calculate} className="btn-primary" aria-label="Calculate arc length">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xs text-gray-500">Arc Length</div>
                <div className="text-lg font-bold text-blue-600">{result.arcLength.toFixed(4)}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xs text-gray-500">Sector Area</div>
                <div className="text-lg font-bold text-blue-600">{result.sectorArea.toFixed(4)}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xs text-gray-500">Chord Length</div>
                <div className="text-lg font-bold text-blue-600">{result.chordLength.toFixed(4)}</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono whitespace-pre-wrap">{result.formula}</div>
            <CopyToClipboard text={`Arc Length: ${result.arcLength.toFixed(6)}\nSector Area: ${result.sectorArea.toFixed(6)}\nChord Length: ${result.chordLength.toFixed(6)}`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
