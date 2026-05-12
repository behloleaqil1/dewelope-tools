'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PercentileCalculator - Calculate percentile rank from a dataset.
 * Finds the value at a given percentile or the percentile rank of a given value.
 */
export default function PercentileCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dataInput, setDataInput] = useState('');
  const [mode, setMode] = useState<'find-percentile' | 'find-value'>('find-percentile');
  const [targetValue, setTargetValue] = useState('');
  const [targetPercentile, setTargetPercentile] = useState('');
  const [result, setResult] = useState<{
    percentile?: number;
    value?: number;
    n: number;
    min: number;
    max: number;
    q1: number;
    median: number;
    q3: number;
  } | null>(null);
  const [error, setError] = useState('');

  const getPercentileValue = (sorted: number[], p: number): number => {
    const index = (p / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    if (lower === upper) return sorted[lower];
    const fraction = index - lower;
    return sorted[lower] + fraction * (sorted[upper] - sorted[lower]);
  };

  const calculate = () => {
    setError('');
    setResult(null);

    const data = dataInput.trim().split(/[\s,]+/).map(Number).filter((n) => !isNaN(n));

    if (data.length < 2) {
      setError('Please enter at least 2 numeric values.');
      return;
    }

    const sorted = [...data].sort((a, b) => a - b);
    const n = sorted.length;
    const min = sorted[0];
    const max = sorted[n - 1];
    const q1 = getPercentileValue(sorted, 25);
    const median = getPercentileValue(sorted, 50);
    const q3 = getPercentileValue(sorted, 75);

    if (mode === 'find-percentile') {
      const val = parseFloat(targetValue);
      if (isNaN(val)) {
        setError('Please enter a valid number for the target value.');
        return;
      }
      const countBelow = sorted.filter((x) => x < val).length;
      const countEqual = sorted.filter((x) => x === val).length;
      const percentile = ((countBelow + 0.5 * countEqual) / n) * 100;
      setResult({ percentile, n, min, max, q1, median, q3 });
    } else {
      const p = parseFloat(targetPercentile);
      if (isNaN(p) || p < 0 || p > 100) {
        setError('Please enter a valid percentile between 0 and 100.');
        return;
      }
      const value = getPercentileValue(sorted, p);
      setResult({ value, n, min, max, q1, median, q3 });
    }
  };

  const copyText = result
    ? mode === 'find-percentile'
      ? `Percentile Rank: ${result.percentile?.toFixed(2)}th percentile\nDataset size: ${result.n}\nMin: ${result.min}, Q1: ${result.q1.toFixed(2)}, Median: ${result.median.toFixed(2)}, Q3: ${result.q3.toFixed(2)}, Max: ${result.max}`
      : `Value at P${targetPercentile}: ${result.value?.toFixed(4)}\nDataset size: ${result.n}\nMin: ${result.min}, Q1: ${result.q1.toFixed(2)}, Median: ${result.median.toFixed(2)}, Q3: ${result.q3.toFixed(2)}, Max: ${result.max}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-data`} className="block text-sm font-medium text-gray-700 mb-1">
          Dataset (comma or space separated)
        </label>
        <textarea
          id={`${toolId}-data`}
          value={dataInput}
          onChange={(e) => setDataInput(e.target.value)}
          placeholder="e.g. 12, 15, 18, 22, 25, 30, 35, 40, 45, 50"
          aria-label={`Dataset for ${toolName}`}
          className="input-field h-24 resize-y font-mono"
        />
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">
          Calculation Mode
        </label>
        <select
          id={`${toolId}-mode`}
          value={mode}
          onChange={(e) => setMode(e.target.value as typeof mode)}
          aria-label={`Mode for ${toolName}`}
          className="input-field"
        >
          <option value="find-percentile">Find percentile rank of a value</option>
          <option value="find-value">Find value at a given percentile</option>
        </select>
      </InputArea>

      {mode === 'find-percentile' ? (
        <InputArea>
          <label htmlFor={`${toolId}-val`} className="block text-sm font-medium text-gray-700 mb-1">
            Target Value
          </label>
          <input
            id={`${toolId}-val`}
            type="text"
            inputMode="decimal"
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
            placeholder="e.g. 30"
            aria-label={`Target value for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      ) : (
        <InputArea>
          <label htmlFor={`${toolId}-pct`} className="block text-sm font-medium text-gray-700 mb-1">
            Target Percentile (0-100)
          </label>
          <input
            id={`${toolId}-pct`}
            type="text"
            inputMode="decimal"
            value={targetPercentile}
            onChange={(e) => setTargetPercentile(e.target.value)}
            placeholder="e.g. 75"
            aria-label={`Target percentile for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      )}

      <button onClick={calculate} aria-label="Calculate percentile" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              {mode === 'find-percentile' ? (
                <>
                  <div className="text-2xl font-bold text-blue-600">{result.percentile?.toFixed(2)}th</div>
                  <div className="text-xs text-gray-500 mt-1">Percentile Rank</div>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold text-blue-600">{result.value?.toFixed(4)}</div>
                  <div className="text-xs text-gray-500 mt-1">Value at P{targetPercentile}</div>
                </>
              )}
            </div>
            <div className="grid grid-cols-5 gap-2 text-center">
              <div className="bg-gray-50 p-2 rounded border border-gray-200">
                <div className="text-sm font-bold text-gray-700">{result.min}</div>
                <div className="text-[10px] text-gray-500">Min</div>
              </div>
              <div className="bg-gray-50 p-2 rounded border border-gray-200">
                <div className="text-sm font-bold text-gray-700">{result.q1.toFixed(2)}</div>
                <div className="text-[10px] text-gray-500">Q1</div>
              </div>
              <div className="bg-gray-50 p-2 rounded border border-gray-200">
                <div className="text-sm font-bold text-gray-700">{result.median.toFixed(2)}</div>
                <div className="text-[10px] text-gray-500">Median</div>
              </div>
              <div className="bg-gray-50 p-2 rounded border border-gray-200">
                <div className="text-sm font-bold text-gray-700">{result.q3.toFixed(2)}</div>
                <div className="text-[10px] text-gray-500">Q3</div>
              </div>
              <div className="bg-gray-50 p-2 rounded border border-gray-200">
                <div className="text-sm font-bold text-gray-700">{result.max}</div>
                <div className="text-[10px] text-gray-500">Max</div>
              </div>
            </div>
            <p className="text-xs text-gray-500">Dataset size: {result.n} values</p>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
