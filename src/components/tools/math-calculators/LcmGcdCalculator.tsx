'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * LcmGcdCalculator - Calculate LCM (Least Common Multiple) and GCD (Greatest Common Divisor) of two or more numbers.
 */
export default function LcmGcdCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ gcd: number; lcm: number; numbers: number[] } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function gcd(a: number, b: number): number {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      [a, b] = [b, a % b];
    }
    return a;
  }

  function lcm(a: number, b: number): number {
    return Math.abs(a * b) / gcd(a, b);
  }

  function calculate() {
    setError(undefined);
    setResult(null);

    const numbers = input
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => parseInt(s));

    if (numbers.length < 2) {
      setError('Please enter at least 2 numbers separated by commas or spaces');
      return;
    }

    if (numbers.some((n) => isNaN(n) || n === 0)) {
      setError('All values must be non-zero integers');
      return;
    }

    const resultGcd = numbers.reduce((acc, n) => gcd(acc, n));
    const resultLcm = numbers.reduce((acc, n) => lcm(acc, n));

    setResult({ gcd: resultGcd, lcm: resultLcm, numbers });
  }

  const copyText = result
    ? `Numbers: ${result.numbers.join(', ')}\nGCD: ${result.gcd}\nLCM: ${result.lcm}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter numbers (separated by commas or spaces)
        </label>
        <input
          id={`${toolId}-input`}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 12, 18, 24"
          aria-label={`Number input for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <button onClick={calculate} aria-label="Calculate LCM and GCD" className="btn-primary">
        Calculate LCM & GCD
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.gcd.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">GCD (Greatest Common Divisor)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{result.lcm.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">LCM (Least Common Multiple)</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div><span className="font-medium">Numbers:</span> {result.numbers.join(', ')}</div>
              <div className="mt-1"><span className="font-medium">GCD formula:</span> Using Euclidean algorithm</div>
              <div><span className="font-medium">LCM formula:</span> LCM(a,b) = |a×b| / GCD(a,b)</div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
