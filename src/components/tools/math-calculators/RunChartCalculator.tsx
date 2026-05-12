'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RunChartCalculator - Generates run chart data with median and run analysis.
 * Calculates number of runs, expected runs, and identifies non-random patterns.
 */
export default function RunChartCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<{
    data: number[];
    median: number;
    runs: number;
    expectedRuns: number;
    aboveMedian: number;
    belowMedian: number;
    longestRun: number;
    isRandom: boolean;
  } | null>(null);
  const [error, setError] = useState<string | undefined>();

  const calculate = () => {
    const values = input
      .split(/[\n,;\s]+/)
      .map(v => v.trim())
      .filter(v => v !== '')
      .map(v => parseFloat(v));

    if (values.length < 3) {
      setError('Please enter at least 3 numeric data points (comma, space, or newline separated)');
      setOutput(null);
      return;
    }

    if (values.some(isNaN)) {
      setError('All values must be valid numbers');
      setOutput(null);
      return;
    }

    setError(undefined);

    // Calculate median
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];

    // Count runs (sequences above or below median)
    let runs = 1;
    let aboveMedian = 0;
    let belowMedian = 0;
    let currentRunLength = 1;
    let longestRun = 1;

    const positions = values.map(v => {
      if (v > median) { aboveMedian++; return 'above'; }
      if (v < median) { belowMedian++; return 'below'; }
      return 'on';
    });

    // Filter out values on the median for run analysis
    const filtered = positions.filter(p => p !== 'on');

    if (filtered.length > 1) {
      runs = 1;
      currentRunLength = 1;
      longestRun = 1;
      for (let i = 1; i < filtered.length; i++) {
        if (filtered[i] !== filtered[i - 1]) {
          runs++;
          currentRunLength = 1;
        } else {
          currentRunLength++;
          longestRun = Math.max(longestRun, currentRunLength);
        }
      }
    }

    // Expected number of runs
    const n1 = aboveMedian;
    const n2 = belowMedian;
    const n = n1 + n2;
    const expectedRuns = n > 0 ? (2 * n1 * n2) / n + 1 : 0;

    // Simple randomness check: runs should be within expected range
    const isRandom = n > 0 && runs >= expectedRuns * 0.5 && runs <= expectedRuns * 1.5 && longestRun <= 7;

    setOutput({
      data: values,
      median,
      runs,
      expectedRuns,
      aboveMedian,
      belowMedian,
      longestRun,
      isRandom,
    });
  };

  const copyText = output
    ? `Run Chart Analysis\nData Points: ${output.data.length}\nMedian: ${output.median.toFixed(4)}\nNumber of Runs: ${output.runs}\nExpected Runs: ${output.expectedRuns.toFixed(2)}\nLongest Run: ${output.longestRun}\nAbove Median: ${output.aboveMedian}\nBelow Median: ${output.belowMedian}\nRandomness: ${output.isRandom ? 'Pattern appears random' : 'Non-random pattern detected'}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Data Points (comma, space, or newline separated)
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 12.5, 13.1, 11.8, 14.2, 12.9, 13.5, 11.2, 14.8..."
          aria-label={`Data input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <button onClick={calculate} aria-label="Calculate run chart" className="btn-primary">
        Analyze Runs
      </button>

      <OutputArea hasContent={output !== null}>
        {output && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{output.data.length}</div>
                <div className="text-xs text-gray-500">Data Points</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{output.median.toFixed(4)}</div>
                <div className="text-xs text-gray-500">Median</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-purple-600">{output.runs}</div>
                <div className="text-xs text-gray-500">Runs</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-purple-600">{output.expectedRuns.toFixed(2)}</div>
                <div className="text-xs text-gray-500">Expected Runs</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-green-600">{output.aboveMedian}</div>
                <div className="text-xs text-gray-500">Above Median</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-red-600">{output.belowMedian}</div>
                <div className="text-xs text-gray-500">Below Median</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-orange-600">{output.longestRun}</div>
                <div className="text-xs text-gray-500">Longest Run</div>
              </div>
            </div>
            <div className={`p-3 rounded-lg border ${output.isRandom ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
              <span className={`text-sm font-medium ${output.isRandom ? 'text-green-700' : 'text-yellow-700'}`}>
                {output.isRandom ? '✓ Pattern appears random (process is stable)' : '⚠ Non-random pattern detected (investigate process)'}
              </span>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
