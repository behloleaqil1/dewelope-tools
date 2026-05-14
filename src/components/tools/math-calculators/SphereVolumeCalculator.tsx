'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SphereVolumeCalculator - Calculate sphere volume using V = (4/3)πr³.
 */
export default function SphereVolumeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [radius, setRadius] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ volume: number; surfaceArea: number; formula: string } | null>(null);

  const calculate = () => {
    setError('');
    setResult(null);
    const r = parseFloat(radius);
    if (isNaN(r) || r <= 0) {
      setError('Please enter a valid positive radius.');
      return;
    }
    const volume = (4 / 3) * Math.PI * r * r * r;
    const surfaceArea = 4 * Math.PI * r * r;
    setResult({
      volume,
      surfaceArea,
      formula: `V = (4/3)πr³ = (4/3) × π × ${r}³ = ${volume.toFixed(6)}\nSA = 4πr² = 4 × π × ${r}² = ${surfaceArea.toFixed(6)}`,
    });
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">Radius</label>
        <input id={`${toolId}-radius`} type="text" inputMode="decimal" value={radius} onChange={(e) => setRadius(e.target.value)} placeholder="e.g. 5" aria-label={`Radius for ${toolName}`} className="input-field" />
      </InputArea>

      <button onClick={calculate} className="btn-primary" aria-label="Calculate sphere volume">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-sm text-gray-500">Volume</div>
                <div className="text-xl font-bold text-blue-600">{result.volume.toFixed(6)}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-sm text-gray-500">Surface Area</div>
                <div className="text-xl font-bold text-blue-600">{result.surfaceArea.toFixed(6)}</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono whitespace-pre-wrap">{result.formula}</div>
            <CopyToClipboard text={`Volume: ${result.volume.toFixed(6)}\nSurface Area: ${result.surfaceArea.toFixed(6)}\n${result.formula}`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
