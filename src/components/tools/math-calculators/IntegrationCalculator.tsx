'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * IntegrationCalculator - Numerical integration using Simpson's rule.
 * Approximates the definite integral of f(x) from a to b.
 */
export default function IntegrationCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [formula, setFormula] = useState('');
  const [lowerBound, setLowerBound] = useState('');
  const [upperBound, setUpperBound] = useState('');
  const [intervals, setIntervals] = useState('100');
  const [result, setResult] = useState<{ value: number; method: string } | null>(null);
  const [error, setError] = useState('');

  const evaluateFormula = (expr: string, x: number): number => {
    const sanitized = expr
      .replace(/\bx\b/g, `(${x})`)
      .replace(/\^/g, '**')
      .replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/abs\(/g, 'Math.abs(')
      .replace(/sin\(/g, 'Math.sin(')
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(')
      .replace(/log\(/g, 'Math.log(')
      .replace(/ln\(/g, 'Math.log(')
      .replace(/exp\(/g, 'Math.exp(')
      .replace(/pi/g, 'Math.PI')
      .replace(/e(?![a-z])/g, 'Math.E');

    // eslint-disable-next-line no-new-func
    const fn = new Function(`return (${sanitized})`);
    return fn();
  };

  const calculate = () => {
    setError('');
    setResult(null);

    const a = parseFloat(lowerBound);
    const b = parseFloat(upperBound);
    let n = parseInt(intervals) || 100;

    if (isNaN(a) || isNaN(b)) {
      setError('Please enter valid numeric bounds.');
      return;
    }

    if (a >= b) {
      setError('Lower bound must be less than upper bound.');
      return;
    }

    if (!formula.trim()) {
      setError('Please enter a formula using variable x.');
      return;
    }

    // Simpson's rule requires even number of intervals
    if (n % 2 !== 0) n += 1;
    n = Math.min(n, 10000);

    try {
      const h = (b - a) / n;
      let sum = evaluateFormula(formula, a) + evaluateFormula(formula, b);

      for (let i = 1; i < n; i++) {
        const x = a + i * h;
        const fx = evaluateFormula(formula, x);
        if (!isFinite(fx)) {
          setError(`Function is undefined or infinite at x ≈ ${x.toFixed(4)}.`);
          return;
        }
        sum += (i % 2 === 0 ? 2 : 4) * fx;
      }

      const integral = (h / 3) * sum;

      if (!isFinite(integral)) {
        setError('Integration result is not finite. Check your function and bounds.');
        return;
      }

      setResult({ value: integral, method: `Simpson's Rule (n=${n})` });
    } catch {
      setError('Invalid formula. Use variable x with operators +, -, *, /, ^, sqrt(), sin(), cos(), log(), exp().');
    }
  };

  const copyText = result ? `∫ f(x) dx from ${lowerBound} to ${upperBound}\nf(x) = ${formula}\nMethod: ${result.method}\nResult ≈ ${result.value}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-formula`} className="block text-sm font-medium text-gray-700 mb-1">Function f(x)</label>
            <input id={`${toolId}-formula`} type="text" value={formula} onChange={(e) => setFormula(e.target.value)} placeholder="x^2, sin(x), exp(-x^2), 1/x" aria-label={`Function for ${toolName}`} className="input-field font-mono" />
            <p className="text-xs text-gray-500 mt-1">Use x as variable. Supports: +, -, *, /, ^, sqrt(), sin(), cos(), tan(), log(), ln(), exp(), pi, e</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-lower`} className="block text-sm font-medium text-gray-700 mb-1">Lower Bound (a)</label>
              <input id={`${toolId}-lower`} type="text" inputMode="decimal" value={lowerBound} onChange={(e) => setLowerBound(e.target.value)} placeholder="0" aria-label="Lower bound" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-upper`} className="block text-sm font-medium text-gray-700 mb-1">Upper Bound (b)</label>
              <input id={`${toolId}-upper`} type="text" inputMode="decimal" value={upperBound} onChange={(e) => setUpperBound(e.target.value)} placeholder="1" aria-label="Upper bound" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-n`} className="block text-sm font-medium text-gray-700 mb-1">Intervals (n)</label>
              <input id={`${toolId}-n`} type="number" min="2" max="10000" value={intervals} onChange={(e) => setIntervals(e.target.value)} aria-label="Number of intervals" className="input-field" />
            </div>
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} className="btn-primary" aria-label="Calculate integral">Calculate ∫</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-sm text-gray-500 mb-1">∫ f(x) dx from {lowerBound} to {upperBound}</div>
              <div className="text-3xl font-bold text-blue-600">{result.value.toLocaleString(undefined, { maximumFractionDigits: 10 })}</div>
              <div className="text-xs text-gray-500 mt-2">Method: {result.method}</div>
            </div>
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-200">
              Note: This is a numerical approximation. Increase intervals for higher accuracy. Results may be inaccurate near singularities.
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
