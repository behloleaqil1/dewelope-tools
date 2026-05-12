'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HypergeometricCalculator - Calculate hypergeometric distribution probability.
 * P(X=k) = C(K,k) * C(N-K, n-k) / C(N, n)
 */
export default function HypergeometricCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [popSize, setPopSize] = useState('');
  const [successPop, setSuccessPop] = useState('');
  const [draws, setDraws] = useState('');
  const [successDraws, setSuccessDraws] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    exact: number;
    cumLessEqual: number;
    cumGreaterEqual: number;
    mean: number;
    variance: number;
  } | null>(null);

  function logCombination(n: number, k: number): number {
    if (k < 0 || k > n) return -Infinity;
    if (k === 0 || k === n) return 0;
    let sum = 0;
    for (let i = 0; i < k; i++) {
      sum += Math.log(n - i) - Math.log(i + 1);
    }
    return sum;
  }

  function hypergeometricPmf(N: number, K: number, n: number, k: number): number {
    const logP = logCombination(K, k) + logCombination(N - K, n - k) - logCombination(N, n);
    return Math.exp(logP);
  }

  function calculate() {
    const newErrors: Record<string, string> = {};
    const N = parseInt(popSize);
    const K = parseInt(successPop);
    const n = parseInt(draws);
    const k = parseInt(successDraws);

    if (!popSize.trim() || isNaN(N) || N < 1) newErrors.popSize = 'Enter a positive integer';
    if (!successPop.trim() || isNaN(K) || K < 0) newErrors.successPop = 'Enter a non-negative integer';
    if (!draws.trim() || isNaN(n) || n < 1) newErrors.draws = 'Enter a positive integer';
    if (!successDraws.trim() || isNaN(k) || k < 0) newErrors.successDraws = 'Enter a non-negative integer';

    if (Object.keys(newErrors).length === 0) {
      if (K > N) newErrors.successPop = 'Cannot exceed population size';
      if (n > N) newErrors.draws = 'Cannot exceed population size';
      if (k > Math.min(K, n)) newErrors.successDraws = `Cannot exceed min(K=${K}, n=${n})`;
      if (k < Math.max(0, n - (N - K))) newErrors.successDraws = `Must be at least max(0, n-(N-K))=${Math.max(0, n - (N - K))}`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    const exact = hypergeometricPmf(N, K, n, k);

    let cumLessEqual = 0;
    for (let i = Math.max(0, n - (N - K)); i <= k; i++) {
      cumLessEqual += hypergeometricPmf(N, K, n, i);
    }

    let cumGreaterEqual = 0;
    for (let i = k; i <= Math.min(K, n); i++) {
      cumGreaterEqual += hypergeometricPmf(N, K, n, i);
    }

    const mean = (n * K) / N;
    const variance = (n * K * (N - K) * (N - n)) / (N * N * (N - 1));

    setResult({ exact, cumLessEqual, cumGreaterEqual, mean, variance });
  }

  const copyText = result
    ? `Hypergeometric Distribution\nP(X = ${successDraws}) = ${result.exact.toFixed(8)}\nP(X ≤ ${successDraws}) = ${result.cumLessEqual.toFixed(8)}\nP(X ≥ ${successDraws}) = ${result.cumGreaterEqual.toFixed(8)}\nMean = ${result.mean.toFixed(6)}\nVariance = ${result.variance.toFixed(6)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea error={errors.popSize}>
          <label htmlFor={`${toolId}-N`} className="block text-sm font-medium text-gray-700 mb-1">
            Population Size (N)
          </label>
          <input
            id={`${toolId}-N`}
            type="text"
            inputMode="numeric"
            value={popSize}
            onChange={(e) => { setPopSize(e.target.value); if (errors.popSize) setErrors((p) => ({ ...p, popSize: '' })); }}
            placeholder="e.g. 52"
            aria-label={`Population size for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.successPop}>
          <label htmlFor={`${toolId}-K`} className="block text-sm font-medium text-gray-700 mb-1">
            Success States in Population (K)
          </label>
          <input
            id={`${toolId}-K`}
            type="text"
            inputMode="numeric"
            value={successPop}
            onChange={(e) => { setSuccessPop(e.target.value); if (errors.successPop) setErrors((p) => ({ ...p, successPop: '' })); }}
            placeholder="e.g. 13"
            aria-label={`Success states for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.draws}>
          <label htmlFor={`${toolId}-n`} className="block text-sm font-medium text-gray-700 mb-1">
            Number of Draws (n)
          </label>
          <input
            id={`${toolId}-n`}
            type="text"
            inputMode="numeric"
            value={draws}
            onChange={(e) => { setDraws(e.target.value); if (errors.draws) setErrors((p) => ({ ...p, draws: '' })); }}
            placeholder="e.g. 5"
            aria-label={`Number of draws for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.successDraws}>
          <label htmlFor={`${toolId}-k`} className="block text-sm font-medium text-gray-700 mb-1">
            Observed Successes (k)
          </label>
          <input
            id={`${toolId}-k`}
            type="text"
            inputMode="numeric"
            value={successDraws}
            onChange={(e) => { setSuccessDraws(e.target.value); if (errors.successDraws) setErrors((p) => ({ ...p, successDraws: '' })); }}
            placeholder="e.g. 2"
            aria-label={`Observed successes for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate hypergeometric probability" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600">{result.exact.toFixed(6)}</div>
                <div className="text-xs text-gray-500">P(X = {successDraws})</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-green-600">{result.cumLessEqual.toFixed(6)}</div>
                <div className="text-xs text-gray-500">P(X ≤ {successDraws})</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-purple-600">{result.cumGreaterEqual.toFixed(6)}</div>
                <div className="text-xs text-gray-500">P(X ≥ {successDraws})</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-orange-600">{result.mean.toFixed(4)}</div>
                <div className="text-xs text-gray-500">Mean (μ)</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-red-600">{result.variance.toFixed(4)}</div>
                <div className="text-xs text-gray-500">Variance (σ²)</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              P(X=k) = C(K,k) × C(N-K, n-k) / C(N, n)
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
