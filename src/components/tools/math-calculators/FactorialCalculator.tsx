'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FactorialCalculator - Calculate the factorial of a number with step-by-step display.
 */
export default function FactorialCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ value: string; steps: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult(null);

    const n = parseInt(input);
    if (!input.trim() || isNaN(n)) {
      setError('Please enter a valid integer');
      return;
    }
    if (n < 0) {
      setError('Factorial is not defined for negative numbers');
      return;
    }
    if (n > 170) {
      setError('Number too large (max 170 to avoid overflow)');
      return;
    }

    let factorial = BigInt(1);
    const stepParts: string[] = [];

    if (n === 0 || n === 1) {
      setResult({ value: '1', steps: `${n}! = 1` });
      return;
    }

    for (let i = n; i >= 1; i--) {
      factorial *= BigInt(i);
      stepParts.push(String(i));
    }

    const steps = `${n}! = ${stepParts.join(' × ')} = ${factorial.toString()}`;
    setResult({ value: factorial.toString(), steps });
  }

  const copyText = result ? `${input}! = ${result.value}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter a non-negative integer
        </label>
        <input
          id={`${toolId}-input`}
          type="text"
          inputMode="numeric"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 10"
          aria-label={`Number input for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <button onClick={calculate} aria-label="Calculate factorial" className="btn-primary">
        Calculate Factorial
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600 font-mono break-all">{input}! = {result.value}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <label className="block text-xs text-gray-500 mb-1">Steps</label>
              <div className="text-sm font-mono text-gray-700 break-all">{result.steps}</div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
