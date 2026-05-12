'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * QuartileCalculator - Calculate Q1, Q2, Q3 quartiles and IQR from a dataset.
 * Uses the exclusive method (Tukey's hinges) for quartile calculation.
 */
export default function QuartileCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ sorted: number[]; q1: number; q2: number; q3: number; iqr: number; min: number; max: number } | null>(null);
  const [error, setError] = useState('');

  const getQuartile = (sorted: number[], percentile: number): number => {
    const index = (percentile / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    if (lower === upper) return sorted[lower];
    return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
  };

  const calculate = () => {
    setError('');
    setResult(null);

    const values = input
      .split(/[,\s\n]+/)
      .map(v => v.trim())
      .filter(Boolean)
      .map(Number);

    if (values.length < 4) {
      setError('Please enter at least 4 numbers');
      return;
    }

    if (values.some(isNaN)) {
      setError('All values must be valid numbers');
      return;
    }

    const sorted = [...values].sort((a, b) => a - b);
    const q1 = getQuartile(sorted, 25);
    const q2 = getQuartile(sorted, 50);
    const q3 = getQuartile(sorted, 75);
    const iqr = q3 - q1;

    setResult({ sorted, q1, q2, q3, iqr, min: sorted[0], max: sorted[sorted.length - 1] });
  };

  const copyText = result
    ? `Dataset (sorted): ${result.sorted.join(', ')}\nMin: ${result.min}\nQ1 (25th percentile): ${result.q1}\nQ2 (Median): ${result.q2}\nQ3 (75th percentile): ${result.q3}\nMax: ${result.max}\nIQR (Q3 - Q1): ${result.iqr}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter numbers (comma, space, or newline separated)
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => { setInput(e.target.value); if (error) setError(''); }}
          placeholder="e.g. 2, 4, 6, 8, 10, 12, 14, 16"
          aria-label={`Data input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <button onClick={calculate} className="btn-primary" aria-label="Calculate quartiles">
        Calculate Quartiles
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.min}</div>
                <div className="text-xs text-gray-500">Min</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
                <div className="text-lg font-bold text-blue-700">{result.q1.toFixed(2)}</div>
                <div className="text-xs text-blue-600">Q1 (25%)</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center">
                <div className="text-lg font-bold text-green-700">{result.q2.toFixed(2)}</div>
                <div className="text-xs text-green-600">Q2 (Median)</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 text-center">
                <div className="text-lg font-bold text-purple-700">{result.q3.toFixed(2)}</div>
                <div className="text-xs text-purple-600">Q3 (75%)</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.max}</div>
                <div className="text-xs text-gray-500">Max</div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 text-center">
                <div className="text-lg font-bold text-orange-700">{result.iqr.toFixed(2)}</div>
                <div className="text-xs text-orange-600">IQR</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="font-medium mb-1">Five-Number Summary:</p>
              <p className="font-mono text-xs">{result.min} | {result.q1.toFixed(2)} | {result.q2.toFixed(2)} | {result.q3.toFixed(2)} | {result.max}</p>
              <p className="mt-2 text-xs">IQR = Q3 − Q1 = {result.q3.toFixed(2)} − {result.q1.toFixed(2)} = {result.iqr.toFixed(2)}</p>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
