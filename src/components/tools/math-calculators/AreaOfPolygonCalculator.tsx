'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AreaOfPolygonCalculator - Calculates area of regular polygons (3-12 sides) from side length.
 * Formula: A = (n × s² × cot(π/n)) / 4
 */
export default function AreaOfPolygonCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [sides, setSides] = useState('6');
  const [sideLength, setSideLength] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ area: number; perimeter: number; interiorAngle: number; apothem: number } | null>(null);

  const polygonNames: Record<number, string> = {
    3: 'Triangle', 4: 'Square', 5: 'Pentagon', 6: 'Hexagon',
    7: 'Heptagon', 8: 'Octagon', 9: 'Nonagon', 10: 'Decagon',
    11: 'Hendecagon', 12: 'Dodecagon',
  };

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const n = parseInt(sides);
    const s = parseFloat(sideLength);

    if (isNaN(n) || n < 3 || n > 12) {
      newErrors.sides = 'Number of sides must be between 3 and 12';
    }
    if (!sideLength.trim() || isNaN(s) || s <= 0) {
      newErrors.sideLength = 'Please enter a valid positive number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    // Area = (n × s² × cot(π/n)) / 4
    const area = (n * s * s) / (4 * Math.tan(Math.PI / n));
    const perimeter = n * s;
    const interiorAngle = ((n - 2) * 180) / n;
    const apothem = s / (2 * Math.tan(Math.PI / n));

    setResult({ area, perimeter, interiorAngle, apothem });
  };

  const n = parseInt(sides);
  const name = polygonNames[n] || `${n}-gon`;

  const copyText = result
    ? `Regular ${name} (${sides} sides, side length = ${sideLength})\nArea: ${result.area.toFixed(6)}\nPerimeter: ${result.perimeter.toFixed(4)}\nInterior Angle: ${result.interiorAngle.toFixed(2)}°\nApothem: ${result.apothem.toFixed(6)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={errors.sides}>
          <label htmlFor={`${toolId}-sides`} className="block text-sm font-medium text-gray-700 mb-1">
            Number of Sides
          </label>
          <select
            id={`${toolId}-sides`}
            value={sides}
            onChange={(e) => {
              setSides(e.target.value);
              if (errors.sides) setErrors((prev) => ({ ...prev, sides: '' }));
            }}
            aria-label={`Number of sides for ${toolName}`}
            className="input-field"
          >
            {Array.from({ length: 10 }, (_, i) => i + 3).map((n) => (
              <option key={n} value={n}>{n} — {polygonNames[n]}</option>
            ))}
          </select>
        </InputArea>

        <InputArea error={errors.sideLength}>
          <label htmlFor={`${toolId}-length`} className="block text-sm font-medium text-gray-700 mb-1">
            Side Length
          </label>
          <input
            id={`${toolId}-length`}
            type="text"
            inputMode="decimal"
            value={sideLength}
            onChange={(e) => {
              setSideLength(e.target.value);
              if (errors.sideLength) setErrors((prev) => ({ ...prev, sideLength: '' }));
            }}
            placeholder="e.g. 5"
            aria-label={`Side length for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate polygon area" className="btn-primary">
        Calculate Area
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-700 mb-2">Regular {name}</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.area.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Area (sq units)</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.perimeter.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Perimeter</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.interiorAngle.toFixed(2)}°</div>
                <div className="text-xs text-gray-500 mt-1">Interior Angle</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.apothem.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Apothem</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              A = (n × s² × cot(π/n)) / 4 = ({sides} × {sideLength}² × cot(π/{sides})) / 4 = {result.area.toFixed(4)}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
