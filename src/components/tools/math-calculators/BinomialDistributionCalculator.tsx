'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BinomialDistributionCalculator - Calculate binomial distribution probabilities.
 * P(X=k) = C(n,k) * p^k * (1-p)^(n-k)
 */
export default function BinomialDistributionCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [n, setN] = useState('');
  const [k, setK] = useState('');
  const [p, setP] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    exact: number;
    cumulative: number;
    upperTail: number;
    mean: number;
    variance: number;
    stdDev: number;
  } | null>(null);

  function combination(n: number, k: number): number {
    if (k > n) return 0;
    if (k === 0 || k === n) return 1;
    // Use logarithms for large numbers
    let logResult = 0;
    for (let i = 0; i < k; i++) {
      logResult += Math.log(n - i) - Math.log(i + 1);
    }
    return Math.exp(logResult);
  }

  function binomialPmf(n: number, k: number, p: number): number {
    return combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
  }

  function calculate() {
    const newErrors: Record<string, string> = {};
    const nVal = parseInt(n);
    const kVal = parseInt(k);
    const pVal = parseFloat(p);

    if (!n.trim() || isNaN(nVal) || nVal < 0 || !Number.isInteger(nVal)) {
      newErrors.n = 'Enter a non-negative integer for n';
    } else if (nVal > 1000) {
      newErrors.n = 'n must be ≤ 1000';
    }

    if (!k.trim() || isNaN(kVal) || kVal < 0 || !Number.isInteger(kVal)) {
      newErrors.k = 'Enter a non-negative integer for k';
    } else if (!isNaN(nVal) && kVal > nVal) {
      newErrors.k = 'k must be ≤ n';
    }

    if (!p.trim() || isNaN(pVal) || pVal < 0 || pVal > 1) {
      newErrors.p = 'Enter a probability between 0 and 1';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    const exact = binomialPmf(nVal, kVal, pVal);
    let cumulative = 0;
    for (let i = 0; i <= kVal; i++) {
      cumulative += binomialPmf(nVal, i, pVal);
    }
    const upperTail = 1 - cumulative + exact;
    const mean = nVal * pVal;
    const variance = nVal * pVal * (1 - pVal);
    const stdDev = Math.sqrt(variance);

    setResult({ exact, cumulative, upperTail, mean, variance, stdDev });
  }

  const copyText = result
    ? `P(X = ${k}) = ${result.exact.toFixed(8)}\nP(X ≤ ${k}) = ${result.cumulative.toFixed(8)}\nP(X ≥ ${k}) = ${result.upperTail.toFixed(8)}\nMean = ${result.mean.toFixed(4)}\nVariance = ${result.variance.toFixed(4)}\nStd Dev = ${result.stdDev.toFixed(4)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={errors.n}>
          <label htmlFor={`${toolId}-n`} className="block text-sm font-medium text-gray-700 mb-1">
            Number of Trials (n)
          </label>
          <input
            id={`${toolId}-n`}
            type="text"
            inputMode="numeric"
            value={n}
            onChange={(e) => { setN(e.target.value); if (errors.n) setErrors((prev) => ({ ...prev, n: '' })); }}
            placeholder="e.g. 10"
            aria-label={`Number of trials for ${toolName}`}
            className="input-field w-40"
          />
        </InputArea>

        <InputArea error={errors.k}>
          <label htmlFor={`${toolId}-k`} className="block text-sm font-medium text-gray-700 mb-1">
            Number of Successes (k)
          </label>
          <input
            id={`${toolId}-k`}
            type="text"
            inputMode="numeric"
            value={k}
            onChange={(e) => { setK(e.target.value); if (errors.k) setErrors((prev) => ({ ...prev, k: '' })); }}
            placeholder="e.g. 3"
            aria-label={`Number of successes for ${toolName}`}
            className="input-field w-40"
          />
        </InputArea>

        <InputArea error={errors.p}>
          <label htmlFor={`${toolId}-p`} className="block text-sm font-medium text-gray-700 mb-1">
            Probability of Success (p)
          </label>
          <input
            id={`${toolId}-p`}
            type="text"
            inputMode="decimal"
            value={p}
            onChange={(e) => { setP(e.target.value); if (errors.p) setErrors((prev) => ({ ...prev, p: '' })); }}
            placeholder="e.g. 0.5"
            aria-label={`Probability of success for ${toolName}`}
            className="input-field w-40"
          />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate binomial distribution" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600">{result.exact.toFixed(8)}</div>
                <div className="text-xs text-gray-500">P(X = {k})</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-green-600">{result.cumulative.toFixed(8)}</div>
                <div className="text-xs text-gray-500">P(X ≤ {k})</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-purple-600">{result.upperTail.toFixed(8)}</div>
                <div className="text-xs text-gray-500">P(X ≥ {k})</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-sm font-semibold text-gray-700">{result.mean.toFixed(4)}</div>
                <div className="text-xs text-gray-500">Mean (np)</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-sm font-semibold text-gray-700">{result.variance.toFixed(4)}</div>
                <div className="text-xs text-gray-500">Variance</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-sm font-semibold text-gray-700">{result.stdDev.toFixed(4)}</div>
                <div className="text-xs text-gray-500">Std Dev</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              P(X=k) = C(n,k) × p^k × (1-p)^(n-k)
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
