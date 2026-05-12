'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

type SeriesType = 'geometric' | 'p-series' | 'harmonic' | 'alternating' | 'ratio-test';

interface Result {
  converges: boolean | null;
  explanation: string;
  sum?: string;
  test: string;
}

/**
 * SeriesConvergenceChecker - Check if an infinite series converges or diverges.
 * Supports geometric, p-series, harmonic, alternating, and ratio test analysis.
 */
export default function SeriesConvergenceChecker({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [seriesType, setSeriesType] = useState<SeriesType>('geometric');
  const [paramA, setParamA] = useState('');
  const [paramB, setParamB] = useState('');
  const [result, setResult] = useState<Result | null>(null);

  function handleCheck() {
    const a = parseFloat(paramA);
    const b = parseFloat(paramB);

    switch (seriesType) {
      case 'geometric': {
        if (isNaN(a) || isNaN(b)) { setResult({ converges: null, explanation: 'Enter first term (a) and common ratio (r).', test: 'Geometric Series' }); return; }
        const converges = Math.abs(b) < 1;
        const sum = converges ? (a / (1 - b)).toFixed(6) : undefined;
        setResult({
          converges,
          explanation: converges
            ? `|r| = ${Math.abs(b).toFixed(4)} < 1, so the series converges. Sum = a/(1-r) = ${a}/(1-${b}) = ${sum}`
            : `|r| = ${Math.abs(b).toFixed(4)} ≥ 1, so the series diverges.`,
          sum,
          test: 'Geometric Series Test',
        });
        break;
      }
      case 'p-series': {
        if (isNaN(a)) { setResult({ converges: null, explanation: 'Enter the value of p for Σ 1/n^p.', test: 'P-Series' }); return; }
        const converges = a > 1;
        setResult({
          converges,
          explanation: converges
            ? `p = ${a} > 1, so the p-series Σ 1/n^${a} converges.`
            : `p = ${a} ≤ 1, so the p-series Σ 1/n^${a} diverges.`,
          test: 'P-Series Test',
        });
        break;
      }
      case 'harmonic': {
        setResult({
          converges: false,
          explanation: 'The harmonic series Σ 1/n always diverges. This is a p-series with p = 1.',
          test: 'Harmonic Series (p-series with p=1)',
        });
        break;
      }
      case 'alternating': {
        if (isNaN(a)) { setResult({ converges: null, explanation: 'Enter the exponent p for Σ (-1)^n / n^p.', test: 'Alternating Series' }); return; }
        const converges = a > 0;
        setResult({
          converges,
          explanation: converges
            ? `For Σ (-1)^n / n^${a}: since 1/n^${a} → 0 and is decreasing for p > 0, the alternating series converges by the Alternating Series Test.`
            : `p = ${a} ≤ 0, so the terms do not approach zero. The series diverges.`,
          test: 'Alternating Series Test (Leibniz)',
        });
        break;
      }
      case 'ratio-test': {
        if (isNaN(a)) { setResult({ converges: null, explanation: 'Enter the limit L = lim |a(n+1)/a(n)|.', test: 'Ratio Test' }); return; }
        const converges = a < 1 ? true : a > 1 ? false : null;
        setResult({
          converges,
          explanation: a < 1
            ? `L = ${a} < 1, so the series converges absolutely by the Ratio Test.`
            : a > 1
            ? `L = ${a} > 1, so the series diverges by the Ratio Test.`
            : `L = 1, the Ratio Test is inconclusive. Try another test.`,
          test: 'Ratio Test',
        });
        break;
      }
    }
  }

  const copyText = result
    ? `Test: ${result.test}\nResult: ${result.converges === true ? 'CONVERGES' : result.converges === false ? 'DIVERGES' : 'INCONCLUSIVE'}\n${result.explanation}${result.sum ? `\nSum: ${result.sum}` : ''}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">
          Series Type / Test
        </label>
        <select
          id={`${toolId}-type`}
          value={seriesType}
          onChange={(e) => { setSeriesType(e.target.value as SeriesType); setResult(null); }}
          aria-label={`Series type for ${toolName}`}
          className="input-field"
        >
          <option value="geometric">Geometric Series (Σ a·r^n)</option>
          <option value="p-series">P-Series (Σ 1/n^p)</option>
          <option value="harmonic">Harmonic Series (Σ 1/n)</option>
          <option value="alternating">Alternating Series (Σ (-1)^n / n^p)</option>
          <option value="ratio-test">Ratio Test (enter limit L)</option>
        </select>
      </InputArea>

      {seriesType === 'geometric' && (
        <div className="grid grid-cols-2 gap-3">
          <InputArea>
            <label htmlFor={`${toolId}-a`} className="block text-sm font-medium text-gray-700 mb-1">First Term (a)</label>
            <input id={`${toolId}-a`} type="text" inputMode="decimal" value={paramA} onChange={(e) => setParamA(e.target.value)} placeholder="e.g. 1" aria-label={`First term for ${toolName}`} className="input-field" />
          </InputArea>
          <InputArea>
            <label htmlFor={`${toolId}-r`} className="block text-sm font-medium text-gray-700 mb-1">Common Ratio (r)</label>
            <input id={`${toolId}-r`} type="text" inputMode="decimal" value={paramB} onChange={(e) => setParamB(e.target.value)} placeholder="e.g. 0.5" aria-label={`Common ratio for ${toolName}`} className="input-field" />
          </InputArea>
        </div>
      )}

      {(seriesType === 'p-series' || seriesType === 'alternating') && (
        <InputArea>
          <label htmlFor={`${toolId}-p`} className="block text-sm font-medium text-gray-700 mb-1">Value of p</label>
          <input id={`${toolId}-p`} type="text" inputMode="decimal" value={paramA} onChange={(e) => setParamA(e.target.value)} placeholder="e.g. 2" aria-label={`P value for ${toolName}`} className="input-field" />
        </InputArea>
      )}

      {seriesType === 'ratio-test' && (
        <InputArea>
          <label htmlFor={`${toolId}-l`} className="block text-sm font-medium text-gray-700 mb-1">Limit L = lim |a(n+1)/a(n)|</label>
          <input id={`${toolId}-l`} type="text" inputMode="decimal" value={paramA} onChange={(e) => setParamA(e.target.value)} placeholder="e.g. 0.75" aria-label={`Limit L for ${toolName}`} className="input-field" />
        </InputArea>
      )}

      <button onClick={handleCheck} aria-label="Check convergence" className="btn-primary">
        Check Convergence
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className={`text-center p-4 rounded-lg border ${result.converges === true ? 'bg-green-50 border-green-200' : result.converges === false ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}>
              <div className={`text-2xl font-bold ${result.converges === true ? 'text-green-600' : result.converges === false ? 'text-red-600' : 'text-yellow-600'}`}>
                {result.converges === true ? 'CONVERGES' : result.converges === false ? 'DIVERGES' : 'INCONCLUSIVE'}
              </div>
              <div className="text-xs text-gray-500 mt-1">{result.test}</div>
            </div>
            <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
              {result.explanation}
            </div>
            {result.sum && (
              <div className="text-sm font-medium text-gray-700 bg-blue-50 p-3 rounded-lg border border-blue-200">
                Sum = {result.sum}
              </div>
            )}
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
