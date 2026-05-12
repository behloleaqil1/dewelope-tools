'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BayesTheoremCalculator - Calculate posterior probability using Bayes' theorem.
 * P(A|B) = P(B|A) * P(A) / P(B)
 */
export default function BayesTheoremCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [priorA, setPriorA] = useState('');
  const [likelihoodBA, setLikelihoodBA] = useState('');
  const [evidenceB, setEvidenceB] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ posterior: number; formula: string } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const pA = parseFloat(priorA);
    const pBA = parseFloat(likelihoodBA);
    const pB = parseFloat(evidenceB);

    if (!priorA.trim() || isNaN(pA) || pA < 0 || pA > 1) {
      newErrors.priorA = 'Enter a probability between 0 and 1';
    }
    if (!likelihoodBA.trim() || isNaN(pBA) || pBA < 0 || pBA > 1) {
      newErrors.likelihoodBA = 'Enter a probability between 0 and 1';
    }
    if (!evidenceB.trim() || isNaN(pB) || pB <= 0 || pB > 1) {
      newErrors.evidenceB = 'Enter a probability between 0 (exclusive) and 1';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    const posterior = (pBA * pA) / pB;
    const formula = `P(A|B) = P(B|A) × P(A) / P(B) = ${pBA} × ${pA} / ${pB} = ${posterior.toFixed(6)}`;
    setResult({ posterior, formula });
  };

  const copyText = result
    ? `Posterior P(A|B): ${result.posterior.toFixed(6)}\n${result.formula}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={errors.priorA}>
          <label htmlFor={`${toolId}-prior`} className="block text-sm font-medium text-gray-700 mb-1">
            P(A) — Prior Probability
          </label>
          <input
            id={`${toolId}-prior`}
            type="text"
            inputMode="decimal"
            value={priorA}
            onChange={(e) => { setPriorA(e.target.value); if (errors.priorA) setErrors(prev => ({ ...prev, priorA: '' })); }}
            placeholder="e.g. 0.01"
            aria-label={`Prior probability for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.likelihoodBA}>
          <label htmlFor={`${toolId}-likelihood`} className="block text-sm font-medium text-gray-700 mb-1">
            P(B|A) — Likelihood
          </label>
          <input
            id={`${toolId}-likelihood`}
            type="text"
            inputMode="decimal"
            value={likelihoodBA}
            onChange={(e) => { setLikelihoodBA(e.target.value); if (errors.likelihoodBA) setErrors(prev => ({ ...prev, likelihoodBA: '' })); }}
            placeholder="e.g. 0.9"
            aria-label={`Likelihood for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.evidenceB}>
          <label htmlFor={`${toolId}-evidence`} className="block text-sm font-medium text-gray-700 mb-1">
            P(B) — Evidence (Marginal Probability)
          </label>
          <input
            id={`${toolId}-evidence`}
            type="text"
            inputMode="decimal"
            value={evidenceB}
            onChange={(e) => { setEvidenceB(e.target.value); if (errors.evidenceB) setErrors(prev => ({ ...prev, evidenceB: '' })); }}
            placeholder="e.g. 0.05"
            aria-label={`Evidence probability for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate posterior probability" className="btn-primary">
        Calculate Posterior
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {result.posterior.toFixed(6)}
              </div>
              <div className="text-xs text-gray-500 mt-1">P(A|B) — Posterior Probability</div>
              {result.posterior > 1 && (
                <div className="text-xs text-amber-600 mt-1">Note: Result exceeds 1 — check your input values</div>
              )}
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              {result.formula}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
