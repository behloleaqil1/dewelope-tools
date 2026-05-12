'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ProcessSigmaCalculator - Calculate Six Sigma process level from DPMO or defect data.
 * Converts between defects per million opportunities and sigma level.
 */
export default function ProcessSigmaCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'dpmo' | 'defects'>('dpmo');
  const [dpmo, setDpmo] = useState('');
  const [defects, setDefects] = useState('');
  const [units, setUnits] = useState('');
  const [opportunities, setOpportunities] = useState('');
  const [result, setResult] = useState<{ sigma: number; dpmo: number; yield: number } | null>(null);

  const dpmoToSigma = (dpmoVal: number): number => {
    // Approximation using inverse normal distribution + 1.5 shift
    // Sigma ≈ 0.8406 + sqrt(29.37 - 2.221 * ln(dpmo))
    if (dpmoVal <= 0) return 6.0;
    if (dpmoVal >= 1000000) return 0;

    // Lookup table for common values
    const table: [number, number][] = [
      [3.4, 6.0], [233, 5.0], [6210, 4.0],
      [66807, 3.0], [308538, 2.0], [691462, 1.0],
    ];

    // Interpolate between known values
    for (let i = 0; i < table.length - 1; i++) {
      if (dpmoVal <= table[i][0]) return table[i][1];
      if (dpmoVal >= table[i][0] && dpmoVal <= table[i + 1][0]) {
        const ratio = (Math.log(dpmoVal) - Math.log(table[i][0])) /
          (Math.log(table[i + 1][0]) - Math.log(table[i][0]));
        return table[i][1] - ratio * (table[i][1] - table[i + 1][1]);
      }
    }

    // Fallback approximation
    if (dpmoVal > 0 && dpmoVal < 1000000) {
      const val = 0.8406 + Math.sqrt(Math.max(0, 29.37 - 2.221 * Math.log(dpmoVal)));
      return Math.max(0, Math.min(6, val));
    }
    return 0;
  };

  const calculate = () => {
    let dpmoVal: number;

    if (mode === 'dpmo') {
      dpmoVal = parseFloat(dpmo);
      if (isNaN(dpmoVal) || dpmoVal < 0 || dpmoVal > 1000000) {
        setResult(null);
        return;
      }
    } else {
      const d = parseFloat(defects);
      const u = parseFloat(units);
      const o = parseFloat(opportunities);
      if (isNaN(d) || isNaN(u) || isNaN(o) || u <= 0 || o <= 0) {
        setResult(null);
        return;
      }
      dpmoVal = (d / (u * o)) * 1000000;
    }

    const sigma = dpmoToSigma(dpmoVal);
    const yieldPct = ((1000000 - dpmoVal) / 1000000) * 100;

    setResult({ sigma, dpmo: dpmoVal, yield: yieldPct });
  };

  const copyText = result
    ? `Sigma Level: ${result.sigma.toFixed(2)}\nDPMO: ${result.dpmo.toFixed(0)}\nProcess Yield: ${result.yield.toFixed(4)}%`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex gap-4 mb-2">
        <label className="flex items-center gap-2 text-sm">
          <input type="radio" name={`${toolId}-mode`} checked={mode === 'dpmo'} onChange={() => setMode('dpmo')} />
          From DPMO
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="radio" name={`${toolId}-mode`} checked={mode === 'defects'} onChange={() => setMode('defects')} />
          From Defect Data
        </label>
      </div>

      {mode === 'dpmo' ? (
        <InputArea>
          <label htmlFor={`${toolId}-dpmo`} className="block text-sm font-medium text-gray-700 mb-1">
            DPMO (Defects Per Million Opportunities)
          </label>
          <input
            id={`${toolId}-dpmo`}
            type="text"
            inputMode="decimal"
            value={dpmo}
            onChange={(e) => setDpmo(e.target.value)}
            placeholder="e.g., 3.4 (Six Sigma) or 66807 (Three Sigma)"
            aria-label={`DPMO input for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      ) : (
        <div className="space-y-3">
          <InputArea>
            <label htmlFor={`${toolId}-defects`} className="block text-sm font-medium text-gray-700 mb-1">
              Number of Defects
            </label>
            <input
              id={`${toolId}-defects`}
              type="text"
              inputMode="decimal"
              value={defects}
              onChange={(e) => setDefects(e.target.value)}
              placeholder="e.g., 15"
              aria-label={`Defects for ${toolName}`}
              className="input-field"
            />
          </InputArea>
          <InputArea>
            <label htmlFor={`${toolId}-units`} className="block text-sm font-medium text-gray-700 mb-1">
              Number of Units Inspected
            </label>
            <input
              id={`${toolId}-units`}
              type="text"
              inputMode="decimal"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              placeholder="e.g., 1000"
              aria-label={`Units for ${toolName}`}
              className="input-field"
            />
          </InputArea>
          <InputArea>
            <label htmlFor={`${toolId}-opp`} className="block text-sm font-medium text-gray-700 mb-1">
              Opportunities per Unit
            </label>
            <input
              id={`${toolId}-opp`}
              type="text"
              inputMode="decimal"
              value={opportunities}
              onChange={(e) => setOpportunities(e.target.value)}
              placeholder="e.g., 5"
              aria-label={`Opportunities for ${toolName}`}
              className="input-field"
            />
          </InputArea>
        </div>
      )}

      <button onClick={calculate} aria-label="Calculate sigma level" className="btn-primary">
        Calculate Sigma Level
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.sigma.toFixed(2)}σ</div>
                <div className="text-xs text-gray-500 mt-1">Sigma Level</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-800">{result.dpmo.toFixed(0)}</div>
                <div className="text-xs text-gray-500 mt-1">DPMO</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{result.yield.toFixed(4)}%</div>
                <div className="text-xs text-gray-500 mt-1">Process Yield</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
