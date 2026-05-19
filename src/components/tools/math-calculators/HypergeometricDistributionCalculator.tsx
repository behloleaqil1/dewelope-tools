'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HypergeometricDistributionCalculator - Calculate hypergeometric distribution probabilities.
 */
export default function HypergeometricDistributionCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [popSize, setPopSize] = useState('');
  const [successes, setSuccesses] = useState('');
  const [sampleSize, setSampleSize] = useState('');
  const [desired, setDesired] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ exact: number; cumulative: number; mean: number; formula: string } | null>(null);

  const _factorial = (n: number): number => {
    if (n <= 1) return 1;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
  };

  const comb = (n: number, k: number): number => {
    if (k < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;
    const kk = Math.min(k, n - k);
    let result = 1;
    for (let i = 0; i < kk; i++) {
      result = (result * (n - i)) / (i + 1);
    }
    return Math.round(result);
  };

  const calculate = () => {
    setError('');
    setResult(null);

    const N = parseInt(popSize);
    const K = parseInt(successes);
    const n = parseInt(sampleSize);
    const k = parseInt(desired);

    if (isNaN(N) || N < 1) { setError('Population size must be a positive integer.'); return; }
    if (isNaN(K) || K < 0 || K > N) { setError('Successes must be between 0 and population size.'); return; }
    if (isNaN(n) || n < 1 || n > N) { setError('Sample size must be between 1 and population size.'); return; }
    if (isNaN(k) || k < 0 || k > Math.min(K, n)) { setError('Desired successes must be between 0 and min(K, n).'); return; }

    const exact = (comb(K, k) * comb(N - K, n - k)) / comb(N, n);
    let cumulative = 0;
    for (let i = 0; i <= k; i++) {
      cumulative += (comb(K, i) * comb(N - K, n - i)) / comb(N, n);
    }
    const mean = (n * K) / N;

    setResult({
      exact,
      cumulative,
      mean,
      formula: `P(X = ${k}) = C(${K},${k}) × C(${N - K},${n - k}) / C(${N},${n})\nP(X = ${k}) = ${exact.toFixed(8)}\nP(X ≤ ${k}) = ${cumulative.toFixed(8)}\nMean = n×K/N = ${n}×${K}/${N} = ${mean.toFixed(4)}`,
    });
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-N`} className="block text-sm font-medium text-gray-700 mb-1">Population Size (N)</label>
            <input id={`${toolId}-N`} type="text" inputMode="numeric" value={popSize} onChange={(e) => setPopSize(e.target.value)} placeholder="e.g. 52" aria-label={`Population size for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-K`} className="block text-sm font-medium text-gray-700 mb-1">Successes in Population (K)</label>
            <input id={`${toolId}-K`} type="text" inputMode="numeric" value={successes} onChange={(e) => setSuccesses(e.target.value)} placeholder="e.g. 13" aria-label={`Successes in population for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-n`} className="block text-sm font-medium text-gray-700 mb-1">Sample Size (n)</label>
            <input id={`${toolId}-n`} type="text" inputMode="numeric" value={sampleSize} onChange={(e) => setSampleSize(e.target.value)} placeholder="e.g. 5" aria-label={`Sample size for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-k`} className="block text-sm font-medium text-gray-700 mb-1">Desired Successes (k)</label>
            <input id={`${toolId}-k`} type="text" inputMode="numeric" value={desired} onChange={(e) => setDesired(e.target.value)} placeholder="e.g. 2" aria-label={`Desired successes for ${toolName}`} className="input-field" />
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} className="btn-primary" aria-label="Calculate hypergeometric probability">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xs text-gray-500">P(X = k)</div>
                <div className="text-lg font-bold text-blue-600">{result.exact.toFixed(6)}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xs text-gray-500">P(X ≤ k)</div>
                <div className="text-lg font-bold text-blue-600">{result.cumulative.toFixed(6)}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xs text-gray-500">Mean</div>
                <div className="text-lg font-bold text-blue-600">{result.mean.toFixed(4)}</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono whitespace-pre-wrap">{result.formula}</div>
            <CopyToClipboard text={`P(X=${desired}): ${result.exact.toFixed(8)}\nP(X≤${desired}): ${result.cumulative.toFixed(8)}\nMean: ${result.mean.toFixed(4)}`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
