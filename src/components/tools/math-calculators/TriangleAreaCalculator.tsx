'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TriangleAreaCalculator - Calculate triangle area using base/height, 3 sides (Heron's formula), or coordinates.
 */
export default function TriangleAreaCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [method, setMethod] = useState<'base-height' | 'heron' | 'coordinates'>('base-height');
  const [base, setBase] = useState('');
  const [height, setHeight] = useState('');
  const [sideA, setSideA] = useState('');
  const [sideB, setSideB] = useState('');
  const [sideC, setSideC] = useState('');
  const [x1, setX1] = useState(''); const [y1, setY1] = useState('');
  const [x2, setX2] = useState(''); const [y2, setY2] = useState('');
  const [x3, setX3] = useState(''); const [y3, setY3] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ area: number; formula: string } | null>(null);

  const calculate = () => {
    setError('');
    setResult(null);

    if (method === 'base-height') {
      const b = parseFloat(base);
      const h = parseFloat(height);
      if (isNaN(b) || isNaN(h) || b <= 0 || h <= 0) {
        setError('Please enter valid positive numbers for base and height.');
        return;
      }
      const area = 0.5 * b * h;
      setResult({ area, formula: `Area = ½ × base × height = ½ × ${b} × ${h} = ${area.toFixed(4)}` });
    } else if (method === 'heron') {
      const a = parseFloat(sideA);
      const b = parseFloat(sideB);
      const c = parseFloat(sideC);
      if (isNaN(a) || isNaN(b) || isNaN(c) || a <= 0 || b <= 0 || c <= 0) {
        setError('Please enter valid positive numbers for all three sides.');
        return;
      }
      if (a + b <= c || a + c <= b || b + c <= a) {
        setError('These sides cannot form a valid triangle (triangle inequality violated).');
        return;
      }
      const s = (a + b + c) / 2;
      const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
      setResult({ area, formula: `s = (${a} + ${b} + ${c}) / 2 = ${s.toFixed(4)}\nArea = √(s(s-a)(s-b)(s-c)) = ${area.toFixed(4)}` });
    } else {
      const coords = [x1, y1, x2, y2, x3, y3].map(Number);
      if (coords.some(isNaN)) {
        setError('Please enter valid numbers for all coordinates.');
        return;
      }
      const [cx1, cy1, cx2, cy2, cx3, cy3] = coords;
      const area = Math.abs((cx1 * (cy2 - cy3) + cx2 * (cy3 - cy1) + cx3 * (cy1 - cy2)) / 2);
      if (area === 0) {
        setError('These points are collinear and do not form a triangle.');
        return;
      }
      setResult({ area, formula: `Area = ½|x₁(y₂-y₃) + x₂(y₃-y₁) + x₃(y₁-y₂)| = ${area.toFixed(4)}` });
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex flex-wrap gap-2 mb-2">
        <button onClick={() => { setMethod('base-height'); setResult(null); setError(''); }} className={`px-4 py-2 rounded text-sm font-medium ${method === 'base-height' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} aria-label="Base and height method">
          Base & Height
        </button>
        <button onClick={() => { setMethod('heron'); setResult(null); setError(''); }} className={`px-4 py-2 rounded text-sm font-medium ${method === 'heron' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} aria-label="Heron formula method">
          3 Sides (Heron)
        </button>
        <button onClick={() => { setMethod('coordinates'); setResult(null); setError(''); }} className={`px-4 py-2 rounded text-sm font-medium ${method === 'coordinates' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} aria-label="Coordinates method">
          Coordinates
        </button>
      </div>

      <InputArea error={error}>
        {method === 'base-height' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor={`${toolId}-base`} className="block text-sm font-medium text-gray-700 mb-1">Base</label>
              <input id={`${toolId}-base`} type="text" inputMode="decimal" value={base} onChange={(e) => setBase(e.target.value)} placeholder="e.g. 10" aria-label={`Base for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">Height</label>
              <input id={`${toolId}-height`} type="text" inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g. 5" aria-label={`Height for ${toolName}`} className="input-field" />
            </div>
          </div>
        )}
        {method === 'heron' && (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor={`${toolId}-sideA`} className="block text-sm font-medium text-gray-700 mb-1">Side A</label>
              <input id={`${toolId}-sideA`} type="text" inputMode="decimal" value={sideA} onChange={(e) => setSideA(e.target.value)} placeholder="e.g. 3" aria-label={`Side A for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-sideB`} className="block text-sm font-medium text-gray-700 mb-1">Side B</label>
              <input id={`${toolId}-sideB`} type="text" inputMode="decimal" value={sideB} onChange={(e) => setSideB(e.target.value)} placeholder="e.g. 4" aria-label={`Side B for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-sideC`} className="block text-sm font-medium text-gray-700 mb-1">Side C</label>
              <input id={`${toolId}-sideC`} type="text" inputMode="decimal" value={sideC} onChange={(e) => setSideC(e.target.value)} placeholder="e.g. 5" aria-label={`Side C for ${toolName}`} className="input-field" />
            </div>
          </div>
        )}
        {method === 'coordinates' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div><label htmlFor={`${toolId}-x1`} className="block text-sm font-medium text-gray-700 mb-1">X₁</label><input id={`${toolId}-x1`} type="text" inputMode="decimal" value={x1} onChange={(e) => setX1(e.target.value)} placeholder="0" aria-label={`X1 for ${toolName}`} className="input-field" /></div>
              <div><label htmlFor={`${toolId}-y1`} className="block text-sm font-medium text-gray-700 mb-1">Y₁</label><input id={`${toolId}-y1`} type="text" inputMode="decimal" value={y1} onChange={(e) => setY1(e.target.value)} placeholder="0" aria-label={`Y1 for ${toolName}`} className="input-field" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label htmlFor={`${toolId}-x2`} className="block text-sm font-medium text-gray-700 mb-1">X₂</label><input id={`${toolId}-x2`} type="text" inputMode="decimal" value={x2} onChange={(e) => setX2(e.target.value)} placeholder="4" aria-label={`X2 for ${toolName}`} className="input-field" /></div>
              <div><label htmlFor={`${toolId}-y2`} className="block text-sm font-medium text-gray-700 mb-1">Y₂</label><input id={`${toolId}-y2`} type="text" inputMode="decimal" value={y2} onChange={(e) => setY2(e.target.value)} placeholder="0" aria-label={`Y2 for ${toolName}`} className="input-field" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label htmlFor={`${toolId}-x3`} className="block text-sm font-medium text-gray-700 mb-1">X₃</label><input id={`${toolId}-x3`} type="text" inputMode="decimal" value={x3} onChange={(e) => setX3(e.target.value)} placeholder="2" aria-label={`X3 for ${toolName}`} className="input-field" /></div>
              <div><label htmlFor={`${toolId}-y3`} className="block text-sm font-medium text-gray-700 mb-1">Y₃</label><input id={`${toolId}-y3`} type="text" inputMode="decimal" value={y3} onChange={(e) => setY3(e.target.value)} placeholder="3" aria-label={`Y3 for ${toolName}`} className="input-field" /></div>
            </div>
          </div>
        )}
      </InputArea>

      <button onClick={calculate} className="btn-primary" aria-label="Calculate triangle area">
        Calculate Area
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">{result.area.toFixed(4)}</div>
              <div className="text-xs text-gray-500 mt-1">Square Units</div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono whitespace-pre-wrap">
              {result.formula}
            </div>
            <CopyToClipboard text={`Area: ${result.area.toFixed(4)} square units\n${result.formula}`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
