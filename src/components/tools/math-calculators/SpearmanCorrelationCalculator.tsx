'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpearmanCorrelationCalculator - Calculate Spearman rank correlation coefficient.
 * Computes rho (ρ) for two ranked datasets using the formula: ρ = 1 - (6Σd²) / (n(n²-1))
 */
export default function SpearmanCorrelationCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [xValues, setXValues] = useState('');
  const [yValues, setYValues] = useState('');
  const [result, setResult] = useState<{ rho: number; n: number; tStat: number; interpretation: string } | null>(null);
  const [error, setError] = useState('');

  const getRanks = (values: number[]): number[] => {
    const sorted = values.map((v, i) => ({ value: v, index: i })).sort((a, b) => a.value - b.value);
    const ranks = new Array(values.length);

    let i = 0;
    while (i < sorted.length) {
      let j = i;
      while (j < sorted.length && sorted[j].value === sorted[i].value) j++;
      const avgRank = (i + 1 + j) / 2;
      for (let k = i; k < j; k++) {
        ranks[sorted[k].index] = avgRank;
      }
      i = j;
    }
    return ranks;
  };

  const calculate = () => {
    setError('');
    setResult(null);

    const x = xValues.trim().split(/[\s,]+/).map(Number).filter((n) => !isNaN(n));
    const y = yValues.trim().split(/[\s,]+/).map(Number).filter((n) => !isNaN(n));

    if (x.length < 3 || y.length < 3) {
      setError('Please enter at least 3 values for each dataset.');
      return;
    }

    if (x.length !== y.length) {
      setError(`Datasets must have equal length. X has ${x.length} values, Y has ${y.length}.`);
      return;
    }

    const n = x.length;
    const ranksX = getRanks(x);
    const ranksY = getRanks(y);

    const dSquaredSum = ranksX.reduce((sum, rx, i) => {
      const d = rx - ranksY[i];
      return sum + d * d;
    }, 0);

    const rho = 1 - (6 * dSquaredSum) / (n * (n * n - 1));

    // t-statistic for significance testing
    const tStat = rho * Math.sqrt((n - 2) / (1 - rho * rho));

    let interpretation = '';
    const absRho = Math.abs(rho);
    if (absRho >= 0.9) interpretation = 'Very strong';
    else if (absRho >= 0.7) interpretation = 'Strong';
    else if (absRho >= 0.5) interpretation = 'Moderate';
    else if (absRho >= 0.3) interpretation = 'Weak';
    else interpretation = 'Very weak or no';

    interpretation += rho >= 0 ? ' positive correlation' : ' negative correlation';

    setResult({ rho, n, tStat, interpretation });
  };

  const copyText = result
    ? `Spearman Rank Correlation\nρ (rho) = ${result.rho.toFixed(6)}\nn = ${result.n}\nt-statistic = ${result.tStat.toFixed(4)}\nInterpretation: ${result.interpretation}\nFormula: ρ = 1 - (6Σd²) / (n(n²-1))`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-x`} className="block text-sm font-medium text-gray-700 mb-1">
          X Values (comma or space separated)
        </label>
        <textarea
          id={`${toolId}-x`}
          value={xValues}
          onChange={(e) => setXValues(e.target.value)}
          placeholder="e.g. 1, 2, 3, 4, 5, 6, 7, 8, 9, 10"
          aria-label={`X values for ${toolName}`}
          className="input-field h-20 resize-y font-mono"
        />
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-y`} className="block text-sm font-medium text-gray-700 mb-1">
          Y Values (comma or space separated)
        </label>
        <textarea
          id={`${toolId}-y`}
          value={yValues}
          onChange={(e) => setYValues(e.target.value)}
          placeholder="e.g. 2, 4, 1, 5, 3, 8, 7, 6, 10, 9"
          aria-label={`Y values for ${toolName}`}
          className="input-field h-20 resize-y font-mono"
        />
      </InputArea>

      <button onClick={calculate} aria-label="Calculate Spearman correlation" className="btn-primary">
        Calculate Correlation
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.rho.toFixed(6)}</div>
                <div className="text-xs text-gray-500 mt-1">ρ (Spearman rho)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-700">{result.tStat.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">t-statistic (df={result.n - 2})</div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700"><span className="font-medium">Interpretation:</span> {result.interpretation}</p>
              <p className="text-xs text-gray-500 mt-1">n = {result.n} paired observations</p>
            </div>
            <div className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded border border-gray-200">
              ρ = 1 - (6Σd²) / (n(n²-1))
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
