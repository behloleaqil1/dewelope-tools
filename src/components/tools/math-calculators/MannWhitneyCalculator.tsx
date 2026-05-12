'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface MannWhitneyResult {
  u1: number;
  u2: number;
  uMin: number;
  n1: number;
  n2: number;
  meanU: number;
  stdU: number;
  zScore: number;
  significant: boolean;
}

/**
 * MannWhitneyCalculator - Calculate Mann-Whitney U test statistic.
 * Non-parametric test for comparing two independent samples.
 */
export default function MannWhitneyCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [sample1, setSample1] = useState('');
  const [sample2, setSample2] = useState('');
  const [alpha, setAlpha] = useState('0.05');
  const [error, setError] = useState('');
  const [result, setResult] = useState<MannWhitneyResult | null>(null);

  const calculate = () => {
    setError('');
    setResult(null);

    const parseValues = (text: string): number[] => {
      return text.split(/[\s,;]+/).filter(Boolean).map(Number).filter((n) => !isNaN(n));
    };

    const vals1 = parseValues(sample1);
    const vals2 = parseValues(sample2);

    if (vals1.length < 2) {
      setError('Sample 1 needs at least 2 numeric values');
      return;
    }
    if (vals2.length < 2) {
      setError('Sample 2 needs at least 2 numeric values');
      return;
    }

    const n1 = vals1.length;
    const n2 = vals2.length;

    // Combine and rank
    const combined = [
      ...vals1.map((v) => ({ value: v, group: 1 })),
      ...vals2.map((v) => ({ value: v, group: 2 })),
    ].sort((a, b) => a.value - b.value);

    // Assign ranks with tie handling
    const ranks = new Array(combined.length);
    let i = 0;
    while (i < combined.length) {
      let j = i;
      while (j < combined.length && combined[j].value === combined[i].value) j++;
      const avgRank = (i + 1 + j) / 2;
      for (let k = i; k < j; k++) ranks[k] = avgRank;
      i = j;
    }

    // Sum ranks for each group
    let r1 = 0;
    let r2 = 0;
    for (let k = 0; k < combined.length; k++) {
      if (combined[k].group === 1) r1 += ranks[k];
      else r2 += ranks[k];
    }

    const u1 = r1 - (n1 * (n1 + 1)) / 2;
    const u2 = r2 - (n2 * (n2 + 1)) / 2;
    const uMin = Math.min(u1, u2);

    // Normal approximation for large samples
    const meanU = (n1 * n2) / 2;
    const stdU = Math.sqrt((n1 * n2 * (n1 + n2 + 1)) / 12);
    const zScore = stdU > 0 ? (uMin - meanU) / stdU : 0;

    const alphaVal = parseFloat(alpha) || 0.05;
    const zCritical = alphaVal === 0.01 ? 2.576 : alphaVal === 0.05 ? 1.96 : 1.645;
    const significant = Math.abs(zScore) > zCritical;

    setResult({ u1, u2, uMin, n1, n2, meanU, stdU, zScore, significant });
  };

  const copyText = result
    ? `Mann-Whitney U Test\nU1: ${result.u1.toFixed(1)}\nU2: ${result.u2.toFixed(1)}\nU (min): ${result.uMin.toFixed(1)}\nn1: ${result.n1}, n2: ${result.n2}\nZ-score: ${result.zScore.toFixed(4)}\nSignificant (α=${alpha}): ${result.significant ? 'Yes' : 'No'}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputArea error={error && error.includes('1') ? error : ''}>
          <label htmlFor={`${toolId}-s1`} className="block text-sm font-medium text-gray-700 mb-1">
            Sample 1 (comma or space separated)
          </label>
          <textarea
            id={`${toolId}-s1`}
            value={sample1}
            onChange={(e) => setSample1(e.target.value)}
            placeholder="e.g. 12, 15, 18, 22, 25"
            aria-label={`Sample 1 for ${toolName}`}
            className="input-field h-24 resize-y"
          />
        </InputArea>
        <InputArea error={error && error.includes('2') ? error : ''}>
          <label htmlFor={`${toolId}-s2`} className="block text-sm font-medium text-gray-700 mb-1">
            Sample 2 (comma or space separated)
          </label>
          <textarea
            id={`${toolId}-s2`}
            value={sample2}
            onChange={(e) => setSample2(e.target.value)}
            placeholder="e.g. 8, 10, 14, 16, 20"
            aria-label={`Sample 2 for ${toolName}`}
            className="input-field h-24 resize-y"
          />
        </InputArea>
      </div>

      <InputArea>
        <label htmlFor={`${toolId}-alpha`} className="block text-sm font-medium text-gray-700 mb-1">
          Significance Level (α)
        </label>
        <select id={`${toolId}-alpha`} value={alpha} onChange={(e) => setAlpha(e.target.value)} aria-label={`Alpha level for ${toolName}`} className="input-field w-40">
          <option value="0.01">0.01</option>
          <option value="0.05">0.05</option>
          <option value="0.10">0.10</option>
        </select>
      </InputArea>

      {error && !error.includes('1') && !error.includes('2') && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button onClick={calculate} aria-label="Calculate Mann-Whitney U" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.u1.toFixed(1)}</div>
                <div className="text-xs text-gray-500 mt-1">U₁</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.u2.toFixed(1)}</div>
                <div className="text-xs text-gray-500 mt-1">U₂</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-purple-600">{result.uMin.toFixed(1)}</div>
                <div className="text-xs text-gray-500 mt-1">U (min)</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-700">{result.zScore.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Z-score</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-700">n₁={result.n1}, n₂={result.n2}</div>
                <div className="text-xs text-gray-500 mt-1">Sample Sizes</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className={`text-xl font-bold ${result.significant ? 'text-green-600' : 'text-red-600'}`}>
                  {result.significant ? 'Yes' : 'No'}
                </div>
                <div className="text-xs text-gray-500 mt-1">Significant (α={alpha})</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
