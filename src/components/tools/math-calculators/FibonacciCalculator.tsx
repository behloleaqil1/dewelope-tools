'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FibonacciCalculator - Calculate nth Fibonacci number and show the sequence.
 */
export default function FibonacciCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ nth: string; sequence: string[] } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function handleCalculate() {
    const n = parseInt(input);
    if (!input.trim() || isNaN(n) || n < 0 || n > 78) {
      setError('Please enter a valid number between 0 and 78');
      setResult(null);
      return;
    }

    setError(undefined);
    const sequence: string[] = [];
    let a = 0;
    let b = 1;

    for (let i = 0; i <= n; i++) {
      sequence.push(a.toString());
      const temp = a + b;
      a = b;
      b = temp;
    }

    setResult({
      nth: sequence[n],
      sequence: sequence,
    });
  }

  const copyText = result
    ? `F(${input}) = ${result.nth}\n\nSequence: ${result.sequence.join(', ')}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter n (position in Fibonacci sequence)
        </label>
        <input
          id={`${toolId}-input`}
          type="text"
          inputMode="numeric"
          value={input}
          onChange={(e) => { setInput(e.target.value); if (error) setError(undefined); }}
          placeholder="e.g. 10"
          aria-label={`Position input for ${toolName}`}
          className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
        />
      </InputArea>

      <button
        onClick={handleCalculate}
        aria-label="Calculate Fibonacci"
        className="px-6 py-3 text-sm font-medium rounded-md min-h-[44px] bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
              <div className="text-sm text-blue-600 font-medium">F({input})</div>
              <div className="text-3xl font-bold text-blue-800 mt-1">{result.nth}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-1">Sequence (F(0) to F({input}))</div>
              <div className="text-sm font-mono text-gray-800 break-all">{result.sequence.join(', ')}</div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
