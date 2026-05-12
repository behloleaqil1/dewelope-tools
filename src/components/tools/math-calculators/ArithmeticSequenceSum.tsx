'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ArithmeticSequenceSum - Calculate sum of arithmetic sequence (first n terms).
 */
export default function ArithmeticSequenceSum({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [firstTerm, setFirstTerm] = useState('');
  const [commonDiff, setCommonDiff] = useState('');
  const [numTerms, setNumTerms] = useState('');
  const [result, setResult] = useState<{ sum: number; lastTerm: number; terms: string; formula: string } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    setResult(null);

    const a = parseFloat(firstTerm);
    const d = parseFloat(commonDiff);
    const n = parseInt(numTerms);

    if (isNaN(a)) {
      setError('Please enter a valid first term (a₁).');
      return;
    }
    if (isNaN(d)) {
      setError('Please enter a valid common difference (d).');
      return;
    }
    if (isNaN(n) || n < 1) {
      setError('Please enter a valid number of terms (n ≥ 1).');
      return;
    }
    if (n > 10000) {
      setError('Number of terms must be 10,000 or less.');
      return;
    }

    const lastTerm = a + (n - 1) * d;
    const sum = (n / 2) * (a + lastTerm);

    // Show first few terms
    const showCount = Math.min(n, 6);
    const termsArr: number[] = [];
    for (let i = 0; i < showCount; i++) {
      termsArr.push(a + i * d);
    }
    const terms = termsArr.join(', ') + (n > 6 ? `, ... , ${lastTerm}` : '');

    const formula = `Sₙ = n/2 × (a₁ + aₙ) = ${n}/2 × (${a} + ${lastTerm}) = ${sum}`;

    setResult({ sum, lastTerm, terms, formula });
  };

  const copyText = result
    ? `Arithmetic Sequence Sum\nFirst term (a₁): ${firstTerm}\nCommon difference (d): ${commonDiff}\nNumber of terms (n): ${numTerms}\nLast term (aₙ): ${result.lastTerm}\nSum (Sₙ): ${result.sum}\nFormula: ${result.formula}\nSequence: ${result.terms}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label className="block text-sm font-medium text-gray-700 mb-2">Arithmetic Sequence Parameters</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor={`${toolId}-a`} className="block text-xs text-gray-500 mb-1">First term (a₁)</label>
            <input id={`${toolId}-a`} type="text" inputMode="decimal" value={firstTerm} onChange={(e) => setFirstTerm(e.target.value)} placeholder="1" aria-label={`First term for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-d`} className="block text-xs text-gray-500 mb-1">Common difference (d)</label>
            <input id={`${toolId}-d`} type="text" inputMode="decimal" value={commonDiff} onChange={(e) => setCommonDiff(e.target.value)} placeholder="2" aria-label={`Common difference for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-n`} className="block text-xs text-gray-500 mb-1">Number of terms (n)</label>
            <input id={`${toolId}-n`} type="text" inputMode="numeric" value={numTerms} onChange={(e) => setNumTerms(e.target.value)} placeholder="10" aria-label={`Number of terms for ${toolName}`} className="input-field" />
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} className="btn-primary" aria-label="Calculate arithmetic sequence sum">Calculate Sum</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.sum.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">Sum (Sₙ)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.lastTerm}</div>
                <div className="text-xs text-gray-500 mt-1">Last Term (aₙ)</div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-1 text-sm text-gray-700">
              <div><span className="font-medium">Sequence:</span> {result.terms}</div>
              <div><span className="font-medium">Formula:</span> {result.formula}</div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
