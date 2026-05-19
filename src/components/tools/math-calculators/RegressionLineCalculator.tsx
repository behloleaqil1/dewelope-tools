'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RegressionLineCalculator - Calculate linear regression line (y = mx + b) from data points.
 */
export default function RegressionLineCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dataInput, setDataInput] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ slope: number; intercept: number; rSquared: number; equation: string; formula: string } | null>(null);

  const calculate = () => {
    setError('');
    setResult(null);

    const lines = dataInput.trim().split('\n').filter((l) => l.trim());
    const points: { x: number; y: number }[] = [];

    for (const line of lines) {
      const parts = line.split(/[,\s\t]+/).map((s) => parseFloat(s.trim()));
      if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        points.push({ x: parts[0], y: parts[1] });
      }
    }

    if (points.length < 2) { setError('Enter at least 2 data points (x, y per line).'); return; }

    const n = points.length;
    const sumX = points.reduce((s, p) => s + p.x, 0);
    const sumY = points.reduce((s, p) => s + p.y, 0);
    const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
    const sumX2 = points.reduce((s, p) => s + p.x * p.x, 0);
    const _sumY2 = points.reduce((s, p) => s + p.y * p.y, 0);

    const denom = n * sumX2 - sumX * sumX;
    if (denom === 0) { setError('All x-values are the same; cannot compute regression.'); return; }

    const slope = (n * sumXY - sumX * sumY) / denom;
    const intercept = (sumY - slope * sumX) / n;

    const meanY = sumY / n;
    const ssTotal = points.reduce((s, p) => s + (p.y - meanY) ** 2, 0);
    const ssResidual = points.reduce((s, p) => s + (p.y - (slope * p.x + intercept)) ** 2, 0);
    const rSquared = ssTotal === 0 ? 1 : 1 - ssResidual / ssTotal;

    const sign = intercept >= 0 ? '+' : '-';
    const equation = `y = ${slope.toFixed(6)}x ${sign} ${Math.abs(intercept).toFixed(6)}`;

    setResult({
      slope,
      intercept,
      rSquared,
      equation,
      formula: `n = ${n}\nSlope (m) = (n·Σxy - Σx·Σy) / (n·Σx² - (Σx)²) = ${slope.toFixed(6)}\nIntercept (b) = (Σy - m·Σx) / n = ${intercept.toFixed(6)}\nR² = 1 - SS_res/SS_tot = ${rSquared.toFixed(6)}`,
    });
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-data`} className="block text-sm font-medium text-gray-700 mb-1">Data Points (x, y per line)</label>
        <textarea id={`${toolId}-data`} value={dataInput} onChange={(e) => setDataInput(e.target.value)} placeholder={"1, 2\n2, 4\n3, 5\n4, 4\n5, 5"} rows={6} aria-label={`Data points for ${toolName}`} className="input-field font-mono" />
      </InputArea>

      <button onClick={calculate} className="btn-primary" aria-label="Calculate regression line">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-sm text-gray-500">Equation</div>
              <div className="text-xl font-bold text-blue-600 font-mono">{result.equation}</div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xs text-gray-500">Slope (m)</div>
                <div className="text-lg font-bold text-blue-600">{result.slope.toFixed(4)}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xs text-gray-500">Intercept (b)</div>
                <div className="text-lg font-bold text-blue-600">{result.intercept.toFixed(4)}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xs text-gray-500">R²</div>
                <div className="text-lg font-bold text-blue-600">{result.rSquared.toFixed(4)}</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono whitespace-pre-wrap">{result.formula}</div>
            <CopyToClipboard text={`${result.equation}\nSlope: ${result.slope.toFixed(6)}\nIntercept: ${result.intercept.toFixed(6)}\nR²: ${result.rSquared.toFixed(6)}`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
