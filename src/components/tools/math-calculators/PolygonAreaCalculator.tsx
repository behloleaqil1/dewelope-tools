'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PolygonAreaCalculator - Calculate regular polygon area from number of sides and side length.
 */
export default function PolygonAreaCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [sides, setSides] = useState('');
  const [sideLength, setSideLength] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ area: number; perimeter: number; apothem: number; interiorAngle: number; formula: string } | null>(null);

  const calculate = () => {
    setError('');
    setResult(null);
    const n = parseInt(sides);
    const s = parseFloat(sideLength);
    if (isNaN(n) || n < 3) { setError('Number of sides must be at least 3.'); return; }
    if (isNaN(s) || s <= 0) { setError('Side length must be a positive number.'); return; }

    const perimeter = n * s;
    const apothem = s / (2 * Math.tan(Math.PI / n));
    const area = (perimeter * apothem) / 2;
    const interiorAngle = ((n - 2) * 180) / n;

    setResult({
      area,
      perimeter,
      apothem,
      interiorAngle,
      formula: `Apothem = s / (2·tan(π/n)) = ${s} / (2·tan(π/${n})) = ${apothem.toFixed(6)}\nPerimeter = n × s = ${n} × ${s} = ${perimeter}\nArea = ½ × Perimeter × Apothem = ½ × ${perimeter} × ${apothem.toFixed(4)} = ${area.toFixed(6)}\nInterior Angle = (n-2)×180°/n = ${interiorAngle.toFixed(4)}°`,
    });
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-sides`} className="block text-sm font-medium text-gray-700 mb-1">Number of Sides</label>
            <input id={`${toolId}-sides`} type="text" inputMode="numeric" value={sides} onChange={(e) => setSides(e.target.value)} placeholder="e.g. 6" aria-label={`Number of sides for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-length`} className="block text-sm font-medium text-gray-700 mb-1">Side Length</label>
            <input id={`${toolId}-length`} type="text" inputMode="decimal" value={sideLength} onChange={(e) => setSideLength(e.target.value)} placeholder="e.g. 4" aria-label={`Side length for ${toolName}`} className="input-field" />
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} className="btn-primary" aria-label="Calculate polygon area">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xs text-gray-500">Area</div>
                <div className="text-lg font-bold text-blue-600">{result.area.toFixed(4)}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xs text-gray-500">Perimeter</div>
                <div className="text-lg font-bold text-blue-600">{result.perimeter.toFixed(4)}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xs text-gray-500">Apothem</div>
                <div className="text-lg font-bold text-blue-600">{result.apothem.toFixed(4)}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xs text-gray-500">Interior Angle</div>
                <div className="text-lg font-bold text-blue-600">{result.interiorAngle.toFixed(2)}°</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono whitespace-pre-wrap">{result.formula}</div>
            <CopyToClipboard text={`Area: ${result.area.toFixed(6)}\nPerimeter: ${result.perimeter}\nApothem: ${result.apothem.toFixed(6)}\nInterior Angle: ${result.interiorAngle.toFixed(4)}°`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
