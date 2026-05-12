'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SummationCalculator - Calculate summation (Σ) with a custom formula.
 * Evaluates Σ f(i) from i=start to i=end.
 */
export default function SummationCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [formula, setFormula] = useState('');
  const [start, setStart] = useState('1');
  const [end, setEnd] = useState('10');
  const [result, setResult] = useState<{ sum: number; terms: string[] } | null>(null);
  const [error, setError] = useState('');

  const evaluateFormula = (expr: string, i: number): number => {
    const sanitized = expr
      .replace(/\bi\b/g, `(${i})`)
      .replace(/\^/g, '**')
      .replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/abs\(/g, 'Math.abs(')
      .replace(/sin\(/g, 'Math.sin(')
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(')
      .replace(/log\(/g, 'Math.log(')
      .replace(/pi/g, 'Math.PI')
      .replace(/e(?![a-z])/g, 'Math.E');

    // eslint-disable-next-line no-new-func
    const fn = new Function(`return (${sanitized})`);
    return fn();
  };

  const calculate = () => {
    setError('');
    setResult(null);

    const startVal = parseInt(start);
    const endVal = parseInt(end);

    if (isNaN(startVal) || isNaN(endVal)) {
      setError('Please enter valid integer bounds.');
      return;
    }

    if (endVal - startVal > 10000) {
      setError('Range too large. Maximum 10,000 terms allowed.');
      return;
    }

    if (!formula.trim()) {
      setError('Please enter a formula using variable i.');
      return;
    }

    try {
      let sum = 0;
      const terms: string[] = [];
      const showTerms = endVal - startVal <= 20;

      for (let i = startVal; i <= endVal; i++) {
        const value = evaluateFormula(formula, i);
        if (!isFinite(value)) {
          setError(`Formula produces non-finite value at i=${i}.`);
          return;
        }
        sum += value;
        if (showTerms) {
          terms.push(`f(${i}) = ${value}`);
        }
      }

      setResult({ sum, terms });
    } catch {
      setError('Invalid formula. Use variable i with operators +, -, *, /, ^, sqrt(), sin(), cos(), log().');
    }
  };

  const copyText = result ? `Σ f(i) from i=${start} to ${end}\nFormula: f(i) = ${formula}\nResult: ${result.sum}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-formula`} className="block text-sm font-medium text-gray-700 mb-1">Formula f(i)</label>
            <input id={`${toolId}-formula`} type="text" value={formula} onChange={(e) => setFormula(e.target.value)} placeholder="i^2, 1/i, 2*i+1, sqrt(i)" aria-label={`Formula for ${toolName}`} className="input-field font-mono" />
            <p className="text-xs text-gray-500 mt-1">Use i as variable. Supports: +, -, *, /, ^, sqrt(), sin(), cos(), log(), pi, e</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-start`} className="block text-sm font-medium text-gray-700 mb-1">Start (i =)</label>
              <input id={`${toolId}-start`} type="number" value={start} onChange={(e) => setStart(e.target.value)} aria-label="Start value" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-end`} className="block text-sm font-medium text-gray-700 mb-1">End (i =)</label>
              <input id={`${toolId}-end`} type="number" value={end} onChange={(e) => setEnd(e.target.value)} aria-label="End value" className="input-field" />
            </div>
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} className="btn-primary" aria-label="Calculate summation">Calculate Σ</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-sm text-gray-500 mb-1">Σ f(i) from i={start} to {end}, where f(i) = {formula}</div>
              <div className="text-3xl font-bold text-blue-600">{result.sum.toLocaleString(undefined, { maximumFractionDigits: 10 })}</div>
            </div>
            {result.terms.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Individual Terms</label>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 max-h-48 overflow-y-auto font-mono text-xs text-gray-700">
                  {result.terms.map((term, i) => (
                    <div key={i}>{term}</div>
                  ))}
                </div>
              </div>
            )}
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
