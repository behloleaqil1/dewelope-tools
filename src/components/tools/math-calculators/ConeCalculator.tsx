'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ConeCalculator - Calculate volume, surface area, and slant height of a cone.
 * Volume = (1/3)πr²h, Lateral Area = πrl, Total Area = πr(r + l), Slant = √(r² + h²)
 */
export default function ConeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [radius, setRadius] = useState('');
  const [height, setHeight] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ volume: number; lateralArea: number; totalArea: number; slantHeight: number } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const r = parseFloat(radius);
    const h = parseFloat(height);

    if (!radius.trim() || isNaN(r) || r <= 0) {
      newErrors.radius = 'Please enter a valid positive number for radius';
    }
    if (!height.trim() || isNaN(h) || h <= 0) {
      newErrors.height = 'Please enter a valid positive number for height';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    const slantHeight = Math.sqrt(r * r + h * h);
    const volume = (1 / 3) * Math.PI * r * r * h;
    const lateralArea = Math.PI * r * slantHeight;
    const totalArea = Math.PI * r * (r + slantHeight);

    setResult({ volume, lateralArea, totalArea, slantHeight });
  };

  const copyText = result
    ? `Cone (radius = ${radius}, height = ${height})\nVolume: ${result.volume.toFixed(6)}\nLateral Surface Area: ${result.lateralArea.toFixed(6)}\nTotal Surface Area: ${result.totalArea.toFixed(6)}\nSlant Height: ${result.slantHeight.toFixed(6)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={errors.radius}>
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
              if (errors.radius) setErrors((prev) => ({ ...prev, radius: '' }));
            }}
            placeholder="e.g. 5"
            aria-label={`Radius input for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.height}>
          <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">
            Height
          </label>
          <input
            id={`${toolId}-height`}
            type="text"
            inputMode="decimal"
            value={height}
            onChange={(e) => {
              setHeight(e.target.value);
              if (errors.height) setErrors((prev) => ({ ...prev, height: '' }));
            }}
            placeholder="e.g. 10"
            aria-label={`Height input for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate cone properties" className="btn-primary">
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
                <div className="text-2xl font-bold text-green-600">{result.totalArea.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Total Surface Area (units²)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-purple-600">{result.lateralArea.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Lateral Area (units²)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-orange-600">{result.slantHeight.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Slant Height</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              V = (1/3)πr²h = (1/3) × π × {radius}² × {height} = {result.volume.toFixed(4)}<br />
              l = √(r² + h²) = √({radius}² + {height}²) = {result.slantHeight.toFixed(4)}<br />
              A = πr(r + l) = π × {radius} × ({radius} + {result.slantHeight.toFixed(4)}) = {result.totalArea.toFixed(4)}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
