'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * StandardDeviationCalculator - Calculate standard deviation, variance, mean, and z-scores.
 * Supports both population and sample standard deviation.
 */
export default function StandardDeviationCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'population' | 'sample'>('population');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    mean: number;
    variance: number;
    stdDev: number;
    count: number;
    sum: number;
    zScores: { value: number; z: number }[];
  } | null>(null);

  const calculate = () => {
    const numbers = input
      .split(/[,\s\n]+/)
      .map((s) => s.trim())
      .filter((s) => s !== '')
      .map(Number);

    if (numbers.length < 2) {
      setError('Please enter at least 2 numbers separated by commas, spaces, or newlines.');
      setResult(null);
      return;
    }

    if (numbers.some(isNaN)) {
      setError('All values must be valid numbers.');
      setResult(null);
      return;
    }

    setError('');
    const count = numbers.length;
    const sum = numbers.reduce((a, b) => a + b, 0);
    const mean = sum / count;
    const squaredDiffs = numbers.map((n) => (n - mean) ** 2);
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / (mode === 'population' ? count : count - 1);
    const stdDev = Math.sqrt(variance);
    const zScores = numbers.map((value) => ({
      value,
      z: stdDev === 0 ? 0 : (value - mean) / stdDev,
    }));

    setResult({ mean, variance, stdDev, count, sum, zScores });
  };

  const copyText = result
    ? `Mean: ${result.mean.toFixed(4)}\nVariance: ${result.variance.toFixed(4)}\nStandard Deviation (${mode}): ${result.stdDev.toFixed(4)}\nCount: ${result.count}\nSum: ${result.sum}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => { setMode('population'); setResult(null); }}
          className={`px-4 py-2 rounded text-sm font-medium ${mode === 'population' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          aria-label="Population standard deviation"
        >
          Population (σ)
        </button>
        <button
          onClick={() => { setMode('sample'); setResult(null); }}
          className={`px-4 py-2 rounded text-sm font-medium ${mode === 'sample' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          aria-label="Sample standard deviation"
        >
          Sample (s)
        </button>
      </div>

      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter numbers (comma, space, or newline separated)
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => { setInput(e.target.value); if (error) setError(''); }}
          placeholder="e.g. 10, 20, 30, 40, 50"
          aria-label={`Number input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <button onClick={calculate} className="btn-primary" aria-label="Calculate standard deviation">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.stdDev.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Std Deviation</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.variance.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Variance</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.mean.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Mean</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-700">{result.count}</div>
                <div className="text-xs text-gray-500 mt-1">Count</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-700">{result.sum.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Sum</div>
              </div>
            </div>

            {result.zScores.length <= 20 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Z-Scores</h4>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm font-mono max-h-40 overflow-y-auto">
                  {result.zScores.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{item.value}</span>
                      <span className={item.z >= 0 ? 'text-green-600' : 'text-red-600'}>z = {item.z.toFixed(4)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
