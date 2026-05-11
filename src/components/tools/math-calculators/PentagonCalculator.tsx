'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PentagonCalculator - Calculates area, perimeter, and apothem of a regular pentagon from side length.
 */
export default function PentagonCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [sideLength, setSideLength] = useState('');
  const [result, setResult] = useState<{ area: number; perimeter: number; apothem: number; diagonalLength: number } | null>(null);
  const [error, setError] = useState<string | undefined>();

  const calculate = () => {
    setError(undefined);
    setResult(null);

    const s = parseFloat(sideLength);
    if (!sideLength.trim() || isNaN(s) || s <= 0) {
      setError('Please enter a valid positive number for side length');
      return;
    }

    // Regular pentagon formulas
    const perimeter = 5 * s;
    const apothem = s / (2 * Math.tan(Math.PI / 5));
    const area = (perimeter * apothem) / 2;
    const diagonalLength = s * ((1 + Math.sqrt(5)) / 2); // golden ratio

    setResult({ area, perimeter, apothem, diagonalLength });
  };

  const copyText = result
    ? `Regular Pentagon (side = ${sideLength})\nPerimeter: ${result.perimeter.toFixed(6)}\nApothem: ${result.apothem.toFixed(6)}\nArea: ${result.area.toFixed(6)}\nDiagonal: ${result.diagonalLength.toFixed(6)}`
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
          placeholder="e.g. 5"
          aria-label={`Side length for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <button onClick={calculate} aria-label="Calculate pentagon" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.perimeter.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Perimeter</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.area.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Area</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.apothem.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Apothem</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.diagonalLength.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Diagonal</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              Area = (Perimeter × Apothem) / 2 = ({result.perimeter.toFixed(4)} × {result.apothem.toFixed(4)}) / 2
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
