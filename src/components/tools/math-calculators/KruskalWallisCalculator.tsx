'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * KruskalWallisCalculator - Calculate Kruskal-Wallis H test for comparing 3+ groups.
 * Non-parametric alternative to one-way ANOVA.
 */
export default function KruskalWallisCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [groups, setGroups] = useState<string[]>(['', '', '']);
  const [alpha, setAlpha] = useState('0.05');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    H: number; df: number; pValue: number; N: number;
    groupRanks: { n: number; rankSum: number; meanRank: number }[];
    significant: boolean;
  } | null>(null);

  const addGroup = () => setGroups([...groups, '']);
  const removeGroup = (idx: number) => { if (groups.length > 3) setGroups(groups.filter((_, i) => i !== idx)); };

  const calculate = () => {
    setError('');
    setResult(null);

    const parsedGroups = groups.map((g) => g.trim().split(/[\s,]+/).map(Number).filter((n) => !isNaN(n)));

    if (parsedGroups.some((g) => g.length < 2)) {
      setError('Each group needs at least 2 values');
      return;
    }

    const alphaVal = parseFloat(alpha);
    if (isNaN(alphaVal) || alphaVal <= 0 || alphaVal >= 1) {
      setError('Alpha must be between 0 and 1');
      return;
    }

    // Combine all values with group labels
    const allValues: { value: number; group: number }[] = [];
    parsedGroups.forEach((group, gIdx) => {
      group.forEach((val) => allValues.push({ value: val, group: gIdx }));
    });

    const N = allValues.length;

    // Rank all values together
    allValues.sort((a, b) => a.value - b.value);

    // Assign ranks with ties
    const ranks: number[] = new Array(N);
    let i = 0;
    while (i < N) {
      let j = i;
      while (j < N && allValues[j].value === allValues[i].value) j++;
      const avgRank = (i + 1 + j) / 2;
      for (let k = i; k < j; k++) ranks[k] = avgRank;
      i = j;
    }

    // Calculate rank sums per group
    const groupRankSums: number[] = new Array(parsedGroups.length).fill(0);
    for (let k = 0; k < N; k++) {
      groupRankSums[allValues[k].group] += ranks[k];
    }

    // Calculate H statistic
    let H = 0;
    const groupInfo = parsedGroups.map((g, idx) => {
      const n = g.length;
      const rankSum = groupRankSums[idx];
      const meanRank = rankSum / n;
      H += (rankSum * rankSum) / n;
      return { n, rankSum, meanRank };
    });

    H = (12 / (N * (N + 1))) * H - 3 * (N + 1);

    // Degrees of freedom
    const df = parsedGroups.length - 1;

    // Approximate p-value using chi-squared distribution
    const pValue = 1 - chiSquaredCDF(H, df);

    setResult({
      H, df, pValue, N, groupRanks: groupInfo,
      significant: pValue < alphaVal,
    });
  };

  // Chi-squared CDF approximation using regularized incomplete gamma function
  function chiSquaredCDF(x: number, k: number): number {
    if (x <= 0) return 0;
    return regularizedGammaP(k / 2, x / 2);
  }

  function regularizedGammaP(a: number, x: number): number {
    if (x < a + 1) {
      let sum = 1 / a;
      let term = 1 / a;
      for (let n = 1; n < 200; n++) {
        term *= x / (a + n);
        sum += term;
        if (Math.abs(term) < 1e-10) break;
      }
      return sum * Math.exp(-x + a * Math.log(x) - logGamma(a));
    } else {
      let f = 1;
      let c = 1;
      let d = 1 / (x + 1 - a);
      f = d;
      for (let n = 1; n < 200; n++) {
        const an = -n * (n - a);
        const bn = x + 2 * n + 1 - a;
        d = bn + an * d;
        if (Math.abs(d) < 1e-30) d = 1e-30;
        c = bn + an / c;
        if (Math.abs(c) < 1e-30) c = 1e-30;
        d = 1 / d;
        const delta = d * c;
        f *= delta;
        if (Math.abs(delta - 1) < 1e-10) break;
      }
      return 1 - f * Math.exp(-x + a * Math.log(x) - logGamma(a));
    }
  }

  function logGamma(x: number): number {
    const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
    let y = x;
    let tmp = x + 5.5;
    tmp -= (x + 0.5) * Math.log(tmp);
    let ser = 1.000000000190015;
    for (let j = 0; j < 6; j++) { y += 1; ser += c[j] / y; }
    return -tmp + Math.log(2.5066282746310005 * ser / x);
  }

  const copyText = result
    ? `Kruskal-Wallis H Test\nH statistic: ${result.H.toFixed(4)}\nDegrees of freedom: ${result.df}\nP-value: ${result.pValue.toFixed(6)}\nN (total): ${result.N}\nSignificant (α=${alpha}): ${result.significant ? 'Yes' : 'No'}\n\nGroup Mean Ranks:\n${result.groupRanks.map((g, i) => `Group ${i + 1}: n=${g.n}, rank sum=${g.rankSum.toFixed(1)}, mean rank=${g.meanRank.toFixed(2)}`).join('\n')}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-3">
        {groups.map((group, idx) => (
          <InputArea key={idx}>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor={`${toolId}-g${idx}`} className="block text-sm font-medium text-gray-700">Group {idx + 1}</label>
              {groups.length > 3 && (
                <button onClick={() => removeGroup(idx)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
              )}
            </div>
            <input id={`${toolId}-g${idx}`} type="text" value={group} onChange={(e) => { const g = [...groups]; g[idx] = e.target.value; setGroups(g); }} placeholder="e.g. 12, 15, 18, 22, 25" aria-label={`Group ${idx + 1} for ${toolName}`} className="input-field font-mono" />
          </InputArea>
        ))}
      </div>

      <div className="flex gap-3 items-end">
        <button onClick={addGroup} className="text-sm text-blue-600 hover:text-blue-800 underline">+ Add Group</button>
        <InputArea error={error}>
          <label htmlFor={`${toolId}-alpha`} className="block text-sm font-medium text-gray-700 mb-1">α</label>
          <input id={`${toolId}-alpha`} type="text" inputMode="decimal" value={alpha} onChange={(e) => setAlpha(e.target.value)} className="input-field w-24" aria-label={`Alpha for ${toolName}`} />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate Kruskal-Wallis test" className="btn-primary">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.H.toFixed(4)}</div>
                <div className="text-xs text-gray-500">H statistic</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-purple-600">{result.df}</div>
                <div className="text-xs text-gray-500">df</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className={`text-xl font-bold ${result.significant ? 'text-red-600' : 'text-gray-600'}`}>{result.pValue.toFixed(6)}</div>
                <div className="text-xs text-gray-500">P-value</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-green-600">{result.N}</div>
                <div className="text-xs text-gray-500">N (total)</div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Group Mean Ranks</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {result.groupRanks.map((g, i) => (
                  <div key={i} className="bg-gray-50 p-2 rounded border border-gray-200 text-sm">
                    <span className="font-medium">Group {i + 1}:</span> n={g.n}, mean rank={g.meanRank.toFixed(2)}
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-3 rounded-lg border ${result.significant ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
              <p className={`text-sm font-medium ${result.significant ? 'text-red-700' : 'text-green-700'}`}>
                {result.significant
                  ? `Significant difference between groups (H=${result.H.toFixed(4)}, p=${result.pValue.toFixed(6)} < α=${alpha}). Reject H₀.`
                  : `No significant difference (H=${result.H.toFixed(4)}, p=${result.pValue.toFixed(6)} ≥ α=${alpha}). Fail to reject H₀.`}
              </p>
            </div>

            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
