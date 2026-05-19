'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RhombusAreaCalculator - Calculate rhombus area using diagonals or side and height.
 */
export default function RhombusAreaCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [method, setMethod] = useState<'diagonals' | 'side-height'>('diagonals');
  const [d1, setD1] = useState('');
  const [d2, setD2] = useState('');
  const [side, setSide] = useState('');
  const [height, setHeight] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ area: number; perimeter: number; formula: string } | null>(null);

  const calculate = () => {
    setError('');
    setResult(null);

    if (method === 'diagonals') {
      const diag1 = parseFloat(d1);
      const diag2 = parseFloat(d2);
      if (isNaN(diag1) || isNaN(diag2) || diag1 <= 0 || diag2 <= 0) { setError('Enter valid positive diagonals.'); return; }
      const area = (diag1 * diag2) / 2;
      const sideCalc = Math.sqrt((diag1 / 2) ** 2 + (diag2 / 2) ** 2);
      const perimeter = 4 * sideCalc;
      setResult({ area, perimeter, formula: `A = (d₁ × d₂) / 2 = (${diag1} × ${diag2}) / 2 = ${area.toFixed(6)}\nSide = √((d₁/2)² + (d₂/2)²) = ${sideCalc.toFixed(6)}\nPerimeter = 4 × side = ${perimeter.toFixed(6)}` });
    } else {
      const s = parseFloat(side);
      const h = parseFloat(height);
      if (isNaN(s) || isNaN(h) || s <= 0 || h <= 0) { setError('Enter valid positive side and height.'); return; }
      if (h > s) { setError('Height cannot exceed side length.'); return; }
      const area = s * h;
      const perimeter = 4 * s;
      setResult({ area, perimeter, formula: `A = side × height = ${s} × ${h} = ${area.toFixed(6)}\nPerimeter = 4 × side = 4 × ${s} = ${perimeter.toFixed(6)}` });
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex gap-2 mb-2">
        <button onClick={() => { setMethod('diagonals'); setResult(null); setError(''); }} className={`px-4 py-2 rounded text-sm font-medium ${method === 'diagonals' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} aria-label="Diagonals method">Diagonals</button>
        <button onClick={() => { setMethod('side-height'); setResult(null); setError(''); }} className={`px-4 py-2 rounded text-sm font-medium ${method === 'side-height' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} aria-label="Side and height method">Side & Height</button>
      </div>

      <InputArea error={error}>
        {method === 'diagonals' ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor={`${toolId}-d1`} className="block text-sm font-medium text-gray-700 mb-1">Diagonal 1</label>
              <input id={`${toolId}-d1`} type="text" inputMode="decimal" value={d1} onChange={(e) => setD1(e.target.value)} placeholder="e.g. 6" aria-label={`Diagonal 1 for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-d2`} className="block text-sm font-medium text-gray-700 mb-1">Diagonal 2</label>
              <input id={`${toolId}-d2`} type="text" inputMode="decimal" value={d2} onChange={(e) => setD2(e.target.value)} placeholder="e.g. 8" aria-label={`Diagonal 2 for ${toolName}`} className="input-field" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor={`${toolId}-side`} className="block text-sm font-medium text-gray-700 mb-1">Side</label>
              <input id={`${toolId}-side`} type="text" inputMode="decimal" value={side} onChange={(e) => setSide(e.target.value)} placeholder="e.g. 5" aria-label={`Side for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">Height</label>
              <input id={`${toolId}-height`} type="text" inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g. 4" aria-label={`Height for ${toolName}`} className="input-field" />
            </div>
          </div>
        )}
      </InputArea>

      <button onClick={calculate} className="btn-primary" aria-label="Calculate rhombus area">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-sm text-gray-500">Area</div>
                <div className="text-xl font-bold text-blue-600">{result.area.toFixed(4)}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-sm text-gray-500">Perimeter</div>
                <div className="text-xl font-bold text-blue-600">{result.perimeter.toFixed(4)}</div>
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
