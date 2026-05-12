'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TTestCalculator - Calculate t-test statistic and approximate p-value.
 * Supports independent two-sample t-test and one-sample t-test.
 */
export default function TTestCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [testType, setTestType] = useState<'one-sample' | 'two-sample'>('two-sample');
  const [sample1, setSample1] = useState('');
  const [sample2, setSample2] = useState('');
  const [hypothesizedMean, setHypothesizedMean] = useState('0');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    tStatistic: number;
    degreesOfFreedom: number;
    pValue: number;
    mean1: number;
    mean2?: number;
    n1: number;
    n2?: number;
    significant: boolean;
  } | null>(null);

  function parseNumbers(text: string): number[] {
    return text
      .split(/[\s,;]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map(Number)
      .filter((n) => !isNaN(n));
  }

  function mean(arr: number[]): number {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  function variance(arr: number[], m: number): number {
    return arr.reduce((sum, x) => sum + (x - m) ** 2, 0) / (arr.length - 1);
  }

  // Approximate p-value using the t-distribution (Abramowitz & Stegun approximation)
  function tDistPValue(t: number, df: number): number {
    // Use a simple approximation for the two-tailed p-value
    const absT = Math.abs(t);
    // Normal approximation for large df
    if (df > 100) {
      const cdf = 0.5 * (1 + erf(absT / Math.sqrt(2)));
      return 2 * (1 - cdf);
    }
    // For smaller df, use a series approximation
    let p = 0;
    const step = 0.0001;
    for (let i = absT; i < 20; i += step) {
      p += step * Math.pow(1 + (i * i) / df, -(df + 1) / 2);
    }
    const coeff = gamma((df + 1) / 2) / (Math.sqrt(df * Math.PI) * gamma(df / 2));
    return Math.min(1, 2 * coeff * p);
  }

  function erf(x: number): number {
    const t = 1 / (1 + 0.3275911 * Math.abs(x));
    const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
    const result = 1 - poly * Math.exp(-x * x);
    return x >= 0 ? result : -result;
  }

  function gamma(n: number): number {
    // Stirling's approximation for gamma function
    if (n === 1) return 1;
    if (n === 0.5) return Math.sqrt(Math.PI);
    if (n < 0.5) return Math.PI / (Math.sin(Math.PI * n) * gamma(1 - n));
    // Lanczos approximation
    const g = 7;
    const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    const x = n - 1;
    let sum = c[0];
    for (let i = 1; i < g + 2; i++) {
      sum += c[i] / (x + i);
    }
    const t = x + g + 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, x + 0.5) * Math.exp(-t) * sum;
  }

  function calculate() {
    const newErrors: Record<string, string> = {};

    const data1 = parseNumbers(sample1);
    if (data1.length < 2) {
      newErrors.sample1 = 'Enter at least 2 numbers separated by commas or spaces';
    }

    if (testType === 'two-sample') {
      const data2 = parseNumbers(sample2);
      if (data2.length < 2) {
        newErrors.sample2 = 'Enter at least 2 numbers separated by commas or spaces';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setResult(null);
        return;
      }

      setErrors({});

      const m1 = mean(data1);
      const m2 = mean(data2);
      const v1 = variance(data1, m1);
      const v2 = variance(data2, m2);
      const n1 = data1.length;
      const n2 = data2.length;

      const tStat = (m1 - m2) / Math.sqrt(v1 / n1 + v2 / n2);

      // Welch's degrees of freedom
      const num = (v1 / n1 + v2 / n2) ** 2;
      const denom = (v1 / n1) ** 2 / (n1 - 1) + (v2 / n2) ** 2 / (n2 - 1);
      const df = Math.floor(num / denom);

      const pValue = tDistPValue(tStat, df);

      setResult({
        tStatistic: tStat,
        degreesOfFreedom: df,
        pValue,
        mean1: m1,
        mean2: m2,
        n1,
        n2,
        significant: pValue < 0.05,
      });
    } else {
      const mu = parseFloat(hypothesizedMean);
      if (isNaN(mu)) {
        newErrors.hypothesizedMean = 'Enter a valid number';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setResult(null);
        return;
      }

      setErrors({});

      const m1 = mean(data1);
      const v1 = variance(data1, m1);
      const n1 = data1.length;
      const df = n1 - 1;

      const tStat = (m1 - mu) / Math.sqrt(v1 / n1);
      const pValue = tDistPValue(tStat, df);

      setResult({
        tStatistic: tStat,
        degreesOfFreedom: df,
        pValue,
        mean1: m1,
        n1,
        significant: pValue < 0.05,
      });
    }
  }

  const copyText = result
    ? `T-Test Results:\nt-statistic: ${result.tStatistic.toFixed(4)}\nDegrees of freedom: ${result.degreesOfFreedom}\np-value: ${result.pValue.toFixed(6)}\nSignificant (α=0.05): ${result.significant ? 'Yes' : 'No'}\nSample 1 mean: ${result.mean1.toFixed(4)}${result.mean2 !== undefined ? `\nSample 2 mean: ${result.mean2.toFixed(4)}` : ''}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={errors.sample1 || errors.sample2 || errors.hypothesizedMean}>
        <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">
          Test Type
        </label>
        <select
          id={`${toolId}-type`}
          value={testType}
          onChange={(e) => setTestType(e.target.value as 'one-sample' | 'two-sample')}
          aria-label={`Test type for ${toolName}`}
          className="input-field w-56 mb-3"
        >
          <option value="two-sample">Independent Two-Sample</option>
          <option value="one-sample">One-Sample</option>
        </select>

        <label htmlFor={`${toolId}-sample1`} className="block text-sm font-medium text-gray-700 mb-1">
          Sample 1 (comma or space separated)
        </label>
        <textarea
          id={`${toolId}-sample1`}
          value={sample1}
          onChange={(e) => { setSample1(e.target.value); if (errors.sample1) setErrors((p) => ({ ...p, sample1: '' })); }}
          placeholder="e.g. 5.2, 6.1, 4.8, 7.3, 5.9"
          aria-label={`Sample 1 data for ${toolName}`}
          className="input-field h-24 resize-y mb-3"
        />

        {testType === 'two-sample' ? (
          <>
            <label htmlFor={`${toolId}-sample2`} className="block text-sm font-medium text-gray-700 mb-1">
              Sample 2 (comma or space separated)
            </label>
            <textarea
              id={`${toolId}-sample2`}
              value={sample2}
              onChange={(e) => { setSample2(e.target.value); if (errors.sample2) setErrors((p) => ({ ...p, sample2: '' })); }}
              placeholder="e.g. 4.1, 5.3, 3.9, 6.0, 4.7"
              aria-label={`Sample 2 data for ${toolName}`}
              className="input-field h-24 resize-y"
            />
          </>
        ) : (
          <>
            <label htmlFor={`${toolId}-mu`} className="block text-sm font-medium text-gray-700 mb-1">
              Hypothesized Mean (μ₀)
            </label>
            <input
              id={`${toolId}-mu`}
              type="text"
              inputMode="decimal"
              value={hypothesizedMean}
              onChange={(e) => { setHypothesizedMean(e.target.value); if (errors.hypothesizedMean) setErrors((p) => ({ ...p, hypothesizedMean: '' })); }}
              placeholder="0"
              aria-label={`Hypothesized mean for ${toolName}`}
              className="input-field w-32"
            />
          </>
        )}
      </InputArea>

      <button onClick={calculate} aria-label="Calculate t-test" className="btn-primary">
        Calculate T-Test
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600">{result.tStatistic.toFixed(4)}</div>
                <div className="text-xs text-gray-500">t-statistic</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-purple-600">{result.degreesOfFreedom}</div>
                <div className="text-xs text-gray-500">df</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className={`text-lg font-bold ${result.pValue < 0.05 ? 'text-red-600' : 'text-green-600'}`}>{result.pValue.toFixed(6)}</div>
                <div className="text-xs text-gray-500">p-value</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className={`text-lg font-bold ${result.significant ? 'text-red-600' : 'text-green-600'}`}>
                  {result.significant ? 'Yes' : 'No'}
                </div>
                <div className="text-xs text-gray-500">Significant (α=0.05)</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p><strong>Sample 1:</strong> n={result.n1}, mean={result.mean1.toFixed(4)}</p>
              {result.mean2 !== undefined && result.n2 !== undefined && (
                <p><strong>Sample 2:</strong> n={result.n2}, mean={result.mean2.toFixed(4)}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {result.significant
                  ? 'The difference is statistically significant at the 0.05 level.'
                  : 'The difference is NOT statistically significant at the 0.05 level.'}
              </p>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
