'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AnovaCalculator - One-way ANOVA F-statistic calculator.
 * Compares means across multiple groups to determine if differences are significant.
 */
export default function AnovaCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [groups, setGroups] = useState<string[]>(['', '', '']);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    fStatistic: number;
    pValue: number;
    dfBetween: number;
    dfWithin: number;
    ssBetween: number;
    ssWithin: number;
    msBetween: number;
    msWithin: number;
    groupMeans: number[];
    grandMean: number;
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

  function addGroup() {
    if (groups.length < 10) setGroups([...groups, '']);
  }

  function removeGroup(idx: number) {
    if (groups.length > 2) setGroups(groups.filter((_, i) => i !== idx));
  }

  function updateGroup(idx: number, value: string) {
    const newGroups = [...groups];
    newGroups[idx] = value;
    setGroups(newGroups);
  }

  // F-distribution p-value approximation
  function fDistPValue(f: number, df1: number, df2: number): number {
    if (f <= 0) return 1;
    // Use the regularized incomplete beta function approximation
    const x = df2 / (df2 + df1 * f);
    return betaIncomplete(df2 / 2, df1 / 2, x);
  }

  function betaIncomplete(a: number, b: number, x: number): number {
    // Continued fraction approximation
    if (x === 0 || x === 1) return x === 0 ? 1 : 0;
    const lnBeta = lnGamma(a) + lnGamma(b) - lnGamma(a + b);
    const front = Math.exp(Math.log(x) * a + Math.log(1 - x) * b - lnBeta) / a;
    // Use Lentz's algorithm for continued fraction
    let f_val = 1, c = 1, d = 1 - (a + b) * x / (a + 1);
    if (Math.abs(d) < 1e-30) d = 1e-30;
    d = 1 / d;
    f_val = d;
    for (let m = 1; m <= 200; m++) {
      let numerator = m * (b - m) * x / ((a + 2 * m - 1) * (a + 2 * m));
      d = 1 + numerator * d;
      if (Math.abs(d) < 1e-30) d = 1e-30;
      c = 1 + numerator / c;
      if (Math.abs(c) < 1e-30) c = 1e-30;
      d = 1 / d;
      f_val *= c * d;
      numerator = -(a + m) * (a + b + m) * x / ((a + 2 * m) * (a + 2 * m + 1));
      d = 1 + numerator * d;
      if (Math.abs(d) < 1e-30) d = 1e-30;
      c = 1 + numerator / c;
      if (Math.abs(c) < 1e-30) c = 1e-30;
      d = 1 / d;
      const delta = c * d;
      f_val *= delta;
      if (Math.abs(delta - 1) < 1e-8) break;
    }
    return 1 - front * f_val;
  }

  function lnGamma(z: number): number {
    const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
    const x = z;
    let y = z;
    let tmp = x + 5.5;
    tmp -= (x + 0.5) * Math.log(tmp);
    let ser = 1.000000000190015;
    for (let j = 0; j < 6; j++) {
      y += 1;
      ser += c[j] / y;
    }
    return -tmp + Math.log(2.5066282746310005 * ser / x);
  }

  function calculate() {
    setError('');
    setResult(null);

    const parsedGroups = groups.map(parseNumbers);
    const validGroups = parsedGroups.filter((g) => g.length >= 2);

    if (validGroups.length < 2) {
      setError('Enter at least 2 groups with at least 2 values each');
      return;
    }

    const k = validGroups.length;
    const allValues = validGroups.flat();
    const N = allValues.length;
    const grandMean = allValues.reduce((a, b) => a + b, 0) / N;

    const groupMeans = validGroups.map((g) => g.reduce((a, b) => a + b, 0) / g.length);

    // Sum of squares between groups
    const ssBetween = validGroups.reduce((sum, group, i) => {
      return sum + group.length * (groupMeans[i] - grandMean) ** 2;
    }, 0);

    // Sum of squares within groups
    const ssWithin = validGroups.reduce((sum, group, i) => {
      return sum + group.reduce((s, val) => s + (val - groupMeans[i]) ** 2, 0);
    }, 0);

    const dfBetween = k - 1;
    const dfWithin = N - k;

    const msBetween = ssBetween / dfBetween;
    const msWithin = ssWithin / dfWithin;

    const fStatistic = msBetween / msWithin;
    const pValue = fDistPValue(fStatistic, dfBetween, dfWithin);

    setResult({
      fStatistic,
      pValue,
      dfBetween,
      dfWithin,
      ssBetween,
      ssWithin,
      msBetween,
      msWithin,
      groupMeans,
      grandMean,
      significant: pValue < 0.05,
    });
  }

  const copyText = result
    ? `One-Way ANOVA Results:\nF-statistic: ${result.fStatistic.toFixed(4)}\ndf (between): ${result.dfBetween}\ndf (within): ${result.dfWithin}\np-value: ${result.pValue.toFixed(6)}\nSignificant (α=0.05): ${result.significant ? 'Yes' : 'No'}\nGrand Mean: ${result.grandMean.toFixed(4)}\nGroup Means: ${result.groupMeans.map((m) => m.toFixed(4)).join(', ')}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          {groups.map((group, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor={`${toolId}-group-${idx}`} className="text-sm font-medium text-gray-700">
                  Group {idx + 1}
                </label>
                {groups.length > 2 && (
                  <button
                    onClick={() => removeGroup(idx)}
                    className="text-xs text-red-500 hover:text-red-700"
                    aria-label={`Remove group ${idx + 1}`}
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                id={`${toolId}-group-${idx}`}
                type="text"
                value={group}
                onChange={(e) => updateGroup(idx, e.target.value)}
                placeholder="e.g. 5.2, 6.1, 4.8, 7.3"
                aria-label={`Group ${idx + 1} data for ${toolName}`}
                className="input-field"
              />
            </div>
          ))}
        </div>
        {groups.length < 10 && (
          <button
            onClick={addGroup}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            aria-label="Add another group"
          >
            + Add Group
          </button>
        )}
      </InputArea>

      <button onClick={calculate} aria-label="Calculate ANOVA" className="btn-primary">
        Calculate ANOVA
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600">{result.fStatistic.toFixed(4)}</div>
                <div className="text-xs text-gray-500">F-statistic</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className={`text-lg font-bold ${result.pValue < 0.05 ? 'text-red-600' : 'text-green-600'}`}>{result.pValue.toFixed(6)}</div>
                <div className="text-xs text-gray-500">p-value</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-purple-600">{result.dfBetween}, {result.dfWithin}</div>
                <div className="text-xs text-gray-500">df (between, within)</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className={`text-lg font-bold ${result.significant ? 'text-red-600' : 'text-green-600'}`}>
                  {result.significant ? 'Yes' : 'No'}
                </div>
                <div className="text-xs text-gray-500">Significant (α=0.05)</div>
              </div>
            </div>

            <div className="text-sm bg-gray-50 p-3 rounded-lg border border-gray-200">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="py-1 text-left text-gray-600">Source</th>
                    <th className="py-1 text-right text-gray-600">SS</th>
                    <th className="py-1 text-right text-gray-600">df</th>
                    <th className="py-1 text-right text-gray-600">MS</th>
                    <th className="py-1 text-right text-gray-600">F</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-1">Between</td>
                    <td className="py-1 text-right">{result.ssBetween.toFixed(4)}</td>
                    <td className="py-1 text-right">{result.dfBetween}</td>
                    <td className="py-1 text-right">{result.msBetween.toFixed(4)}</td>
                    <td className="py-1 text-right">{result.fStatistic.toFixed(4)}</td>
                  </tr>
                  <tr>
                    <td className="py-1">Within</td>
                    <td className="py-1 text-right">{result.ssWithin.toFixed(4)}</td>
                    <td className="py-1 text-right">{result.dfWithin}</td>
                    <td className="py-1 text-right">{result.msWithin.toFixed(4)}</td>
                    <td className="py-1 text-right">—</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="text-sm text-gray-600">
              <p><strong>Grand Mean:</strong> {result.grandMean.toFixed(4)}</p>
              <p><strong>Group Means:</strong> {result.groupMeans.map((m, i) => `Group ${i + 1}: ${m.toFixed(4)}`).join(', ')}</p>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
