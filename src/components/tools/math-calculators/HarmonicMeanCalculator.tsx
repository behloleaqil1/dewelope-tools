'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HarmonicMeanCalculator - Calculates the harmonic mean of a set of numbers.
 * Formula: n / (1/x1 + 1/x2 + ... + 1/xn)
 */
export default function HarmonicMeanCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ mean: number; count: number } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    setResult(null);

    if (!input.trim()) {
      setError('Please enter numbers separated by commas or newlines');
      return;
    }

    const numbers = input
      .split(/[,\n]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map(Number);

    if (numbers.some(isNaN)) {
      setError('All values must be valid numbers');
      return;
    }

    if (numbers.some((n) => n === 0)) {
      setError('Harmonic mean is undefined when any value is zero');
      return;
    }

    if (numbers.length < 2) {
      setError('Please enter at least 2 numbers');
      return;
    }

    const sumReciprocals = numbers.reduce((sum, n) => sum + 1 / n, 0);
    const mean = numbers.length / sumReciprocals;

    setResult({ mean, count: numbers.length });
  };

  const copyText = result
    ? `Harmonic Mean: ${result.mean.toFixed(6)}\nCount: ${result.count}\nFormula: n / (Σ 1/xi)`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter numbers (comma or newline separated)
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 2, 4, 8, 16"
          aria-label={`Numbers input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button onClick={calculate} aria-label="Calculate harmonic mean" className="btn-primary">
        Calculate Harmonic Mean
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">{result.mean.toFixed(6)}</div>
              <div className="text-xs text-gray-500 mt-1">Harmonic Mean of {result.count} numbers</div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              Formula: H = n / (1/x₁ + 1/x₂ + ... + 1/xₙ)
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
