'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ProbabilityCalculator - Calculate basic probability (favorable/total outcomes).
 * P(A) = favorable outcomes / total outcomes
 */
export default function ProbabilityCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [favorable, setFavorable] = useState('');
  const [total, setTotal] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ probability: number; percentage: number; odds: string; complement: number } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const fav = parseFloat(favorable);
    const tot = parseFloat(total);

    if (!favorable.trim() || isNaN(fav) || fav < 0) {
      newErrors.favorable = 'Enter a valid non-negative number';
    }
    if (!total.trim() || isNaN(tot) || tot <= 0) {
      newErrors.total = 'Enter a valid positive number';
    }
    if (!isNaN(fav) && !isNaN(tot) && fav > tot) {
      newErrors.favorable = 'Favorable outcomes cannot exceed total outcomes';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    const probability = fav / tot;
    const percentage = probability * 100;
    const complement = 1 - probability;
    const oddsFor = fav;
    const oddsAgainst = tot - fav;
    const odds = oddsAgainst === 0 ? `${oddsFor}:0 (certain)` : `${oddsFor}:${oddsAgainst}`;

    setResult({ probability, percentage, odds, complement });
  };

  const copyText = result
    ? `P(A) = ${result.probability.toFixed(6)}\nPercentage: ${result.percentage.toFixed(2)}%\nOdds: ${result.odds}\nComplement P(A'): ${result.complement.toFixed(6)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea error={errors.favorable}>
          <label htmlFor={`${toolId}-favorable`} className="block text-sm font-medium text-gray-700 mb-1">
            Favorable Outcomes
          </label>
          <input
            id={`${toolId}-favorable`}
            type="text"
            inputMode="decimal"
            value={favorable}
            onChange={(e) => { setFavorable(e.target.value); if (errors.favorable) setErrors((p) => ({ ...p, favorable: '' })); }}
            placeholder="e.g. 3"
            aria-label={`Favorable outcomes for ${toolName}`}
            className="input-field"
          />
        </InputArea>
        <InputArea error={errors.total}>
          <label htmlFor={`${toolId}-total`} className="block text-sm font-medium text-gray-700 mb-1">
            Total Outcomes
          </label>
          <input
            id={`${toolId}-total`}
            type="text"
            inputMode="decimal"
            value={total}
            onChange={(e) => { setTotal(e.target.value); if (errors.total) setErrors((p) => ({ ...p, total: '' })); }}
            placeholder="e.g. 6"
            aria-label={`Total outcomes for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate probability" className="btn-primary">
        Calculate Probability
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.probability.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">P(A)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{result.percentage.toFixed(2)}%</div>
                <div className="text-xs text-gray-500 mt-1">Percentage</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-purple-600">{result.odds}</div>
                <div className="text-xs text-gray-500 mt-1">Odds (for:against)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-orange-600">{result.complement.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">P(A&apos;) Complement</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              P(A) = Favorable / Total = {favorable} / {total} = {result.probability.toFixed(6)}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
