'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RegressionCalculator - Calculate linear regression (slope, intercept, R²).
 * Accepts comma-separated x,y data points and computes best-fit line.
 */
export default function RegressionCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    slope: number; intercept: number; rSquared: number; equation: string; n: number;
  } | null>(null);

  function calculate() {
    setError('');
    setResult(null);

    if (!input.trim()) {
      setError('Please enter data points');
      return;
    }

    const lines = input.trim().split('\n').filter(l => l.trim());
    const points: { x: number; y: number }[] = [];

    for (const line of lines) {
      const parts = line.split(/[,\t\s]+/).map(s => s.trim()).filter(Boolean);
      if (parts.length < 2) {
        setError(`Invalid line: "${line}". Use format: x, y`);
        return;
      }
      const x = parseFloat(parts[0]);
      const y = parseFloat(parts[1]);
      if (isNaN(x) || isNaN(y)) {
        setError(`Non-numeric value in: "${line}"`);
        return;
      }
      points.push({ x, y });
    }

    if (points.length < 2) {
      setError('Need at least 2 data points');
      return;
    }

    const n = points.length;
    const sumX = points.reduce((s, p) => s + p.x, 0);
    const sumY = points.reduce((s, p) => s + p.y, 0);
    const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
    const sumX2 = points.reduce((s, p) => s + p.x * p.x, 0);

    const denom = n * sumX2 - sumX * sumX;
    if (denom === 0) {
      setError('Cannot compute regression: all x values are identical');
      return;
    }

    const slope = (n * sumXY - sumX * sumY) / denom;
    const intercept = (sumY - slope * sumX) / n;

    // R² calculation
    const meanY = sumY / n;
    const ssTotal = points.reduce((s, p) => s + (p.y - meanY) ** 2, 0);
    const ssResidual = points.reduce((s, p) => s + (p.y - (slope * p.x + intercept)) ** 2, 0);
    const rSquared = ssTotal === 0 ? 1 : 1 - ssResidual / ssTotal;

    const sign = intercept >= 0 ? '+' : '-';
    const equation = `y = ${slope.toFixed(4)}x ${sign} ${Math.abs(intercept).toFixed(4)}`;

    setResult({ slope, intercept, rSquared, equation, n });
  }

  const copyText = result
    ? `Linear Regression (n=${result.n})\nEquation: ${result.equation}\nSlope: ${result.slope.toFixed(6)}\nIntercept: ${result.intercept.toFixed(6)}\nR²: ${result.rSquared.toFixed(6)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Data Points (one per line: x, y)
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"1, 2\n2, 4\n3, 5\n4, 4\n5, 5"}
          aria-label={`Data points for ${toolName}`}
          className="input-field h-40 resize-y font-mono"
        />
        <p className="text-xs text-gray-500 mt-1">Separate x and y with comma, tab, or space. One point per line.</p>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate linear regression" className="btn-primary">
        Calculate Regression
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-lg font-bold text-blue-600 font-mono">{result.equation}</div>
              <div className="text-xs text-gray-500 mt-1">Best-Fit Line Equation</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-green-600">{result.slope.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Slope (m)</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-purple-600">{result.intercept.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Intercept (b)</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-orange-600">{result.rSquared.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">R² Value</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-700">{result.n}</div>
                <div className="text-xs text-gray-500 mt-1">Data Points</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
