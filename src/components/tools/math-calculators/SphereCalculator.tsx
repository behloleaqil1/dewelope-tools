'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SphereCalculator - Calculate volume and surface area of a sphere from radius.
 * Volume = (4/3)πr³, Surface Area = 4πr²
 */
export default function SphereCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [radius, setRadius] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<{ volume: number; surfaceArea: number; diameter: number; circumference: number } | null>(null);

  const calculate = () => {
    setError(undefined);
    const r = parseFloat(radius);

    if (!radius.trim() || isNaN(r)) {
      setError('Please enter a valid number for radius');
      setResult(null);
      return;
    }

    if (r <= 0) {
      setError('Radius must be greater than zero');
      setResult(null);
      return;
    }

    const volume = (4 / 3) * Math.PI * Math.pow(r, 3);
    const surfaceArea = 4 * Math.PI * Math.pow(r, 2);
    const diameter = 2 * r;
    const circumference = 2 * Math.PI * r;

    setResult({ volume, surfaceArea, diameter, circumference });
  };

  const copyText = result
    ? `Sphere (radius = ${radius})\nVolume: ${result.volume.toFixed(6)}\nSurface Area: ${result.surfaceArea.toFixed(6)}\nDiameter: ${result.diameter.toFixed(6)}\nCircumference: ${result.circumference.toFixed(6)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">
          Radius
        </label>
        <input
          id={`${toolId}-radius`}
          type="text"
          inputMode="decimal"
          value={radius}
          onChange={(e) => {
            setRadius(e.target.value);
            if (error) setError(undefined);
          }}
          placeholder="e.g. 5"
          aria-label={`Radius input for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <button onClick={calculate} aria-label="Calculate sphere properties" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.volume.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Volume (units³)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{result.surfaceArea.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Surface Area (units²)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-purple-600">{result.diameter.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Diameter</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-orange-600">{result.circumference.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Circumference</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              V = (4/3)πr³ = (4/3) × π × {radius}³ = {result.volume.toFixed(4)}<br />
              A = 4πr² = 4 × π × {radius}² = {result.surfaceArea.toFixed(4)}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
