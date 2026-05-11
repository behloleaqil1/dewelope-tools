'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AverageCalculator - Calculates mean, median, mode, range, sum, and count from a list of numbers.
 */
export default function AverageCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{
    mean: number; median: number; mode: string; range: number;
    sum: number; count: number; min: number; max: number;
  } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult(null);

    const trimmed = input.trim();
    if (!trimmed) {
      setError('Please enter numbers separated by commas, spaces, or new lines');
      return;
    }

    const numbers = trimmed
      .split(/[,\s\n]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map(Number);

    if (numbers.some(isNaN)) {
      setError('All values must be valid numbers');
      return;
    }

    if (numbers.length === 0) {
      setError('Please enter at least one number');
      return;
    }

    const sorted = [...numbers].sort((a, b) => a - b);
    const count = numbers.length;
    const sum = numbers.reduce((a, b) => a + b, 0);
    const mean = sum / count;

    // Median
    const median = count % 2 === 0
      ? (sorted[count / 2 - 1] + sorted[count / 2]) / 2
      : sorted[Math.floor(count / 2)];

    // Mode
    const freq: Record<number, number> = {};
    for (const n of numbers) freq[n] = (freq[n] || 0) + 1;
    const maxFreq = Math.max(...Object.values(freq));
    const modes = Object.entries(freq).filter(([, f]) => f === maxFreq).map(([n]) => Number(n));
    const mode = maxFreq === 1 ? 'No mode' : modes.join(', ');

    setResult({
      mean, median, mode,
      range: sorted[count - 1] - sorted[0],
      sum, count,
      min: sorted[0],
      max: sorted[count - 1],
    });
  }

  const copyText = result
    ? `Mean: ${result.mean.toFixed(4)}\nMedian: ${result.median.toFixed(4)}\nMode: ${result.mode}\nRange: ${result.range}\nSum: ${result.sum}\nCount: ${result.count}\nMin: ${result.min}\nMax: ${result.max}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter numbers for {toolName}
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter numbers separated by commas, spaces, or new lines&#10;e.g. 10, 20, 30, 40, 50"
          aria-label={`Number input for ${toolName}`}
          className="input-field h-28 resize-y font-mono text-sm"
        />
      </InputArea>

      <button onClick={calculate} aria-label="Calculate averages" className="btn-primary">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.mean.toFixed(2)}</div>
                <div className="text-xs text-gray-500">Mean</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-green-600">{result.median.toFixed(2)}</div>
                <div className="text-xs text-gray-500">Median</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-purple-600">{result.mode}</div>
                <div className="text-xs text-gray-500">Mode</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-orange-600">{result.range}</div>
                <div className="text-xs text-gray-500">Range</div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 text-center text-sm">
              <div><span className="text-gray-500">Sum:</span> <span className="font-mono font-medium">{result.sum}</span></div>
              <div><span className="text-gray-500">Count:</span> <span className="font-mono font-medium">{result.count}</span></div>
              <div><span className="text-gray-500">Min:</span> <span className="font-mono font-medium">{result.min}</span></div>
              <div><span className="text-gray-500">Max:</span> <span className="font-mono font-medium">{result.max}</span></div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
