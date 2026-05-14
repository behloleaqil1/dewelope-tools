'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * EllipseAreaCalculator - Calculate ellipse area and perimeter from semi-major and semi-minor axes.
 */
export default function EllipseAreaCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [semiMajor, setSemiMajor] = useState('');
  const [semiMinor, setSemiMinor] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ area: number; perimeter: number; formula: string } | null>(null);

  const calculate = () => {
    setError('');
    setResult(null);
    const a = parseFloat(semiMajor);
    const b = parseFloat(semiMinor);
    if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) {
      setError('Please enter valid positive numbers for both axes.');
      return;
    }
    const area = Math.PI * a * b;
    // Ramanujan approximation for perimeter
    const h = ((a - b) * (a - b)) / ((a + b) * (a + b));
    const perimeter = Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
    setResult({
      area,
      perimeter,
      formula: `A = πab = π × ${a} × ${b} = ${area.toFixed(6)}\nPerimeter ≈ π(a+b)(1 + 3h/(10+√(4-3h)))\nwhere h = (a-b)²/(a+b)² = ${h.toFixed(6)}\nPerimeter ≈ ${perimeter.toFixed(6)}`,
    });
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-a`} className="block text-sm font-medium text-gray-700 mb-1">Semi-major axis (a)</label>
            <input id={`${toolId}-a`} type="text" inputMode="decimal" value={semiMajor} onChange={(e) => setSemiMajor(e.target.value)} placeholder="e.g. 5" aria-label={`Semi-major axis for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-b`} className="block text-sm font-medium text-gray-700 mb-1">Semi-minor axis (b)</label>
            <input id={`${toolId}-b`} type="text" inputMode="decimal" value={semiMinor} onChange={(e) => setSemiMinor(e.target.value)} placeholder="e.g. 3" aria-label={`Semi-minor axis for ${toolName}`} className="input-field" />
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} className="btn-primary" aria-label="Calculate ellipse area">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-sm text-gray-500">Area</div>
                <div className="text-xl font-bold text-blue-600">{result.area.toFixed(6)}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-sm text-gray-500">Perimeter (approx)</div>
                <div className="text-xl font-bold text-blue-600">{result.perimeter.toFixed(6)}</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono whitespace-pre-wrap">{result.formula}</div>
            <CopyToClipboard text={`Area: ${result.area.toFixed(6)}\nPerimeter: ${result.perimeter.toFixed(6)}\n${result.formula}`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
