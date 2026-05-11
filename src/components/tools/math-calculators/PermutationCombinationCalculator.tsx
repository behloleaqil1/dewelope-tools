'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PermutationCombinationCalculator - Calculate nPr (permutations) and nCr (combinations) with formulas.
 */
export default function PermutationCombinationCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [n, setN] = useState('');
  const [r, setR] = useState('');
  const [result, setResult] = useState<{ nPr: string; nCr: string; formula: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function factorial(num: number): bigint {
    let result = BigInt(1);
    for (let i = 2; i <= num; i++) {
      result *= BigInt(i);
    }
    return result;
  }

  function calculate() {
    setError(undefined);
    setResult(null);

    const nVal = parseInt(n);
    const rVal = parseInt(r);

    if (!n.trim() || isNaN(nVal) || !r.trim() || isNaN(rVal)) {
      setError('Please enter valid integers for both n and r');
      return;
    }
    if (nVal < 0 || rVal < 0) {
      setError('Values must be non-negative');
      return;
    }
    if (rVal > nVal) {
      setError('r cannot be greater than n');
      return;
    }
    if (nVal > 170) {
      setError('n must be 170 or less to avoid overflow');
      return;
    }

    const nFact = factorial(nVal);
    const rFact = factorial(rVal);
    const nrFact = factorial(nVal - rVal);

    const nPr = (nFact / nrFact).toString();
    const nCr = (nFact / (rFact * nrFact)).toString();

    const formula = `nPr = n! / (n-r)! = ${nVal}! / ${nVal - rVal}! = ${nPr}\nnCr = n! / (r! × (n-r)!) = ${nVal}! / (${rVal}! × ${nVal - rVal}!) = ${nCr}`;

    setResult({ nPr, nCr, formula });
  }

  const copyText = result ? `n=${n}, r=${r}\nnPr = ${result.nPr}\nnCr = ${result.nCr}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label className="block text-sm font-medium text-gray-700 mb-2">Enter values</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-n`} className="block text-xs text-gray-500 mb-1">n (total items)</label>
            <input
              id={`${toolId}-n`}
              type="text"
              inputMode="numeric"
              value={n}
              onChange={(e) => setN(e.target.value)}
              placeholder="e.g. 10"
              aria-label={`Total items for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-r`} className="block text-xs text-gray-500 mb-1">r (items chosen)</label>
            <input
              id={`${toolId}-r`}
              type="text"
              inputMode="numeric"
              value={r}
              onChange={(e) => setR(e.target.value)}
              placeholder="e.g. 3"
              aria-label={`Items chosen for ${toolName}`}
              className="input-field"
            />
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate permutations and combinations" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600 font-mono break-all">{result.nPr}</div>
                <div className="text-xs text-gray-500 mt-1">nPr (Permutations)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600 font-mono break-all">{result.nCr}</div>
                <div className="text-xs text-gray-500 mt-1">nCr (Combinations)</div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <label className="block text-xs text-gray-500 mb-1">Formulas</label>
              <pre className="text-sm font-mono text-gray-700 whitespace-pre-wrap">{result.formula}</pre>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
