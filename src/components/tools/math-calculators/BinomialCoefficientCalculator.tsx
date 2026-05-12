'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BinomialCoefficientCalculator - Calculate binomial coefficient (n choose k).
 * Formula: C(n, k) = n! / (k! * (n-k)!)
 */
export default function BinomialCoefficientCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [n, setN] = useState('');
  const [k, setK] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState('');

  const bigIntBinomial = (n: number, k: number): bigint => {
    if (k > n) return BigInt(0);
    if (k === 0 || k === n) return BigInt(1);
    if (k > n - k) k = n - k;

    let result = BigInt(1);
    for (let i = 0; i < k; i++) {
      result = result * BigInt(n - i) / BigInt(i + 1);
    }
    return result;
  };

  const calculate = () => {
    setError('');
    setResult(null);

    const nVal = parseInt(n);
    const kVal = parseInt(k);

    if (isNaN(nVal) || isNaN(kVal)) {
      setError('Please enter valid integers for both n and k.');
      return;
    }

    if (nVal < 0 || kVal < 0) {
      setError('Both n and k must be non-negative integers.');
      return;
    }

    if (kVal > nVal) {
      setError('k cannot be greater than n.');
      return;
    }

    if (nVal > 1000) {
      setError('n must be 1000 or less to avoid excessive computation.');
      return;
    }

    const value = bigIntBinomial(nVal, kVal);
    setResult(value.toString());
  };

  const copyText = result ? `C(${n}, ${k}) = ${result}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-n`} className="block text-sm font-medium text-gray-700 mb-1">n (total items)</label>
            <input id={`${toolId}-n`} type="text" inputMode="numeric" value={n} onChange={(e) => setN(e.target.value)} placeholder="e.g. 10" aria-label={`Value of n for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-k`} className="block text-sm font-medium text-gray-700 mb-1">k (items to choose)</label>
            <input id={`${toolId}-k`} type="text" inputMode="numeric" value={k} onChange={(e) => setK(e.target.value)} placeholder="e.g. 3" aria-label="Value of k" className="input-field" />
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} className="btn-primary" aria-label="Calculate binomial coefficient">Calculate C(n, k)</button>

      <OutputArea hasContent={result !== null}>
        {result !== null && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-sm text-gray-500 mb-1">C({n}, {k}) =</div>
              <div className="text-2xl font-bold text-blue-600 break-all">{result}</div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              Formula: C(n, k) = n! / (k! × (n-k)!) = {n}! / ({k}! × {parseInt(n) - parseInt(k)}!)
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
