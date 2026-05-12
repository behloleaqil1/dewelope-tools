'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * OutlierDetector - Detect outliers using the IQR method.
 * Identifies mild and extreme outliers in a dataset using 1.5×IQR and 3×IQR fences.
 */
export default function OutlierDetector({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [multiplier, setMultiplier] = useState('1.5');
  const [result, setResult] = useState<{
    sorted: number[];
    q1: number;
    q3: number;
    iqr: number;
    lowerFence: number;
    upperFence: number;
    outliers: number[];
    inliers: number[];
  } | null>(null);
  const [error, setError] = useState('');

  const getQuartile = (sorted: number[], percentile: number): number => {
    const index = (percentile / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    if (lower === upper) return sorted[lower];
    return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
  };

  const detect = () => {
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

    const k = parseFloat(multiplier) || 1.5;
    const sorted = [...values].sort((a, b) => a - b);
    const q1 = getQuartile(sorted, 25);
    const q3 = getQuartile(sorted, 75);
    const iqr = q3 - q1;
    const lowerFence = q1 - k * iqr;
    const upperFence = q3 + k * iqr;

    const outliers = sorted.filter(v => v < lowerFence || v > upperFence);
    const inliers = sorted.filter(v => v >= lowerFence && v <= upperFence);

    setResult({ sorted, q1, q3, iqr, lowerFence, upperFence, outliers, inliers });
  };

  const copyText = result
    ? `Dataset: ${result.sorted.join(', ')}\nQ1: ${result.q1.toFixed(2)}\nQ3: ${result.q3.toFixed(2)}\nIQR: ${result.iqr.toFixed(2)}\nLower Fence: ${result.lowerFence.toFixed(2)}\nUpper Fence: ${result.upperFence.toFixed(2)}\nOutliers: ${result.outliers.length > 0 ? result.outliers.join(', ') : 'None'}\nInliers: ${result.inliers.join(', ')}`
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
          placeholder="e.g. 2, 4, 5, 6, 7, 8, 9, 50"
          aria-label={`Data input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-multiplier`} className="block text-sm font-medium text-gray-700 mb-1">
          IQR Multiplier (1.5 = mild, 3 = extreme)
        </label>
        <select
          id={`${toolId}-multiplier`}
          value={multiplier}
          onChange={(e) => setMultiplier(e.target.value)}
          aria-label={`IQR multiplier for ${toolName}`}
          className="input-field"
        >
          <option value="1.5">1.5× IQR (Mild outliers)</option>
          <option value="3">3× IQR (Extreme outliers)</option>
        </select>
      </InputArea>

      <button onClick={detect} className="btn-primary" aria-label="Detect outliers">
        Detect Outliers
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.lowerFence.toFixed(2)}</div>
                <div className="text-xs text-gray-500">Lower Fence</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.upperFence.toFixed(2)}</div>
                <div className="text-xs text-gray-500">Upper Fence</div>
              </div>
            </div>

            {result.outliers.length > 0 ? (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="font-medium text-red-800 mb-1">
                  {result.outliers.length} Outlier{result.outliers.length > 1 ? 's' : ''} Detected:
                </p>
                <p className="font-mono text-sm text-red-700">{result.outliers.join(', ')}</p>
              </div>
            ) : (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="font-medium text-green-800">No outliers detected in this dataset.</p>
              </div>
            )}

            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="font-medium mb-1">Method:</p>
              <p className="font-mono text-xs">Q1 = {result.q1.toFixed(2)}, Q3 = {result.q3.toFixed(2)}, IQR = {result.iqr.toFixed(2)}</p>
              <p className="font-mono text-xs mt-1">Lower Fence = Q1 − {multiplier}×IQR = {result.lowerFence.toFixed(2)}</p>
              <p className="font-mono text-xs">Upper Fence = Q3 + {multiplier}×IQR = {result.upperFence.toFixed(2)}</p>
              <p className="text-xs mt-2">Values outside [{result.lowerFence.toFixed(2)}, {result.upperFence.toFixed(2)}] are outliers.</p>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
