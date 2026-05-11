'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RegularPolygonCalculator - Calculates properties of any regular N-sided polygon.
 * Given number of sides and side length, computes area, perimeter, interior angle, etc.
 */
export default function RegularPolygonCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [sides, setSides] = useState('');
  const [sideLength, setSideLength] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    perimeter: number;
    interiorAngle: number;
    exteriorAngle: number;
    area: number;
    apothem: number;
    circumradius: number;
    diagonals: number;
  } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const n = parseInt(sides);
    const s = parseFloat(sideLength);

    if (!sides.trim() || isNaN(n) || n < 3) {
      newErrors.sides = 'Enter a valid number of sides (3 or more)';
    }
    if (!sideLength.trim() || isNaN(s) || s <= 0) {
      newErrors.sideLength = 'Enter a valid positive side length';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    const perimeter = n * s;
    const interiorAngle = ((n - 2) * 180) / n;
    const exteriorAngle = 360 / n;
    const apothem = s / (2 * Math.tan(Math.PI / n));
    const area = (perimeter * apothem) / 2;
    const circumradius = s / (2 * Math.sin(Math.PI / n));
    const diagonals = (n * (n - 3)) / 2;

    setResult({ perimeter, interiorAngle, exteriorAngle, area, apothem, circumradius, diagonals });
  };

  const copyText = result
    ? `Regular ${sides}-gon (side = ${sideLength})\nPerimeter: ${result.perimeter.toFixed(4)}\nArea: ${result.area.toFixed(4)}\nInterior Angle: ${result.interiorAngle.toFixed(2)}°\nExterior Angle: ${result.exteriorAngle.toFixed(2)}°\nApothem: ${result.apothem.toFixed(4)}\nCircumradius: ${result.circumradius.toFixed(4)}\nDiagonals: ${result.diagonals}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea error={errors.sides}>
          <label htmlFor={`${toolId}-sides`} className="block text-sm font-medium text-gray-700 mb-1">Number of Sides</label>
          <input id={`${toolId}-sides`} type="text" inputMode="numeric" value={sides} onChange={(e) => { setSides(e.target.value); if (errors.sides) setErrors((p) => ({ ...p, sides: '' })); }} placeholder="e.g. 6" aria-label={`Number of sides for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea error={errors.sideLength}>
          <label htmlFor={`${toolId}-length`} className="block text-sm font-medium text-gray-700 mb-1">Side Length</label>
          <input id={`${toolId}-length`} type="text" inputMode="decimal" value={sideLength} onChange={(e) => { setSideLength(e.target.value); if (errors.sideLength) setErrors((p) => ({ ...p, sideLength: '' })); }} placeholder="e.g. 5" aria-label={`Side length for ${toolName}`} className="input-field" />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate polygon properties" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600">{result.area.toFixed(4)}</div>
                <div className="text-xs text-gray-500">Area</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600">{result.perimeter.toFixed(4)}</div>
                <div className="text-xs text-gray-500">Perimeter</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600">{result.interiorAngle.toFixed(2)}°</div>
                <div className="text-xs text-gray-500">Interior Angle</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600">{result.exteriorAngle.toFixed(2)}°</div>
                <div className="text-xs text-gray-500">Exterior Angle</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600">{result.apothem.toFixed(4)}</div>
                <div className="text-xs text-gray-500">Apothem</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600">{result.circumradius.toFixed(4)}</div>
                <div className="text-xs text-gray-500">Circumradius</div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
              <span className="text-sm text-gray-600">Number of Diagonals: </span>
              <span className="font-bold text-gray-700">{result.diagonals}</span>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
