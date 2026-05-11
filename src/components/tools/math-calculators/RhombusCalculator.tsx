'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RhombusCalculator - Calculate area, perimeter, and diagonals of a rhombus.
 * Supports calculation from side + diagonal, or both diagonals.
 */
export default function RhombusCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'diagonals' | 'side-diagonal'>('diagonals');
  const [d1, setD1] = useState('');
  const [d2, setD2] = useState('');
  const [side, setSide] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ area: number; perimeter: number; d1: number; d2: number; side: number } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};

    if (mode === 'diagonals') {
      const diag1 = parseFloat(d1);
      const diag2 = parseFloat(d2);

      if (!d1.trim() || isNaN(diag1) || diag1 <= 0) newErrors.d1 = 'Enter a positive number';
      if (!d2.trim() || isNaN(diag2) || diag2 <= 0) newErrors.d2 = 'Enter a positive number';

      if (Object.keys(newErrors).length > 0) { setErrors(newErrors); setResult(null); return; }

      const area = (diag1 * diag2) / 2;
      const sideLen = Math.sqrt((diag1 / 2) ** 2 + (diag2 / 2) ** 2);
      const perimeter = 4 * sideLen;

      setErrors({});
      setResult({ area, perimeter, d1: diag1, d2: diag2, side: sideLen });
    } else {
      const s = parseFloat(side);
      const diag1 = parseFloat(d1);

      if (!side.trim() || isNaN(s) || s <= 0) newErrors.side = 'Enter a positive number';
      if (!d1.trim() || isNaN(diag1) || diag1 <= 0) newErrors.d1 = 'Enter a positive number';

      if (Object.keys(newErrors).length > 0) { setErrors(newErrors); setResult(null); return; }

      // d2 = 2 * sqrt(s² - (d1/2)²)
      const halfD1 = diag1 / 2;
      if (halfD1 >= s) {
        setErrors({ d1: 'Diagonal must be less than 2 × side' });
        setResult(null);
        return;
      }

      const diag2 = 2 * Math.sqrt(s * s - halfD1 * halfD1);
      const area = (diag1 * diag2) / 2;
      const perimeter = 4 * s;

      setErrors({});
      setResult({ area, perimeter, d1: diag1, d2: diag2, side: s });
    }
  };

  const copyText = result
    ? `Side: ${result.side.toFixed(4)}\nDiagonal 1: ${result.d1.toFixed(4)}\nDiagonal 2: ${result.d2.toFixed(4)}\nArea: ${result.area.toFixed(4)}\nPerimeter: ${result.perimeter.toFixed(4)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Calculation Mode</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="radio" checked={mode === 'diagonals'} onChange={() => { setMode('diagonals'); setResult(null); }} />
            From two diagonals
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="radio" checked={mode === 'side-diagonal'} onChange={() => { setMode('side-diagonal'); setResult(null); }} />
            From side + diagonal
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {mode === 'side-diagonal' && (
          <InputArea error={errors.side}>
            <label htmlFor={`${toolId}-side`} className="block text-sm font-medium text-gray-700 mb-1">Side Length</label>
            <input id={`${toolId}-side`} type="text" inputMode="decimal" value={side} onChange={(e) => setSide(e.target.value)} placeholder="e.g. 5" aria-label={`Side length for ${toolName}`} className="input-field" />
          </InputArea>
        )}
        <InputArea error={errors.d1}>
          <label htmlFor={`${toolId}-d1`} className="block text-sm font-medium text-gray-700 mb-1">Diagonal 1 (d₁)</label>
          <input id={`${toolId}-d1`} type="text" inputMode="decimal" value={d1} onChange={(e) => setD1(e.target.value)} placeholder="e.g. 6" aria-label={`Diagonal 1 for ${toolName}`} className="input-field" />
        </InputArea>
        {mode === 'diagonals' && (
          <InputArea error={errors.d2}>
            <label htmlFor={`${toolId}-d2`} className="block text-sm font-medium text-gray-700 mb-1">Diagonal 2 (d₂)</label>
            <input id={`${toolId}-d2`} type="text" inputMode="decimal" value={d2} onChange={(e) => setD2(e.target.value)} placeholder="e.g. 8" aria-label={`Diagonal 2 for ${toolName}`} className="input-field" />
          </InputArea>
        )}
      </div>

      <button onClick={calculate} aria-label="Calculate rhombus" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-800">{result.area.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Area</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-800">{result.perimeter.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Perimeter</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-800">{result.side.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Side</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-800">{result.d1.toFixed(4)} / {result.d2.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Diagonals (d₁ / d₂)</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              Area = (d₁ × d₂) / 2 = ({result.d1} × {result.d2}) / 2 = {result.area.toFixed(4)}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
