'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HexagonCalculator - Calculate area, perimeter, apothem of a regular hexagon.
 */
export default function HexagonCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [sideLength, setSideLength] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    area: number;
    perimeter: number;
    apothem: number;
    diagonalShort: number;
    diagonalLong: number;
    interiorAngle: number;
    circumradius: number;
  } | null>(null);

  const calculate = () => {
    setError('');
    setResult(null);

    const s = parseFloat(sideLength);
    if (!sideLength.trim() || isNaN(s) || s <= 0) {
      setError('Please enter a valid positive number for side length');
      return;
    }

    const apothem = (s * Math.sqrt(3)) / 2;
    const area = (3 * Math.sqrt(3) * s * s) / 2;
    const perimeter = 6 * s;
    const diagonalShort = s * Math.sqrt(3);
    const diagonalLong = 2 * s;
    const interiorAngle = 120;
    const circumradius = s;

    setResult({ area, perimeter, apothem, diagonalShort, diagonalLong, interiorAngle, circumradius });
  };

  const copyText = result
    ? `Regular Hexagon (side = ${sideLength})\nArea: ${result.area.toFixed(6)}\nPerimeter: ${result.perimeter.toFixed(6)}\nApothem: ${result.apothem.toFixed(6)}\nShort Diagonal: ${result.diagonalShort.toFixed(6)}\nLong Diagonal: ${result.diagonalLong.toFixed(6)}\nCircumradius: ${result.circumradius.toFixed(6)}\nInterior Angle: ${result.interiorAngle}°`
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
          onChange={(e) => setSideLength(e.target.value)}
          placeholder="Enter side length of regular hexagon"
          aria-label={`Side length for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <button onClick={calculate} aria-label="Calculate hexagon properties" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.area.toFixed(4)}</div>
                <div className="text-xs text-gray-500">Area</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.perimeter.toFixed(4)}</div>
                <div className="text-xs text-gray-500">Perimeter</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.apothem.toFixed(4)}</div>
                <div className="text-xs text-gray-500">Apothem</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.circumradius.toFixed(4)}</div>
                <div className="text-xs text-gray-500">Circumradius</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.diagonalShort.toFixed(4)}</div>
                <div className="text-xs text-gray-500">Short Diagonal</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.diagonalLong.toFixed(4)}</div>
                <div className="text-xs text-gray-500">Long Diagonal</div>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm text-gray-600 font-mono text-center">
              <div>Area = (3√3 / 2) × s² = (3√3 / 2) × {sideLength}² = {result.area.toFixed(4)}</div>
              <div className="mt-1">Apothem = (s × √3) / 2 = {result.apothem.toFixed(4)}</div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
              <div className="text-lg font-bold text-gray-800">{result.interiorAngle}°</div>
              <div className="text-xs text-gray-500">Interior Angle</div>
            </div>

            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
