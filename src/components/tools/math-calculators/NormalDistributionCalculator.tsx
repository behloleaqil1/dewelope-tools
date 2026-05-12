'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NormalDistributionCalculator - Calculate probabilities from normal distribution.
 * Uses the error function approximation for the cumulative distribution function.
 */
export default function NormalDistributionCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mean, setMean] = useState('0');
  const [stdDev, setStdDev] = useState('1');
  const [xValue, setXValue] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ zScore: number; pBelow: number; pAbove: number; pdfValue: number } | null>(null);

  function erf(x: number): number {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;
    const sign = x < 0 ? -1 : 1;
    const absX = Math.abs(x);
    const t = 1.0 / (1.0 + p * absX);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
    return sign * y;
  }

  function cdf(x: number, mu: number, sigma: number): number {
    return 0.5 * (1 + erf((x - mu) / (sigma * Math.sqrt(2))));
  }

  function pdf(x: number, mu: number, sigma: number): number {
    const exponent = -0.5 * Math.pow((x - mu) / sigma, 2);
    return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
  }

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const mu = parseFloat(mean);
    const sigma = parseFloat(stdDev);
    const x = parseFloat(xValue);

    if (isNaN(mu)) newErrors.mean = 'Enter a valid number';
    if (isNaN(sigma) || sigma <= 0) newErrors.stdDev = 'Enter a positive number';
    if (!xValue.trim() || isNaN(x)) newErrors.xValue = 'Enter a valid number';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    const zScore = (x - mu) / sigma;
    const pBelow = cdf(x, mu, sigma);
    const pAbove = 1 - pBelow;
    const pdfValue = pdf(x, mu, sigma);
    setResult({ zScore, pBelow, pAbove, pdfValue });
  };

  const copyText = result
    ? `Z-Score: ${result.zScore.toFixed(4)}\nP(X ≤ x): ${result.pBelow.toFixed(6)}\nP(X > x): ${result.pAbove.toFixed(6)}\nPDF f(x): ${result.pdfValue.toFixed(6)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputArea error={errors.mean}>
          <label htmlFor={`${toolId}-mean`} className="block text-sm font-medium text-gray-700 mb-1">Mean (μ)</label>
          <input
            id={`${toolId}-mean`}
            type="text"
            inputMode="decimal"
            value={mean}
            onChange={(e) => { setMean(e.target.value); if (errors.mean) setErrors(prev => ({ ...prev, mean: '' })); }}
            placeholder="0"
            aria-label={`Mean for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.stdDev}>
          <label htmlFor={`${toolId}-std`} className="block text-sm font-medium text-gray-700 mb-1">Std Dev (σ)</label>
          <input
            id={`${toolId}-std`}
            type="text"
            inputMode="decimal"
            value={stdDev}
            onChange={(e) => { setStdDev(e.target.value); if (errors.stdDev) setErrors(prev => ({ ...prev, stdDev: '' })); }}
            placeholder="1"
            aria-label={`Standard deviation for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.xValue}>
          <label htmlFor={`${toolId}-x`} className="block text-sm font-medium text-gray-700 mb-1">X Value</label>
          <input
            id={`${toolId}-x`}
            type="text"
            inputMode="decimal"
            value={xValue}
            onChange={(e) => { setXValue(e.target.value); if (errors.xValue) setErrors(prev => ({ ...prev, xValue: '' })); }}
            placeholder="e.g. 1.96"
            aria-label={`X value for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate normal distribution" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.zScore.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Z-Score</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-green-600">{result.pBelow.toFixed(6)}</div>
                <div className="text-xs text-gray-500 mt-1">P(X ≤ x)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-red-600">{result.pAbove.toFixed(6)}</div>
                <div className="text-xs text-gray-500 mt-1">P(X &gt; x)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-purple-600">{result.pdfValue.toFixed(6)}</div>
                <div className="text-xs text-gray-500 mt-1">PDF f(x)</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
