'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * GeometricSequenceSum - Calculate the sum of a geometric sequence given
 * first term, common ratio, and number of terms.
 */
export default function GeometricSequenceSum({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [firstTerm, setFirstTerm] = useState('');
  const [ratio, setRatio] = useState('');
  const [numTerms, setNumTerms] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ sum: number; terms: number[]; formula: string; infiniteSum?: number } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const a = parseFloat(firstTerm);
    const r = parseFloat(ratio);
    const n = parseInt(numTerms);

    if (!firstTerm.trim() || isNaN(a)) newErrors.firstTerm = 'Enter a valid first term';
    if (!ratio.trim() || isNaN(r)) newErrors.ratio = 'Enter a valid common ratio';
    if (!numTerms.trim() || isNaN(n) || n < 1 || n > 100) newErrors.numTerms = 'Enter a valid number of terms (1-100)';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    // Generate terms
    const terms: number[] = [];
    for (let i = 0; i < Math.min(n, 10); i++) {
      terms.push(a * Math.pow(r, i));
    }

    // Calculate sum
    let sum: number;
    let formula: string;

    if (r === 1) {
      sum = a * n;
      formula = `S = a × n = ${a} × ${n} = ${sum}`;
    } else {
      sum = a * (1 - Math.pow(r, n)) / (1 - r);
      formula = `S = a(1 - rⁿ) / (1 - r) = ${a}(1 - ${r}^${n}) / (1 - ${r}) = ${sum.toFixed(6)}`;
    }

    // Infinite sum (only if |r| < 1)
    let infiniteSum: number | undefined;
    if (Math.abs(r) < 1) {
      infiniteSum = a / (1 - r);
    }

    setResult({ sum, terms, formula, infiniteSum });
  };

  const copyText = result
    ? `Geometric Sequence Sum\nFirst term (a): ${firstTerm}\nCommon ratio (r): ${ratio}\nNumber of terms (n): ${numTerms}\nSum: ${result.sum.toFixed(6)}\nFormula: ${result.formula}${result.infiniteSum !== undefined ? `\nInfinite sum (|r|<1): ${result.infiniteSum.toFixed(6)}` : ''}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputArea error={errors.firstTerm}>
          <label htmlFor={`${toolId}-a`} className="block text-sm font-medium text-gray-700 mb-1">
            First Term (a)
          </label>
          <input
            id={`${toolId}-a`}
            type="text"
            inputMode="decimal"
            value={firstTerm}
            onChange={(e) => { setFirstTerm(e.target.value); if (errors.firstTerm) setErrors(prev => ({ ...prev, firstTerm: '' })); }}
            placeholder="e.g. 2"
            aria-label={`First term for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.ratio}>
          <label htmlFor={`${toolId}-r`} className="block text-sm font-medium text-gray-700 mb-1">
            Common Ratio (r)
          </label>
          <input
            id={`${toolId}-r`}
            type="text"
            inputMode="decimal"
            value={ratio}
            onChange={(e) => { setRatio(e.target.value); if (errors.ratio) setErrors(prev => ({ ...prev, ratio: '' })); }}
            placeholder="e.g. 3"
            aria-label={`Common ratio for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.numTerms}>
          <label htmlFor={`${toolId}-n`} className="block text-sm font-medium text-gray-700 mb-1">
            Number of Terms (n)
          </label>
          <input
            id={`${toolId}-n`}
            type="text"
            inputMode="numeric"
            value={numTerms}
            onChange={(e) => { setNumTerms(e.target.value); if (errors.numTerms) setErrors(prev => ({ ...prev, numTerms: '' })); }}
            placeholder="e.g. 5"
            aria-label={`Number of terms for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate sum" className="btn-primary">
        Calculate Sum
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-blue-600">{result.sum.toFixed(6)}</div>
              <div className="text-xs text-gray-500 mt-1">Sum of {numTerms} terms</div>
            </div>

            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              {result.formula}
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-1">First {Math.min(result.terms.length, 10)} terms:</div>
              <div className="text-sm font-mono text-gray-600">
                {result.terms.map(t => t.toFixed(4)).join(', ')}{result.terms.length < parseInt(numTerms) ? ', ...' : ''}
              </div>
            </div>

            {result.infiniteSum !== undefined && (
              <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-sm text-green-800">
                <strong>Infinite sum (|r| &lt; 1):</strong> S∞ = a / (1 - r) = {result.infiniteSum.toFixed(6)}
              </div>
            )}

            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
