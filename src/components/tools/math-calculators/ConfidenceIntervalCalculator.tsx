'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const Z_SCORES: Record<string, number> = {
  '90': 1.645,
  '95': 1.96,
  '99': 2.576,
  '99.9': 3.291,
};

/**
 * ConfidenceIntervalCalculator - Calculate confidence interval for a mean.
 * Uses z-score for known population standard deviation.
 */
export default function ConfidenceIntervalCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mean, setMean] = useState('');
  const [stdDev, setStdDev] = useState('');
  const [sampleSize, setSampleSize] = useState('');
  const [confidence, setConfidence] = useState('95');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    lower: number; upper: number; marginOfError: number; standardError: number;
  } | null>(null);

  function calculate() {
    const newErrors: Record<string, string> = {};
    const m = parseFloat(mean);
    const sd = parseFloat(stdDev);
    const n = parseFloat(sampleSize);

    if (!mean.trim() || isNaN(m)) newErrors.mean = 'Enter a valid mean';
    if (!stdDev.trim() || isNaN(sd) || sd <= 0) newErrors.stdDev = 'Enter a valid positive standard deviation';
    if (!sampleSize.trim() || isNaN(n) || n < 2 || !Number.isInteger(n)) newErrors.sampleSize = 'Enter a valid sample size (≥ 2)';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    const z = Z_SCORES[confidence] || 1.96;
    const standardError = sd / Math.sqrt(n);
    const marginOfError = z * standardError;
    const lower = m - marginOfError;
    const upper = m + marginOfError;

    setResult({ lower, upper, marginOfError, standardError });
  }

  const copyText = result
    ? `Confidence Interval (${confidence}%)\nMean: ${mean}\nLower Bound: ${result.lower.toFixed(4)}\nUpper Bound: ${result.upper.toFixed(4)}\nMargin of Error: ±${result.marginOfError.toFixed(4)}\nStandard Error: ${result.standardError.toFixed(4)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea error={errors.mean}>
          <label htmlFor={`${toolId}-mean`} className="block text-sm font-medium text-gray-700 mb-1">
            Sample Mean (x̄)
          </label>
          <input
            id={`${toolId}-mean`}
            type="text"
            inputMode="decimal"
            value={mean}
            onChange={(e) => { setMean(e.target.value); if (errors.mean) setErrors(prev => ({ ...prev, mean: '' })); }}
            placeholder="e.g. 50"
            aria-label={`Sample mean for ${toolName}`}
            className="input-field"
          />
        </InputArea>
        <InputArea error={errors.stdDev}>
          <label htmlFor={`${toolId}-sd`} className="block text-sm font-medium text-gray-700 mb-1">
            Standard Deviation (σ)
          </label>
          <input
            id={`${toolId}-sd`}
            type="text"
            inputMode="decimal"
            value={stdDev}
            onChange={(e) => { setStdDev(e.target.value); if (errors.stdDev) setErrors(prev => ({ ...prev, stdDev: '' })); }}
            placeholder="e.g. 10"
            aria-label={`Standard deviation for ${toolName}`}
            className="input-field"
          />
        </InputArea>
        <InputArea error={errors.sampleSize}>
          <label htmlFor={`${toolId}-n`} className="block text-sm font-medium text-gray-700 mb-1">
            Sample Size (n)
          </label>
          <input
            id={`${toolId}-n`}
            type="text"
            inputMode="numeric"
            value={sampleSize}
            onChange={(e) => { setSampleSize(e.target.value); if (errors.sampleSize) setErrors(prev => ({ ...prev, sampleSize: '' })); }}
            placeholder="e.g. 30"
            aria-label={`Sample size for ${toolName}`}
            className="input-field"
          />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-conf`} className="block text-sm font-medium text-gray-700 mb-1">
            Confidence Level
          </label>
          <select
            id={`${toolId}-conf`}
            value={confidence}
            onChange={(e) => setConfidence(e.target.value)}
            aria-label={`Confidence level for ${toolName}`}
            className="input-field"
          >
            <option value="90">90%</option>
            <option value="95">95%</option>
            <option value="99">99%</option>
            <option value="99.9">99.9%</option>
          </select>
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate confidence interval" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-lg font-bold text-blue-600">
                [{result.lower.toFixed(4)}, {result.upper.toFixed(4)}]
              </div>
              <div className="text-xs text-gray-500 mt-1">{confidence}% Confidence Interval</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-green-600">±{result.marginOfError.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Margin of Error</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-purple-600">{result.standardError.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Standard Error</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              CI = x̄ ± z × (σ / √n) = {mean} ± {Z_SCORES[confidence]} × ({stdDev} / √{sampleSize})
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
