'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ParallelogramAreaCalculator - Calculate parallelogram area from base/height or sides/angle.
 */
export default function ParallelogramAreaCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [method, setMethod] = useState<'base-height' | 'sides-angle'>('base-height');
  const [base, setBase] = useState('');
  const [height, setHeight] = useState('');
  const [sideA, setSideA] = useState('');
  const [sideB, setSideB] = useState('');
  const [angle, setAngle] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ area: number; perimeter: number; formula: string } | null>(null);

  const calculate = () => {
    setError('');
    setResult(null);

    if (method === 'base-height') {
      const b = parseFloat(base);
      const h = parseFloat(height);
      if (isNaN(b) || isNaN(h) || b <= 0 || h <= 0) { setError('Enter valid positive base and height.'); return; }
      const area = b * h;
      setResult({ area, perimeter: 0, formula: `A = base × height = ${b} × ${h} = ${area.toFixed(6)}` });
    } else {
      const a = parseFloat(sideA);
      const b = parseFloat(sideB);
      const ang = parseFloat(angle);
      if (isNaN(a) || isNaN(b) || isNaN(ang) || a <= 0 || b <= 0 || ang <= 0 || ang >= 180) {
        setError('Enter valid positive sides and angle (0°-180°).');
        return;
      }
      const rad = (ang * Math.PI) / 180;
      const area = a * b * Math.sin(rad);
      const perimeter = 2 * (a + b);
      const d1 = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(rad));
      const d2 = Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(rad));
      setResult({
        area,
        perimeter,
        formula: `A = a × b × sin(θ) = ${a} × ${b} × sin(${ang}°) = ${area.toFixed(6)}\nPerimeter = 2(a + b) = 2(${a} + ${b}) = ${perimeter.toFixed(4)}\nDiagonal 1 = ${d1.toFixed(4)}\nDiagonal 2 = ${d2.toFixed(4)}`,
      });
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex gap-2 mb-2">
        <button onClick={() => { setMethod('base-height'); setResult(null); setError(''); }} className={`px-4 py-2 rounded text-sm font-medium ${method === 'base-height' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} aria-label="Base and height method">Base & Height</button>
        <button onClick={() => { setMethod('sides-angle'); setResult(null); setError(''); }} className={`px-4 py-2 rounded text-sm font-medium ${method === 'sides-angle' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} aria-label="Sides and angle method">Sides & Angle</button>
      </div>

      <InputArea error={error}>
        {method === 'base-height' ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor={`${toolId}-base`} className="block text-sm font-medium text-gray-700 mb-1">Base</label>
              <input id={`${toolId}-base`} type="text" inputMode="decimal" value={base} onChange={(e) => setBase(e.target.value)} placeholder="e.g. 8" aria-label={`Base for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">Height</label>
              <input id={`${toolId}-height`} type="text" inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g. 5" aria-label={`Height for ${toolName}`} className="input-field" />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor={`${toolId}-sideA`} className="block text-sm font-medium text-gray-700 mb-1">Side a</label>
                <input id={`${toolId}-sideA`} type="text" inputMode="decimal" value={sideA} onChange={(e) => setSideA(e.target.value)} placeholder="e.g. 8" aria-label={`Side a for ${toolName}`} className="input-field" />
              </div>
              <div>
                <label htmlFor={`${toolId}-sideB`} className="block text-sm font-medium text-gray-700 mb-1">Side b</label>
                <input id={`${toolId}-sideB`} type="text" inputMode="decimal" value={sideB} onChange={(e) => setSideB(e.target.value)} placeholder="e.g. 5" aria-label={`Side b for ${toolName}`} className="input-field" />
              </div>
            </div>
            <div>
              <label htmlFor={`${toolId}-angle`} className="block text-sm font-medium text-gray-700 mb-1">Included Angle (degrees)</label>
              <input id={`${toolId}-angle`} type="text" inputMode="decimal" value={angle} onChange={(e) => setAngle(e.target.value)} placeholder="e.g. 60" aria-label={`Angle for ${toolName}`} className="input-field" />
            </div>
          </div>
        )}
      </InputArea>

      <button onClick={calculate} className="btn-primary" aria-label="Calculate parallelogram area">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-sm text-gray-500">Area</div>
              <div className="text-2xl font-bold text-blue-600">{result.area.toFixed(6)}</div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono whitespace-pre-wrap">{result.formula}</div>
            <CopyToClipboard text={`Area: ${result.area.toFixed(6)}\n${result.formula}`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
