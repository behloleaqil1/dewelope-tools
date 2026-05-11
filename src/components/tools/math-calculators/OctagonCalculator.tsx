'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * OctagonCalculator - Calculate area, perimeter, and other properties of a regular octagon.
 * Uses standard geometry formulas for regular octagons.
 */
export default function OctagonCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [sideLength, setSideLength] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ perimeter: number; area: number; apothem: number; diagonal: number } | null>(null);

  const calculate = () => {
    const side = parseFloat(sideLength);

    if (!sideLength.trim() || isNaN(side) || side <= 0) {
      setError('Please enter a valid positive number for side length.');
      setResult(null);
      return;
    }

    setError('');

    const perimeter = 8 * side;
    // Area = 2 * (1 + √2) * s²
    const area = 2 * (1 + Math.sqrt(2)) * side * side;
    // Apothem = s * (1 + √2) / 2 — distance from center to midpoint of a side
    const apothem = side * (1 + Math.sqrt(2)) / 2;
    // Long diagonal = s * (1 + √2)
    const diagonal = side * (1 + Math.sqrt(2));

    setResult({ perimeter, area, apothem, diagonal });
  };

  const copyText = result
    ? `Regular Octagon (side = ${sideLength})\nPerimeter: ${result.perimeter.toFixed(4)}\nArea: ${result.area.toFixed(4)}\nApothem: ${result.apothem.toFixed(4)}\nDiagonal: ${result.diagonal.toFixed(4)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-side`} className="block text-sm font-medium text-gray-700 mb-1">
          Side Length
        </label>
        <input
          id={`${toolId}-side`}
          type="text"
          inputMode="decimal"
          value={sideLength}
          onChange={(e) => {
            setSideLength(e.target.value);
            if (error) setError('');
          }}
          placeholder="e.g. 5"
          aria-label={`Side length for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <button onClick={calculate} aria-label="Calculate octagon" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.perimeter.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Perimeter</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-green-600">{result.area.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Area</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-purple-600">{result.apothem.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Apothem</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-orange-600">{result.diagonal.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Diagonal</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              Area = 2(1 + √2) × s² = 2(1 + √2) × {parseFloat(sideLength).toFixed(2)}² = {result.area.toFixed(4)}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
