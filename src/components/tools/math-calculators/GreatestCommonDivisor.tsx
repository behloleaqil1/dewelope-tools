'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * GreatestCommonDivisor - Finds the GCD of multiple numbers using the Euclidean algorithm.
 * Supports two or more positive integers with step-by-step calculation display.
 */
export default function GreatestCommonDivisor({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ gcd: number; steps: string[] } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function gcd(a: number, b: number): { result: number; steps: string[] } {
    const steps: string[] = [];
    let x = Math.abs(a);
    let y = Math.abs(b);
    while (y !== 0) {
      steps.push(`gcd(${x}, ${y}) → ${x} mod ${y} = ${x % y}`);
      const temp = y;
      y = x % y;
      x = temp;
    }
    steps.push(`gcd(${x}, 0) = ${x}`);
    return { result: x, steps };
  }

  function handleCalculate() {
    setError(undefined);
    setResult(null);

    const numbers = input
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => parseInt(s, 10));

    if (numbers.length < 2) {
      setError('Please enter at least 2 numbers (separated by commas or spaces)');
      return;
    }

    if (numbers.some((n) => isNaN(n) || n <= 0 || !Number.isInteger(n))) {
      setError('All values must be positive integers');
      return;
    }

    const allSteps: string[] = [];
    let currentGcd = numbers[0];
    allSteps.push(`Starting with ${numbers[0]}`);

    for (let i = 1; i < numbers.length; i++) {
      const { result: g, steps } = gcd(currentGcd, numbers[i]);
      allSteps.push(`\nComputing gcd(${currentGcd}, ${numbers[i]}):`);
      allSteps.push(...steps.map((s) => `  ${s}`));
      currentGcd = g;
    }

    setResult({ gcd: currentGcd, steps: allSteps });
  }

  const copyText = result
    ? `GCD(${input}) = ${result.gcd}\n\nSteps:\n${result.steps.join('\n')}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter Numbers (comma or space separated)
        </label>
        <input
          id={`${toolId}-input`}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 48, 36, 24"
          aria-label={`Numbers input for ${toolName}`}
          className="input-field font-mono"
        />
      </InputArea>

      <button onClick={handleCalculate} aria-label="Calculate GCD" className="btn-primary">
        Calculate GCD
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-blue-600">{result.gcd}</div>
              <div className="text-xs text-gray-500 mt-1">Greatest Common Divisor</div>
            </div>
            <details className="text-sm">
              <summary className="cursor-pointer text-gray-600 font-medium">Show Steps (Euclidean Algorithm)</summary>
              <pre className="whitespace-pre-wrap text-sm font-mono text-gray-700 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                {result.steps.join('\n')}
              </pre>
            </details>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
