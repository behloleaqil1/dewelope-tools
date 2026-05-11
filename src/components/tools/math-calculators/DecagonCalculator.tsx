'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DecagonCalculator - Calculates area, perimeter, and other properties of a regular decagon (10 sides).
 * Uses side length to compute all measurements.
 */
export default function DecagonCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [sideLength, setSideLength] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    perimeter: number;
    area: number;
    apothem: number;
    diagonals: number;
    interiorAngle: number;
  } | null>(null);

  const calculate = () => {
    setError('');
    const s = parseFloat(sideLength);
    if (!sideLength.trim() || isNaN(s) || s <= 0) {
      setError('Please enter a valid positive number for side length');
      setResult(null);
      return;
    }

    const n = 10;
    const perimeter = n * s;
    const apothem = s / (2 * Math.tan(Math.PI / n));
    const area = (perimeter * apothem) / 2;
    const diagonals = (n * (n - 3)) / 2;
    const interiorAngle = ((n - 2) * 180) / n;

    setResult({ perimeter, area, apothem, diagonals, interiorAngle });
  };

  const copyText = result
    ? `Regular Decagon (side = ${sideLength})\nPerimeter: ${result.perimeter.toFixed(4)}\nArea: ${result.area.toFixed(4)}\nApothem: ${result.apothem.toFixed(4)}\nDiagonals: ${result.diagonals}\nInterior Angle: ${result.interiorAngle}°`
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
          onChange={(e) => { setSideLength(e.target.value); if (error) setError(''); }}
          placeholder="e.g. 5"
          aria-label={`Side length for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <button onClick={calculate} aria-label="Calculate decagon properties" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.area.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Area</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{result.perimeter.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Perimeter</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-purple-600">{result.apothem.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Apothem</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-orange-600">{result.interiorAngle}°</div>
                <div className="text-xs text-gray-500 mt-1">Interior Angle</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              Diagonals: {result.diagonals} | Sides: 10 | Formula: A = (5/2) × s² × √(5 + 2√5)
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
