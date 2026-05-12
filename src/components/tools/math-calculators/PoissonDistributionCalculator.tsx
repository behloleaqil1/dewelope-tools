'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PoissonDistributionCalculator - Calculate Poisson distribution probabilities.
 * P(X = k) = (λ^k * e^(-λ)) / k!
 */
export default function PoissonDistributionCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [lambda, setLambda] = useState('');
  const [k, setK] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    exact: number;
    cumulative: number;
    upperTail: number;
    mean: number;
    variance: number;
    stdDev: number;
  } | null>(null);

  function factorial(n: number): number {
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  }

  function poissonPmf(lam: number, x: number): number {
    return (Math.pow(lam, x) * Math.exp(-lam)) / factorial(x);
  }

  function calculate() {
    const newErrors: Record<string, string> = {};
    const lam = parseFloat(lambda);
    const kVal = parseInt(k);

    if (!lambda.trim() || isNaN(lam) || lam <= 0) {
      newErrors.lambda = 'Enter a positive number for λ';
    }
    if (!k.trim() || isNaN(kVal) || kVal < 0 || !Number.isInteger(kVal)) {
      newErrors.k = 'Enter a non-negative integer for k';
    }
    if (kVal > 170) {
      newErrors.k = 'k must be 170 or less to avoid overflow';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    const exact = poissonPmf(lam, kVal);
    let cumulative = 0;
    for (let i = 0; i <= kVal; i++) {
      cumulative += poissonPmf(lam, i);
    }
    const upperTail = 1 - cumulative;

    setResult({
      exact,
      cumulative,
      upperTail,
      mean: lam,
      variance: lam,
      stdDev: Math.sqrt(lam),
    });
  }

  const copyText = result
    ? `P(X = ${k}) = ${result.exact.toFixed(8)}\nP(X ≤ ${k}) = ${result.cumulative.toFixed(8)}\nP(X > ${k}) = ${result.upperTail.toFixed(8)}\nMean = ${result.mean}\nVariance = ${result.variance}\nStd Dev = ${result.stdDev.toFixed(6)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea error={errors.lambda}>
          <label htmlFor={`${toolId}-lambda`} className="block text-sm font-medium text-gray-700 mb-1">
            λ (Average Rate)
          </label>
          <input
            id={`${toolId}-lambda`}
            type="text"
            inputMode="decimal"
            value={lambda}
            onChange={(e) => { setLambda(e.target.value); if (errors.lambda) setErrors(prev => ({ ...prev, lambda: '' })); }}
            placeholder="e.g. 3.5"
            aria-label={`Lambda value for ${toolName}`}
            className="input-field"
          />
        </InputArea>
        <InputArea error={errors.k}>
          <label htmlFor={`${toolId}-k`} className="block text-sm font-medium text-gray-700 mb-1">
            k (Number of Events)
          </label>
          <input
            id={`${toolId}-k`}
            type="text"
            inputMode="numeric"
            value={k}
            onChange={(e) => { setK(e.target.value); if (errors.k) setErrors(prev => ({ ...prev, k: '' })); }}
            placeholder="e.g. 5"
            aria-label={`k value for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate Poisson probability" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600">{result.exact.toFixed(6)}</div>
                <div className="text-xs text-gray-500 mt-1">P(X = {k})</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-green-600">{result.cumulative.toFixed(6)}</div>
                <div className="text-xs text-gray-500 mt-1">P(X ≤ {k})</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-purple-600">{result.upperTail.toFixed(6)}</div>
                <div className="text-xs text-gray-500 mt-1">P(X &gt; {k})</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-sm font-bold text-gray-700">{result.mean}</div>
                <div className="text-xs text-gray-500">Mean (λ)</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-sm font-bold text-gray-700">{result.variance}</div>
                <div className="text-xs text-gray-500">Variance (λ)</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-sm font-bold text-gray-700">{result.stdDev.toFixed(4)}</div>
                <div className="text-xs text-gray-500">Std Dev (√λ)</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              P(X = k) = (λ^k × e^(-λ)) / k! = ({lambda}^{k} × e^(-{lambda})) / {k}!
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
