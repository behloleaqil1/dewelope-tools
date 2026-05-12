'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CubeCalculator - Calculate volume, surface area, and space diagonal of a cube.
 */
export default function CubeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [side, setSide] = useState('');
  const [result, setResult] = useState<{ volume: number; surface: number; diagonal: number } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult(null);
    const s = parseFloat(side);
    if (!side.trim() || isNaN(s) || s <= 0) { setError('Please enter a positive number'); return; }
    setResult({
      volume: s * s * s,
      surface: 6 * s * s,
      diagonal: s * Math.sqrt(3),
    });
  }

  const copyText = result ? `Side: ${side}\nVolume: ${result.volume}\nSurface Area: ${result.surface}\nSpace Diagonal: ${result.diagonal.toFixed(6)}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-side`} className="block text-sm font-medium text-gray-700 mb-1">Side Length for {toolName}</label>
        <input id={`${toolId}-side`} type="text" inputMode="decimal" value={side} onChange={(e) => setSide(e.target.value)} placeholder="Enter side length" aria-label="Cube side length" className="input-field" />
      </InputArea>

      <button onClick={calculate} aria-label="Calculate cube properties" className="btn-primary">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600">{result.volume.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Volume</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600">{result.surface.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Surface Area</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600">{result.diagonal.toFixed(6)}</div>
                <div className="text-xs text-gray-500">Space Diagonal</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
