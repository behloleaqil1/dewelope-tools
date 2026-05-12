'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * LeastCommonMultiple - Finds the LCM of multiple numbers.
 * Uses the formula LCM(a, b) = |a × b| / GCD(a, b) with the Euclidean algorithm.
 */
export default function LeastCommonMultiple({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ lcm: number; steps: string[] } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function gcd(a: number, b: number): number {
    let x = Math.abs(a);
    let y = Math.abs(b);
    while (y !== 0) {
      const temp = y;
      y = x % y;
      x = temp;
    }
    return x;
  }

  function lcm(a: number, b: number): number {
    return Math.abs(a * b) / gcd(a, b);
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

    const steps: string[] = [];
    let currentLcm = numbers[0];
    steps.push(`Starting with ${numbers[0]}`);

    for (let i = 1; i < numbers.length; i++) {
      const g = gcd(currentLcm, numbers[i]);
      const newLcm = lcm(currentLcm, numbers[i]);
      steps.push(`LCM(${currentLcm}, ${numbers[i]}) = |${currentLcm} × ${numbers[i]}| / GCD(${currentLcm}, ${numbers[i]}) = ${Math.abs(currentLcm * numbers[i])} / ${g} = ${newLcm}`);
      currentLcm = newLcm;
    }

    setResult({ lcm: currentLcm, steps });
  }

  const copyText = result
    ? `LCM(${input}) = ${result.lcm}\n\nSteps:\n${result.steps.join('\n')}`
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
          placeholder="e.g. 12, 18, 24"
          aria-label={`Numbers input for ${toolName}`}
          className="input-field font-mono"
        />
      </InputArea>

      <button onClick={handleCalculate} aria-label="Calculate LCM" className="btn-primary">
        Calculate LCM
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-blue-600">{result.lcm}</div>
              <div className="text-xs text-gray-500 mt-1">Least Common Multiple</div>
            </div>
            <details className="text-sm">
              <summary className="cursor-pointer text-gray-600 font-medium">Show Steps</summary>
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
