'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CorrelationCalculator - Calculate Pearson correlation coefficient.
 * r = Σ((xi - x̄)(yi - ȳ)) / √(Σ(xi - x̄)² × Σ(yi - ȳ)²)
 */
export default function CorrelationCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [xValues, setXValues] = useState('');
  const [yValues, setYValues] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ r: number; rSquared: number; n: number; interpretation: string } | null>(null);

  const calculate = () => {
    setError('');
    setResult(null);

    const xArr = xValues.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    const yArr = yValues.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));

    if (xArr.length < 3) { setError('Enter at least 3 X values (comma-separated)'); return; }
    if (yArr.length < 3) { setError('Enter at least 3 Y values (comma-separated)'); return; }
    if (xArr.length !== yArr.length) { setError('X and Y must have the same number of values'); return; }

    const n = xArr.length;
    const xMean = xArr.reduce((a, b) => a + b, 0) / n;
    const yMean = yArr.reduce((a, b) => a + b, 0) / n;

    let numerator = 0;
    let denomX = 0;
    let denomY = 0;

    for (let i = 0; i < n; i++) {
      const dx = xArr[i] - xMean;
      const dy = yArr[i] - yMean;
      numerator += dx * dy;
      denomX += dx * dx;
      denomY += dy * dy;
    }

    const denominator = Math.sqrt(denomX * denomY);
    if (denominator === 0) { setError('Cannot compute correlation: one or both variables have zero variance'); return; }

    const r = numerator / denominator;
    const rSquared = r * r;

    let interpretation = '';
    const absR = Math.abs(r);
    if (absR >= 0.9) interpretation = 'Very strong';
    else if (absR >= 0.7) interpretation = 'Strong';
    else if (absR >= 0.5) interpretation = 'Moderate';
    else if (absR >= 0.3) interpretation = 'Weak';
    else interpretation = 'Very weak / No';

    interpretation += r >= 0 ? ' positive correlation' : ' negative correlation';

    setResult({ r, rSquared, n, interpretation });
  };

  const copyText = result
    ? `Pearson r = ${result.r.toFixed(6)}\nR² = ${result.rSquared.toFixed(6)}\nn = ${result.n}\nInterpretation: ${result.interpretation}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-x`} className="block text-sm font-medium text-gray-700 mb-1">X Values (comma-separated)</label>
            <input id={`${toolId}-x`} type="text" value={xValues} onChange={(e) => setXValues(e.target.value)} placeholder="e.g. 1, 2, 3, 4, 5" aria-label={`X values for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-y`} className="block text-sm font-medium text-gray-700 mb-1">Y Values (comma-separated)</label>
            <input id={`${toolId}-y`} type="text" value={yValues} onChange={(e) => setYValues(e.target.value)} placeholder="e.g. 2, 4, 5, 4, 5" aria-label={`Y values for ${toolName}`} className="input-field" />
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate correlation" className="btn-primary">Calculate Correlation</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className={`text-2xl font-bold ${result.r >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{result.r.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Pearson r</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{result.rSquared.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">R²</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-700">{result.n}</div>
                <div className="text-xs text-gray-500 mt-1">Data Points</div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Interpretation</h4>
              <p className="text-sm text-gray-600">{result.interpretation}</p>
              <p className="text-xs text-gray-400 mt-1">R² = {(result.rSquared * 100).toFixed(2)}% of variance in Y is explained by X</p>
            </div>

            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              r = Σ((xi - x̄)(yi - ȳ)) / √(Σ(xi - x̄)² × Σ(yi - ȳ)²)
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
