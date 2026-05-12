'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BoxPlotCalculator - Calculate box plot values (min, Q1, median, Q3, max, whiskers, outliers).
 */
export default function BoxPlotCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    min: number; q1: number; median: number; q3: number; max: number;
    iqr: number; lowerWhisker: number; upperWhisker: number;
    outliers: number[]; count: number;
  } | null>(null);

  function getQuartile(sorted: number[], q: number): number {
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
      return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    }
    return sorted[base];
  }

  const calculate = () => {
    setError('');
    setResult(null);

    const numbers = input
      .split(/[\s,;]+/)
      .map(s => s.trim())
      .filter(s => s !== '')
      .map(Number);

    if (numbers.length < 4) {
      setError('Please enter at least 4 numbers (separated by commas, spaces, or newlines)');
      return;
    }

    if (numbers.some(isNaN)) {
      setError('All values must be valid numbers');
      return;
    }

    const sorted = [...numbers].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const median = getQuartile(sorted, 0.5);
    const q1 = getQuartile(sorted, 0.25);
    const q3 = getQuartile(sorted, 0.75);
    const iqr = q3 - q1;
    const lowerFence = q1 - 1.5 * iqr;
    const upperFence = q3 + 1.5 * iqr;
    const lowerWhisker = sorted.find(v => v >= lowerFence) ?? min;
    const upperWhisker = [...sorted].reverse().find(v => v <= upperFence) ?? max;
    const outliers = sorted.filter(v => v < lowerFence || v > upperFence);

    setResult({ min, q1, median, q3, max, iqr, lowerWhisker, upperWhisker, outliers, count: numbers.length });
  };

  const copyText = result
    ? `Box Plot Summary (n=${result.count})\nMin: ${result.min}\nQ1: ${result.q1}\nMedian: ${result.median}\nQ3: ${result.q3}\nMax: ${result.max}\nIQR: ${result.iqr}\nLower Whisker: ${result.lowerWhisker}\nUpper Whisker: ${result.upperWhisker}\nOutliers: ${result.outliers.length > 0 ? result.outliers.join(', ') : 'None'}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter data values (comma, space, or newline separated)
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 2, 5, 7, 8, 12, 14, 15, 18, 22, 35"
          aria-label={`Data input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <button onClick={calculate} aria-label="Calculate box plot" className="btn-primary">
        Calculate Box Plot
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600">{result.min}</div>
                <div className="text-xs text-gray-500">Min</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-green-600">{result.q1.toFixed(2)}</div>
                <div className="text-xs text-gray-500">Q1 (25th)</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-purple-600">{result.median.toFixed(2)}</div>
                <div className="text-xs text-gray-500">Median</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-green-600">{result.q3.toFixed(2)}</div>
                <div className="text-xs text-gray-500">Q3 (75th)</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600">{result.max}</div>
                <div className="text-xs text-gray-500">Max</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-orange-600">{result.iqr.toFixed(2)}</div>
                <div className="text-xs text-gray-500">IQR</div>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm">
              <p><strong>Lower Whisker:</strong> {result.lowerWhisker} (fence: {(result.q1 - 1.5 * result.iqr).toFixed(2)})</p>
              <p><strong>Upper Whisker:</strong> {result.upperWhisker} (fence: {(result.q3 + 1.5 * result.iqr).toFixed(2)})</p>
              <p><strong>Outliers:</strong> {result.outliers.length > 0 ? result.outliers.join(', ') : 'None'}</p>
              <p><strong>Data Points:</strong> {result.count}</p>
            </div>

            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
