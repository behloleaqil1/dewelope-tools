'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface Outcome {
  value: string;
  probability: string;
}

/**
 * ExpectedValueCalculator - Calculate expected value from outcomes and probabilities.
 * E(X) = Σ (xi × P(xi))
 */
export default function ExpectedValueCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [outcomes, setOutcomes] = useState<Outcome[]>([
    { value: '', probability: '' },
    { value: '', probability: '' },
  ]);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ ev: number; variance: number; stdDev: number; probSum: number } | null>(null);

  const addOutcome = () => {
    setOutcomes([...outcomes, { value: '', probability: '' }]);
  };

  const removeOutcome = (idx: number) => {
    if (outcomes.length <= 2) return;
    setOutcomes(outcomes.filter((_, i) => i !== idx));
  };

  const updateOutcome = (idx: number, key: keyof Outcome, val: string) => {
    const updated = [...outcomes];
    updated[idx] = { ...updated[idx], [key]: val };
    setOutcomes(updated);
  };

  const calculate = () => {
    setError('');
    setResult(null);

    const parsed = outcomes
      .filter((o) => o.value.trim() || o.probability.trim())
      .map((o) => ({
        value: parseFloat(o.value),
        probability: parseFloat(o.probability),
      }));

    if (parsed.length < 2) {
      setError('Enter at least 2 outcomes with values and probabilities');
      return;
    }

    for (const p of parsed) {
      if (isNaN(p.value) || isNaN(p.probability)) {
        setError('All values and probabilities must be valid numbers');
        return;
      }
      if (p.probability < 0 || p.probability > 1) {
        setError('Probabilities must be between 0 and 1');
        return;
      }
    }

    const probSum = parsed.reduce((sum, o) => sum + o.probability, 0);
    if (Math.abs(probSum - 1) > 0.01) {
      setError(`Probabilities should sum to 1 (currently ${probSum.toFixed(4)})`);
      return;
    }

    const ev = parsed.reduce((sum, o) => sum + o.value * o.probability, 0);
    const variance = parsed.reduce((sum, o) => sum + o.probability * Math.pow(o.value - ev, 2), 0);
    const stdDev = Math.sqrt(variance);

    setResult({ ev, variance, stdDev, probSum });
  };

  const copyText = result
    ? `Expected Value E(X): ${result.ev.toFixed(4)}\nVariance: ${result.variance.toFixed(4)}\nStandard Deviation: ${result.stdDev.toFixed(4)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">Outcomes & Probabilities</h3>
          <button onClick={addOutcome} className="text-sm text-blue-600 hover:text-blue-800">+ Add Outcome</button>
        </div>
        {outcomes.map((outcome, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <InputArea>
              <input
                type="text"
                inputMode="decimal"
                value={outcome.value}
                onChange={(e) => updateOutcome(idx, 'value', e.target.value)}
                placeholder={`Value ${idx + 1}`}
                aria-label={`Outcome value ${idx + 1} for ${toolName}`}
                className="input-field text-sm"
              />
            </InputArea>
            <InputArea>
              <input
                type="text"
                inputMode="decimal"
                value={outcome.probability}
                onChange={(e) => updateOutcome(idx, 'probability', e.target.value)}
                placeholder={`P (0-1)`}
                aria-label={`Probability ${idx + 1} for ${toolName}`}
                className="input-field text-sm"
              />
            </InputArea>
            {outcomes.length > 2 && (
              <button onClick={() => removeOutcome(idx)} className="text-red-500 text-sm hover:text-red-700">✕</button>
            )}
          </div>
        ))}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <button onClick={calculate} aria-label="Calculate expected value" className="btn-primary">
        Calculate Expected Value
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.ev.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">E(X)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{result.variance.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Variance</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-purple-600">{result.stdDev.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Std Deviation</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              E(X) = Σ (xi × P(xi)) = {result.ev.toFixed(4)}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
