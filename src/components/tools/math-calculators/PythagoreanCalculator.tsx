'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PythagoreanCalculator - Calculates the missing side of a right triangle using a² + b² = c².
 * Enter any two sides to find the third.
 */
export default function PythagoreanCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [sideA, setSideA] = useState('');
  const [sideB, setSideB] = useState('');
  const [sideC, setSideC] = useState('');
  const [result, setResult] = useState<{ label: string; value: number; formula: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult(null);

    const a = sideA.trim() ? parseFloat(sideA) : null;
    const b = sideB.trim() ? parseFloat(sideB) : null;
    const c = sideC.trim() ? parseFloat(sideC) : null;

    const filled = [a !== null, b !== null, c !== null].filter(Boolean).length;

    if (filled !== 2) {
      setError('Please enter exactly two sides to calculate the third');
      return;
    }

    if ((a !== null && (isNaN(a) || a <= 0)) || (b !== null && (isNaN(b) || b <= 0)) || (c !== null && (isNaN(c) || c <= 0))) {
      setError('All sides must be positive numbers');
      return;
    }

    if (a !== null && b !== null) {
      // Find c (hypotenuse)
      const cVal = Math.sqrt(a * a + b * b);
      setResult({ label: 'Hypotenuse (c)', value: cVal, formula: `c = √(${a}² + ${b}²) = √(${a*a} + ${b*b}) = ${cVal.toFixed(6)}` });
    } else if (a !== null && c !== null) {
      // Find b
      if (c <= a) { setError('Hypotenuse (c) must be greater than side a'); return; }
      const bVal = Math.sqrt(c * c - a * a);
      setResult({ label: 'Side b', value: bVal, formula: `b = √(${c}² - ${a}²) = √(${c*c} - ${a*a}) = ${bVal.toFixed(6)}` });
    } else if (b !== null && c !== null) {
      // Find a
      if (c <= b) { setError('Hypotenuse (c) must be greater than side b'); return; }
      const aVal = Math.sqrt(c * c - b * b);
      setResult({ label: 'Side a', value: aVal, formula: `a = √(${c}² - ${b}²) = √(${c*c} - ${b*b}) = ${aVal.toFixed(6)}` });
    }
  }

  const copyText = result ? `${result.label}: ${result.value.toFixed(6)}\nFormula: ${result.formula}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label className="block text-sm font-medium text-gray-700 mb-3" id={`${toolId}-label`}>
          Enter two sides of a right triangle for {toolName}
        </label>
        <p className="text-xs text-gray-500 mb-3">Formula: a² + b² = c² (leave one field empty to calculate it)</p>
        <div className="grid grid-cols-3 gap-3" aria-labelledby={`${toolId}-label`}>
          <div>
            <label htmlFor={`${toolId}-a`} className="block text-xs text-gray-500 mb-1">Side a</label>
            <input
              id={`${toolId}-a`}
              type="text"
              inputMode="decimal"
              value={sideA}
              onChange={(e) => setSideA(e.target.value)}
              placeholder="e.g. 3"
              aria-label="Side a length"
              className="input-field text-sm"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-b`} className="block text-xs text-gray-500 mb-1">Side b</label>
            <input
              id={`${toolId}-b`}
              type="text"
              inputMode="decimal"
              value={sideB}
              onChange={(e) => setSideB(e.target.value)}
              placeholder="e.g. 4"
              aria-label="Side b length"
              className="input-field text-sm"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-c`} className="block text-xs text-gray-500 mb-1">Hypotenuse c</label>
            <input
              id={`${toolId}-c`}
              type="text"
              inputMode="decimal"
              value={sideC}
              onChange={(e) => setSideC(e.target.value)}
              placeholder="e.g. 5"
              aria-label="Hypotenuse c length"
              className="input-field text-sm"
            />
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate missing side" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-blue-600">{result.value.toFixed(4)}</div>
              <div className="text-sm text-gray-500 mt-1">{result.label}</div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono text-center">
              {result.formula}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
