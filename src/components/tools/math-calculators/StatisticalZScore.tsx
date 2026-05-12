'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * StatisticalZScore - Calculate z-score from value, mean, and standard deviation.
 * Formula: z = (x - μ) / σ
 */
export default function StatisticalZScore({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [mean, setMean] = useState('');
  const [stdDev, setStdDev] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ zScore: number; percentile: number; interpretation: string } | null>(null);

  function calculate() {
    const newErrors: Record<string, string> = {};
    const x = parseFloat(value);
    const mu = parseFloat(mean);
    const sigma = parseFloat(stdDev);

    if (!value.trim() || isNaN(x)) newErrors.value = 'Enter a valid number';
    if (!mean.trim() || isNaN(mu)) newErrors.mean = 'Enter a valid number';
    if (!stdDev.trim() || isNaN(sigma)) newErrors.stdDev = 'Enter a valid number';
    else if (sigma === 0) newErrors.stdDev = 'Standard deviation cannot be zero';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    const zScore = (x - mu) / sigma;

    // Approximate percentile using error function approximation
    const percentile = cumulativeNormal(zScore) * 100;

    let interpretation: string;
    if (Math.abs(zScore) < 1) interpretation = 'Within 1 standard deviation (typical value)';
    else if (Math.abs(zScore) < 2) interpretation = 'Between 1-2 standard deviations (somewhat unusual)';
    else if (Math.abs(zScore) < 3) interpretation = 'Between 2-3 standard deviations (unusual)';
    else interpretation = 'Beyond 3 standard deviations (very unusual/outlier)';

    setResult({ zScore, percentile, interpretation });
  }

  function cumulativeNormal(z: number): number {
    // Approximation of the cumulative distribution function
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = z < 0 ? -1 : 1;
    const absZ = Math.abs(z) / Math.sqrt(2);
    const t = 1.0 / (1.0 + p * absZ);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absZ * absZ);
    return 0.5 * (1.0 + sign * y);
  }

  const copyText = result
    ? `Z-Score: ${result.zScore.toFixed(4)}\nPercentile: ${result.percentile.toFixed(2)}%\nFormula: z = (x - μ) / σ = (${value} - ${mean}) / ${stdDev} = ${result.zScore.toFixed(4)}\n${result.interpretation}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputArea error={errors.value}>
          <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Value (x)</label>
          <input id={`${toolId}-value`} type="text" inputMode="decimal" value={value} onChange={(e) => { setValue(e.target.value); if (errors.value) setErrors((prev) => ({ ...prev, value: '' })); }} placeholder="e.g. 85" aria-label={`Value for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea error={errors.mean}>
          <label htmlFor={`${toolId}-mean`} className="block text-sm font-medium text-gray-700 mb-1">Mean (μ)</label>
          <input id={`${toolId}-mean`} type="text" inputMode="decimal" value={mean} onChange={(e) => { setMean(e.target.value); if (errors.mean) setErrors((prev) => ({ ...prev, mean: '' })); }} placeholder="e.g. 70" aria-label={`Mean for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea error={errors.stdDev}>
          <label htmlFor={`${toolId}-std`} className="block text-sm font-medium text-gray-700 mb-1">Std Deviation (σ)</label>
          <input id={`${toolId}-std`} type="text" inputMode="decimal" value={stdDev} onChange={(e) => { setStdDev(e.target.value); if (errors.stdDev) setErrors((prev) => ({ ...prev, stdDev: '' })); }} placeholder="e.g. 10" aria-label={`Standard deviation for ${toolName}`} className="input-field" />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate z-score" className="btn-primary">
        Calculate Z-Score
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className={`text-2xl font-bold ${result.zScore >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {result.zScore.toFixed(4)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Z-Score</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {result.percentile.toFixed(2)}%
                </div>
                <div className="text-xs text-gray-500 mt-1">Percentile</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              z = (x - μ) / σ = ({value} - {mean}) / {stdDev} = {result.zScore.toFixed(4)}
            </div>
            <div className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              {result.interpretation}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
