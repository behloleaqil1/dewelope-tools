'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TaylorSeriesCalculator - Calculate Taylor series approximation for sin, cos, and exp.
 */
export default function TaylorSeriesCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [func, setFunc] = useState<'sin' | 'cos' | 'exp'>('sin');
  const [xValue, setXValue] = useState('');
  const [terms, setTerms] = useState('10');
  const [result, setResult] = useState<{ approximation: string; actual: string; error: string; termDetails: string[] } | null>(null);
  const [error, setError] = useState('');

  const factorial = (n: number): number => {
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  };

  const calculate = () => {
    setError('');
    setResult(null);

    const x = parseFloat(xValue);
    const n = parseInt(terms);

    if (isNaN(x)) {
      setError('Please enter a valid number for x.');
      return;
    }

    if (isNaN(n) || n < 1 || n > 20) {
      setError('Number of terms must be between 1 and 20.');
      return;
    }

    let approx = 0;
    const termDetails: string[] = [];

    for (let i = 0; i < n; i++) {
      let term = 0;
      if (func === 'sin') {
        // sin(x) = x - x³/3! + x⁵/5! - ...
        const power = 2 * i + 1;
        const sign = i % 2 === 0 ? 1 : -1;
        term = sign * Math.pow(x, power) / factorial(power);
        termDetails.push(`${sign > 0 ? '+' : '-'} x^${power}/${power}! = ${term.toExponential(6)}`);
      } else if (func === 'cos') {
        // cos(x) = 1 - x²/2! + x⁴/4! - ...
        const power = 2 * i;
        const sign = i % 2 === 0 ? 1 : -1;
        term = sign * Math.pow(x, power) / factorial(power);
        termDetails.push(`${sign > 0 ? '+' : '-'} x^${power}/${power}! = ${term.toExponential(6)}`);
      } else {
        // exp(x) = 1 + x + x²/2! + x³/3! + ...
        term = Math.pow(x, i) / factorial(i);
        termDetails.push(`+ x^${i}/${i}! = ${term.toExponential(6)}`);
      }
      approx += term;
    }

    let actual = 0;
    if (func === 'sin') actual = Math.sin(x);
    else if (func === 'cos') actual = Math.cos(x);
    else actual = Math.exp(x);

    const absError = Math.abs(approx - actual);

    setResult({
      approximation: approx.toPrecision(12),
      actual: actual.toPrecision(12),
      error: absError.toExponential(6),
      termDetails,
    });
  };

  const copyText = result
    ? `Function: ${func}(${xValue})\nTerms: ${terms}\nApproximation: ${result.approximation}\nActual: ${result.actual}\nAbsolute Error: ${result.error}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-func`} className="block text-sm font-medium text-gray-700 mb-1">Function</label>
              <select id={`${toolId}-func`} value={func} onChange={(e) => setFunc(e.target.value as 'sin' | 'cos' | 'exp')} aria-label={`Function for ${toolName}`} className="input-field">
                <option value="sin">sin(x)</option>
                <option value="cos">cos(x)</option>
                <option value="exp">exp(x)</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-x`} className="block text-sm font-medium text-gray-700 mb-1">Value of x</label>
              <input id={`${toolId}-x`} type="text" inputMode="decimal" value={xValue} onChange={(e) => setXValue(e.target.value)} placeholder="e.g. 1.5708" aria-label="Value of x" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-terms`} className="block text-sm font-medium text-gray-700 mb-1">Number of Terms (1-20)</label>
              <input id={`${toolId}-terms`} type="number" min="1" max="20" value={terms} onChange={(e) => setTerms(e.target.value)} aria-label="Number of terms" className="input-field" />
            </div>
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} className="btn-primary" aria-label="Calculate Taylor series">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600 font-mono">{result.approximation}</div>
                <div className="text-xs text-gray-500 mt-1">Taylor Approximation</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-green-600 font-mono">{result.actual}</div>
                <div className="text-xs text-gray-500 mt-1">Actual Value</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-orange-600 font-mono">{result.error}</div>
                <div className="text-xs text-gray-500 mt-1">Absolute Error</div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-2">Term Breakdown:</div>
              <div className="text-xs font-mono text-gray-600 space-y-0.5 max-h-40 overflow-y-auto">
                {result.termDetails.map((t, i) => <div key={i}>{t}</div>)}
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
