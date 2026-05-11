'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RectangleCalculator - Calculates area, perimeter, and diagonal of a rectangle.
 * Area = length × width
 * Perimeter = 2 × (length + width)
 * Diagonal = √(length² + width²)
 */
export default function RectangleCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ area: number; perimeter: number; diagonal: number } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const l = parseFloat(length);
    const w = parseFloat(width);

    if (!length.trim() || isNaN(l) || l <= 0) {
      newErrors.length = 'Please enter a valid positive number';
    }
    if (!width.trim() || isNaN(w) || w <= 0) {
      newErrors.width = 'Please enter a valid positive number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    const area = l * w;
    const perimeter = 2 * (l + w);
    const diagonal = Math.sqrt(l * l + w * w);
    setResult({ area, perimeter, diagonal });
  };

  const copyText = result
    ? `Rectangle (${length} × ${width})\nArea: ${result.area.toFixed(4)}\nPerimeter: ${result.perimeter.toFixed(4)}\nDiagonal: ${result.diagonal.toFixed(4)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea error={errors.length}>
          <label htmlFor={`${toolId}-length`} className="block text-sm font-medium text-gray-700 mb-1">
            Length
          </label>
          <input
            id={`${toolId}-length`}
            type="text"
            inputMode="decimal"
            value={length}
            onChange={(e) => {
              setLength(e.target.value);
              if (errors.length) setErrors((prev) => ({ ...prev, length: '' }));
            }}
            placeholder="e.g. 10"
            aria-label={`Length for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.width}>
          <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">
            Width
          </label>
          <input
            id={`${toolId}-width`}
            type="text"
            inputMode="decimal"
            value={width}
            onChange={(e) => {
              setWidth(e.target.value);
              if (errors.width) setErrors((prev) => ({ ...prev, width: '' }));
            }}
            placeholder="e.g. 5"
            aria-label={`Width for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate rectangle" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.area.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Area</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{result.perimeter.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Perimeter</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-purple-600">{result.diagonal.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Diagonal</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono space-y-1">
              <div>Area = {length} × {width} = {result.area.toFixed(4)}</div>
              <div>Perimeter = 2 × ({length} + {width}) = {result.perimeter.toFixed(4)}</div>
              <div>Diagonal = √({length}² + {width}²) = {result.diagonal.toFixed(4)}</div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
