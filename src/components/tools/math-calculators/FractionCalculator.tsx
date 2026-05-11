'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FractionCalculator - Performs arithmetic operations on fractions.
 * Supports add, subtract, multiply, and divide with simplified results.
 */
export default function FractionCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [num1, setNum1] = useState('1');
  const [den1, setDen1] = useState('2');
  const [num2, setNum2] = useState('1');
  const [den2, setDen2] = useState('3');
  const [operation, setOperation] = useState<'+' | '-' | '×' | '÷'>('+');
  const [result, setResult] = useState<{ num: number; den: number; decimal: number; formula: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function gcd(a: number, b: number): number {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) { [a, b] = [b, a % b]; }
    return a;
  }

  function simplify(num: number, den: number): [number, number] {
    if (den === 0) return [num, den];
    if (num === 0) return [0, 1];
    const g = gcd(Math.abs(num), Math.abs(den));
    let sNum = num / g;
    let sDen = den / g;
    if (sDen < 0) { sNum = -sNum; sDen = -sDen; }
    return [sNum, sDen];
  }

  function calculate() {
    setError(undefined);
    setResult(null);

    const n1 = parseInt(num1), d1 = parseInt(den1);
    const n2 = parseInt(num2), d2 = parseInt(den2);

    if (isNaN(n1) || isNaN(d1) || isNaN(n2) || isNaN(d2)) {
      setError('All fields must be valid integers');
      return;
    }
    if (d1 === 0 || d2 === 0) {
      setError('Denominators cannot be zero');
      return;
    }

    let resNum: number, resDen: number;
    let formula: string;

    switch (operation) {
      case '+':
        resNum = n1 * d2 + n2 * d1;
        resDen = d1 * d2;
        formula = `${n1}/${d1} + ${n2}/${d2} = (${n1}×${d2} + ${n2}×${d1}) / (${d1}×${d2})`;
        break;
      case '-':
        resNum = n1 * d2 - n2 * d1;
        resDen = d1 * d2;
        formula = `${n1}/${d1} - ${n2}/${d2} = (${n1}×${d2} - ${n2}×${d1}) / (${d1}×${d2})`;
        break;
      case '×':
        resNum = n1 * n2;
        resDen = d1 * d2;
        formula = `${n1}/${d1} × ${n2}/${d2} = (${n1}×${n2}) / (${d1}×${d2})`;
        break;
      case '÷':
        if (n2 === 0) { setError('Cannot divide by zero'); return; }
        resNum = n1 * d2;
        resDen = d1 * n2;
        formula = `${n1}/${d1} ÷ ${n2}/${d2} = (${n1}×${d2}) / (${d1}×${n2})`;
        break;
    }

    const [sNum, sDen] = simplify(resNum, resDen);
    const decimal = sNum / sDen;

    setResult({ num: sNum, den: sDen, decimal, formula });
  }

  const copyText = result
    ? `${result.num}/${result.den} = ${result.decimal.toFixed(6)}\n${result.formula}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label className="block text-sm font-medium text-gray-700 mb-3" id={`${toolId}-label`}>
          Enter fractions for {toolName}
        </label>
        <div className="flex items-center gap-3 flex-wrap" aria-labelledby={`${toolId}-label`}>
          {/* Fraction 1 */}
          <div className="flex flex-col items-center">
            <input
              type="text"
              inputMode="numeric"
              value={num1}
              onChange={(e) => setNum1(e.target.value)}
              aria-label="First numerator"
              className="input-field w-16 text-center text-sm"
            />
            <div className="w-16 h-px bg-gray-800 my-1" />
            <input
              type="text"
              inputMode="numeric"
              value={den1}
              onChange={(e) => setDen1(e.target.value)}
              aria-label="First denominator"
              className="input-field w-16 text-center text-sm"
            />
          </div>

          {/* Operation */}
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value as typeof operation)}
            aria-label="Operation"
            className="input-field w-16 text-center text-lg font-bold"
          >
            <option value="+">+</option>
            <option value="-">−</option>
            <option value="×">×</option>
            <option value="÷">÷</option>
          </select>

          {/* Fraction 2 */}
          <div className="flex flex-col items-center">
            <input
              type="text"
              inputMode="numeric"
              value={num2}
              onChange={(e) => setNum2(e.target.value)}
              aria-label="Second numerator"
              className="input-field w-16 text-center text-sm"
            />
            <div className="w-16 h-px bg-gray-800 my-1" />
            <input
              type="text"
              inputMode="numeric"
              value={den2}
              onChange={(e) => setDen2(e.target.value)}
              aria-label="Second denominator"
              className="input-field w-16 text-center text-sm"
            />
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate fraction" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {result.den === 1 ? result.num : `${result.num}/${result.den}`}
                </div>
                <div className="text-xs text-gray-500 mt-1">Simplified Fraction</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{result.decimal.toFixed(6)}</div>
                <div className="text-xs text-gray-500 mt-1">Decimal</div>
              </div>
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
