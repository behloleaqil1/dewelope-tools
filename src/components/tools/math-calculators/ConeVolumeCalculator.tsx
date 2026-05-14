'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ConeVolumeCalculator - Calculate cone volume using V = (1/3)πr²h.
 */
export default function ConeVolumeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [radius, setRadius] = useState('');
  const [height, setHeight] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ volume: number; slantHeight: number; lateralArea: number; formula: string } | null>(null);

  const calculate = () => {
    setError('');
    setResult(null);
    const r = parseFloat(radius);
    const h = parseFloat(height);
    if (isNaN(r) || isNaN(h) || r <= 0 || h <= 0) {
      setError('Please enter valid positive numbers for radius and height.');
      return;
    }
    const volume = (1 / 3) * Math.PI * r * r * h;
    const slantHeight = Math.sqrt(r * r + h * h);
    const lateralArea = Math.PI * r * slantHeight;
    setResult({
      volume,
      slantHeight,
      lateralArea,
      formula: `V = (1/3)πr²h = (1/3) × π × ${r}² × ${h} = ${volume.toFixed(6)}\nSlant height = √(r² + h²) = √(${r}² + ${h}²) = ${slantHeight.toFixed(6)}\nLateral area = πrl = π × ${r} × ${slantHeight.toFixed(4)} = ${lateralArea.toFixed(6)}`,
    });
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">Radius</label>
            <input id={`${toolId}-radius`} type="text" inputMode="decimal" value={radius} onChange={(e) => setRadius(e.target.value)} placeholder="e.g. 3" aria-label={`Radius for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">Height</label>
            <input id={`${toolId}-height`} type="text" inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g. 7" aria-label={`Height for ${toolName}`} className="input-field" />
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} className="btn-primary" aria-label="Calculate cone volume">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xs text-gray-500">Volume</div>
                <div className="text-lg font-bold text-blue-600">{result.volume.toFixed(4)}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xs text-gray-500">Slant Height</div>
                <div className="text-lg font-bold text-blue-600">{result.slantHeight.toFixed(4)}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xs text-gray-500">Lateral Area</div>
                <div className="text-lg font-bold text-blue-600">{result.lateralArea.toFixed(4)}</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono whitespace-pre-wrap">{result.formula}</div>
            <CopyToClipboard text={`Volume: ${result.volume.toFixed(6)}\nSlant Height: ${result.slantHeight.toFixed(6)}\nLateral Area: ${result.lateralArea.toFixed(6)}`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
