'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ChiSquareCalculator - Calculate chi-square statistic from observed/expected values.
 * χ² = Σ((O - E)² / E)
 */
export default function ChiSquareCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [observed, setObserved] = useState('');
  const [expected, setExpected] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ chiSquare: number; df: number; contributions: { o: number; e: number; contrib: number }[] } | null>(null);

  const calculate = () => {
    setError('');
    setResult(null);

    const obsArr = observed.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    const expArr = expected.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));

    if (obsArr.length < 2) { setError('Enter at least 2 observed values (comma-separated)'); return; }
    if (expArr.length < 2) { setError('Enter at least 2 expected values (comma-separated)'); return; }
    if (obsArr.length !== expArr.length) { setError('Observed and expected must have the same number of values'); return; }
    if (expArr.some(e => e <= 0)) { setError('Expected values must be greater than 0'); return; }

    const contributions = obsArr.map((o, i) => {
      const e = expArr[i];
      const contrib = Math.pow(o - e, 2) / e;
      return { o, e, contrib };
    });

    const chiSquare = contributions.reduce((sum, c) => sum + c.contrib, 0);
    const df = obsArr.length - 1;

    setResult({ chiSquare, df, contributions });
  };

  const copyText = result
    ? `Chi-Square (χ²) = ${result.chiSquare.toFixed(4)}\nDegrees of Freedom = ${result.df}\nFormula: χ² = Σ((O - E)² / E)`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-observed`} className="block text-sm font-medium text-gray-700 mb-1">Observed Values (comma-separated)</label>
            <input id={`${toolId}-observed`} type="text" value={observed} onChange={(e) => setObserved(e.target.value)} placeholder="e.g. 50, 30, 20" aria-label={`Observed values for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-expected`} className="block text-sm font-medium text-gray-700 mb-1">Expected Values (comma-separated)</label>
            <input id={`${toolId}-expected`} type="text" value={expected} onChange={(e) => setExpected(e.target.value)} placeholder="e.g. 40, 35, 25" aria-label={`Expected values for ${toolName}`} className="input-field" />
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate chi-square" className="btn-primary">Calculate χ²</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.chiSquare.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">χ² Statistic</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{result.df}</div>
                <div className="text-xs text-gray-500 mt-1">Degrees of Freedom</div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Contributions per Category</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-gray-500"><th className="pr-4">Observed</th><th className="pr-4">Expected</th><th>(O-E)²/E</th></tr></thead>
                  <tbody>
                    {result.contributions.map((c, i) => (
                      <tr key={i} className="border-t border-gray-100">
                        <td className="pr-4 py-1">{c.o}</td>
                        <td className="pr-4 py-1">{c.e}</td>
                        <td className="py-1">{c.contrib.toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              χ² = Σ((O - E)² / E) = {result.chiSquare.toFixed(4)}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
