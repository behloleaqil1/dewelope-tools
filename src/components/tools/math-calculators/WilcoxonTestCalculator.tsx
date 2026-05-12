'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * WilcoxonTestCalculator - Calculate Wilcoxon signed-rank test for paired samples.
 * Non-parametric alternative to paired t-test for non-normal distributions.
 */
export default function WilcoxonTestCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [sample1, setSample1] = useState('');
  const [sample2, setSample2] = useState('');
  const [alpha, setAlpha] = useState('0.05');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    n: number; wPlus: number; wMinus: number; wStat: number;
    meanW: number; stdW: number; zScore: number; pValue: number;
    significant: boolean;
  } | null>(null);

  const calculate = () => {
    setError('');
    setResult(null);

    const vals1 = sample1.trim().split(/[\s,]+/).map(Number).filter((n) => !isNaN(n));
    const vals2 = sample2.trim().split(/[\s,]+/).map(Number).filter((n) => !isNaN(n));

    if (vals1.length < 5) { setError('Sample 1 needs at least 5 values'); return; }
    if (vals2.length < 5) { setError('Sample 2 needs at least 5 values'); return; }
    if (vals1.length !== vals2.length) { setError('Both samples must have the same number of values'); return; }

    const alphaVal = parseFloat(alpha);
    if (isNaN(alphaVal) || alphaVal <= 0 || alphaVal >= 1) { setError('Alpha must be between 0 and 1'); return; }

    // Calculate differences
    const diffs = vals1.map((v, i) => v - vals2[i]);

    // Remove zeros
    const nonZeroDiffs = diffs.filter((d) => d !== 0);
    const n = nonZeroDiffs.length;

    if (n === 0) { setError('All differences are zero'); return; }

    // Rank absolute differences
    const absDiffs = nonZeroDiffs.map((d, i) => ({ abs: Math.abs(d), sign: d > 0 ? 1 : -1, idx: i }));
    absDiffs.sort((a, b) => a.abs - b.abs);

    // Assign ranks with ties
    const ranks: number[] = new Array(absDiffs.length);
    let i = 0;
    while (i < absDiffs.length) {
      let j = i;
      while (j < absDiffs.length && absDiffs[j].abs === absDiffs[i].abs) j++;
      const avgRank = (i + 1 + j) / 2;
      for (let k = i; k < j; k++) ranks[k] = avgRank;
      i = j;
    }

    // Calculate W+ and W-
    let wPlus = 0;
    let wMinus = 0;
    for (let k = 0; k < absDiffs.length; k++) {
      if (absDiffs[k].sign > 0) wPlus += ranks[k];
      else wMinus += ranks[k];
    }

    const wStat = Math.min(wPlus, wMinus);

    // Normal approximation for large samples
    const meanW = (n * (n + 1)) / 4;
    const stdW = Math.sqrt((n * (n + 1) * (2 * n + 1)) / 24);
    const zScore = (wStat - meanW) / stdW;

    // Approximate p-value using normal distribution (two-tailed)
    const pValue = 2 * (1 - normalCDF(Math.abs(zScore)));

    setResult({
      n, wPlus, wMinus, wStat, meanW, stdW, zScore, pValue,
      significant: pValue < alphaVal,
    });
  };

  // Standard normal CDF approximation
  function normalCDF(x: number): number {
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
    const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x) / Math.sqrt(2);
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return 0.5 * (1.0 + sign * y);
  }

  const copyText = result
    ? `Wilcoxon Signed-Rank Test\nN (non-zero pairs): ${result.n}\nW+: ${result.wPlus.toFixed(1)}\nW-: ${result.wMinus.toFixed(1)}\nW statistic: ${result.wStat.toFixed(1)}\nZ-score: ${result.zScore.toFixed(4)}\nP-value: ${result.pValue.toFixed(6)}\nSignificant (α=${alpha}): ${result.significant ? 'Yes' : 'No'}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea error={error && error.includes('Sample 1') ? error : undefined}>
          <label htmlFor={`${toolId}-s1`} className="block text-sm font-medium text-gray-700 mb-1">Sample 1 (comma or space separated)</label>
          <textarea id={`${toolId}-s1`} value={sample1} onChange={(e) => setSample1(e.target.value)} placeholder="e.g. 12, 15, 18, 22, 25, 30" aria-label={`Sample 1 for ${toolName}`} className="input-field h-24 resize-y font-mono" />
        </InputArea>
        <InputArea error={error && error.includes('Sample 2') ? error : undefined}>
          <label htmlFor={`${toolId}-s2`} className="block text-sm font-medium text-gray-700 mb-1">Sample 2 (paired values)</label>
          <textarea id={`${toolId}-s2`} value={sample2} onChange={(e) => setSample2(e.target.value)} placeholder="e.g. 10, 14, 20, 19, 28, 32" aria-label={`Sample 2 for ${toolName}`} className="input-field h-24 resize-y font-mono" />
        </InputArea>
      </div>

      <InputArea error={error && !error.includes('Sample') ? error : undefined}>
        <label htmlFor={`${toolId}-alpha`} className="block text-sm font-medium text-gray-700 mb-1">Significance Level (α)</label>
        <input id={`${toolId}-alpha`} type="text" inputMode="decimal" value={alpha} onChange={(e) => setAlpha(e.target.value)} placeholder="0.05" aria-label={`Alpha for ${toolName}`} className="input-field w-32" />
      </InputArea>

      <button onClick={calculate} aria-label="Calculate Wilcoxon test" className="btn-primary">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.n}</div>
                <div className="text-xs text-gray-500">N (pairs)</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-green-600">{result.wStat.toFixed(1)}</div>
                <div className="text-xs text-gray-500">W statistic</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-purple-600">{result.zScore.toFixed(4)}</div>
                <div className="text-xs text-gray-500">Z-score</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className={`text-xl font-bold ${result.significant ? 'text-red-600' : 'text-gray-600'}`}>{result.pValue.toFixed(6)}</div>
                <div className="text-xs text-gray-500">P-value</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-green-600">{result.wPlus.toFixed(1)}</div>
                <div className="text-xs text-gray-500">W+ (positive ranks)</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-red-600">{result.wMinus.toFixed(1)}</div>
                <div className="text-xs text-gray-500">W- (negative ranks)</div>
              </div>
            </div>

            <div className={`p-3 rounded-lg border ${result.significant ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
              <p className={`text-sm font-medium ${result.significant ? 'text-red-700' : 'text-green-700'}`}>
                {result.significant
                  ? `Result is statistically significant (p = ${result.pValue.toFixed(6)} < α = ${alpha}). Reject H₀.`
                  : `Result is not statistically significant (p = ${result.pValue.toFixed(6)} ≥ α = ${alpha}). Fail to reject H₀.`}
              </p>
            </div>

            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
