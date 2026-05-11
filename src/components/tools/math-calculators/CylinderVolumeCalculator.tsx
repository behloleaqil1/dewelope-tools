'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CylinderVolumeCalculator - Calculate volume and surface area of a cylinder.
 */
export default function CylinderVolumeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [radius, setRadius] = useState('');
  const [height, setHeight] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ volume: number; lateralArea: number; totalArea: number; baseArea: number } | null>(null);

  function calculate() {
    const newErrors: Record<string, string> = {};
    const r = parseFloat(radius);
    const h = parseFloat(height);

    if (!radius.trim() || isNaN(r) || r <= 0) {
      newErrors.radius = 'Please enter a positive number for radius';
    }
    if (!height.trim() || isNaN(h) || h <= 0) {
      newErrors.height = 'Please enter a positive number for height';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    const baseArea = Math.PI * r * r;
    const volume = baseArea * h;
    const lateralArea = 2 * Math.PI * r * h;
    const totalArea = 2 * baseArea + lateralArea;

    setResult({ volume, lateralArea, totalArea, baseArea });
  }

  const copyText = result
    ? `Volume: ${result.volume.toFixed(6)}\nBase Area: ${result.baseArea.toFixed(6)}\nLateral Surface Area: ${result.lateralArea.toFixed(6)}\nTotal Surface Area: ${result.totalArea.toFixed(6)}`
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
            aria-label={`Radius for ${toolName}`}
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
            aria-label={`Height for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate cylinder" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600 font-mono">{result.volume.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Volume (πr²h)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600 font-mono">{result.totalArea.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Total Surface Area</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600 font-mono">{result.lateralArea.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Lateral Area (2πrh)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600 font-mono">{result.baseArea.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Base Area (πr²)</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              V = πr²h = π × {parseFloat(radius)}² × {parseFloat(height)} = {result.volume.toFixed(4)}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
