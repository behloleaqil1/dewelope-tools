'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PythagoreanTheoremCalculator - Solve a² + b² = c² for any missing side.
 */
export default function PythagoreanTheoremCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [sideA, setSideA] = useState('');
  const [sideB, setSideB] = useState('');
  const [sideC, setSideC] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ value: number; formula: string; label: string } | null>(null);

  const calculate = () => {
    setError('');
    setResult(null);

    const a = sideA ? parseFloat(sideA) : NaN;
    const b = sideB ? parseFloat(sideB) : NaN;
    const c = sideC ? parseFloat(sideC) : NaN;

    const filled = [!isNaN(a), !isNaN(b), !isNaN(c)].filter(Boolean).length;
    if (filled !== 2) {
      setError('Please enter exactly two sides to solve for the third.');
      return;
    }

    if ((!isNaN(a) && a <= 0) || (!isNaN(b) && b <= 0) || (!isNaN(c) && c <= 0)) {
      setError('Side lengths must be positive numbers.');
      return;
    }

    if (isNaN(c)) {
      const val = Math.sqrt(a * a + b * b);
      setResult({ value: val, label: 'Hypotenuse (c)', formula: `c = √(a² + b²) = √(${a}² + ${b}²) = √(${(a * a + b * b).toFixed(4)}) = ${val.toFixed(6)}` });
    } else if (isNaN(b)) {
      if (c <= a) { setError('Hypotenuse must be greater than the other side.'); return; }
      const val = Math.sqrt(c * c - a * a);
      setResult({ value: val, label: 'Side b', formula: `b = √(c² - a²) = √(${c}² - ${a}²) = √(${(c * c - a * a).toFixed(4)}) = ${val.toFixed(6)}` });
    } else {
      if (c <= b) { setError('Hypotenuse must be greater than the other side.'); return; }
      const val = Math.sqrt(c * c - b * b);
      setResult({ value: val, label: 'Side a', formula: `a = √(c² - b²) = √(${c}² - ${b}²) = √(${(c * c - b * b).toFixed(4)}) = ${val.toFixed(6)}` });
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <p className="text-sm text-gray-500 mb-3">Enter any two sides to calculate the third. Leave one field empty.</p>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-a`} className="block text-sm font-medium text-gray-700 mb-1">Side a</label>
            <input id={`${toolId}-a`} type="text" inputMode="decimal" value={sideA} onChange={(e) => setSideA(e.target.value)} placeholder="e.g. 3" aria-label={`Side a for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-b`} className="block text-sm font-medium text-gray-700 mb-1">Side b</label>
            <input id={`${toolId}-b`} type="text" inputMode="decimal" value={sideB} onChange={(e) => setSideB(e.target.value)} placeholder="e.g. 4" aria-label={`Side b for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-c`} className="block text-sm font-medium text-gray-700 mb-1">Hypotenuse c</label>
            <input id={`${toolId}-c`} type="text" inputMode="decimal" value={sideC} onChange={(e) => setSideC(e.target.value)} placeholder="e.g. 5" aria-label={`Hypotenuse c for ${toolName}`} className="input-field" />
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} className="btn-primary" aria-label="Calculate using Pythagorean theorem">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-sm text-gray-500">{result.label}</div>
              <div className="text-2xl font-bold text-blue-600">{result.value.toFixed(6)}</div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono whitespace-pre-wrap">
              {result.formula}
            </div>
            <CopyToClipboard text={`${result.label}: ${result.value.toFixed(6)}\n${result.formula}`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
