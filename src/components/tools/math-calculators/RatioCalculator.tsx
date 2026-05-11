'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RatioCalculator - Solves proportions (A:B = C:D). Enter any three values to find the fourth.
 */
export default function RatioCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [a, setA] = useState('3');
  const [b, setB] = useState('4');
  const [c, setC] = useState('6');
  const [d, setD] = useState('');
  const [result, setResult] = useState<{ missing: string; value: number; formula: string; simplified: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function gcd(x: number, y: number): number {
    x = Math.abs(Math.round(x));
    y = Math.abs(Math.round(y));
    while (y) { [x, y] = [y, x % y]; }
    return x;
  }

  function calculate() {
    setError(undefined);
    setResult(null);

    const aVal = a.trim() ? parseFloat(a) : null;
    const bVal = b.trim() ? parseFloat(b) : null;
    const cVal = c.trim() ? parseFloat(c) : null;
    const dVal = d.trim() ? parseFloat(d) : null;

    const filled = [aVal !== null, bVal !== null, cVal !== null, dVal !== null].filter(Boolean).length;

    if (filled !== 3) {
      setError('Enter exactly three values to find the fourth');
      return;
    }

    if ((aVal !== null && isNaN(aVal)) || (bVal !== null && isNaN(bVal)) || (cVal !== null && isNaN(cVal)) || (dVal !== null && isNaN(dVal))) {
      setError('All entered values must be valid numbers');
      return;
    }

    let missing: string;
    let value: number;
    let formula: string;

    if (aVal === null) {
      if (dVal === 0) { setError('D cannot be zero when solving for A'); return; }
      value = (bVal! * cVal!) / dVal!;
      missing = 'A';
      formula = `A = (B × C) / D = (${bVal} × ${cVal}) / ${dVal}`;
    } else if (bVal === null) {
      if (cVal === 0) { setError('C cannot be zero when solving for B'); return; }
      value = (aVal * dVal!) / cVal!;
      missing = 'B';
      formula = `B = (A × D) / C = (${aVal} × ${dVal}) / ${cVal}`;
    } else if (cVal === null) {
      if (bVal === 0) { setError('B cannot be zero when solving for C'); return; }
      value = (aVal * dVal!) / bVal;
      missing = 'C';
      formula = `C = (A × D) / B = (${aVal} × ${dVal}) / ${bVal}`;
    } else {
      if (aVal === 0) { setError('A cannot be zero when solving for D'); return; }
      value = (bVal * cVal!) / aVal;
      missing = 'D';
      formula = `D = (B × C) / A = (${bVal} × ${cVal}) / ${aVal}`;
    }

    // Simplify the ratio
    const finalA = aVal ?? value;
    const finalB = bVal ?? value;
    const g = gcd(Math.round(finalA * 1000), Math.round(finalB * 1000));
    const simplified = g > 0 ? `${Math.round(finalA * 1000 / g)}:${Math.round(finalB * 1000 / g)}` : `${finalA}:${finalB}`;

    setResult({ missing, value, formula, simplified });
  }

  const copyText = result
    ? `${result.missing} = ${result.value.toFixed(4)}\n${result.formula}\nSimplified ratio: ${result.simplified}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label className="block text-sm font-medium text-gray-700 mb-2" id={`${toolId}-label`}>
          Solve proportion for {toolName}: A : B = C : D
        </label>
        <p className="text-xs text-gray-500 mb-3">Leave one field empty to solve for it</p>
        <div className="flex items-center gap-2 flex-wrap" aria-labelledby={`${toolId}-label`}>
          <input type="text" inputMode="decimal" value={a} onChange={(e) => setA(e.target.value)} placeholder="A" aria-label="Value A" className="input-field w-20 text-center text-sm" />
          <span className="text-gray-600 font-bold">:</span>
          <input type="text" inputMode="decimal" value={b} onChange={(e) => setB(e.target.value)} placeholder="B" aria-label="Value B" className="input-field w-20 text-center text-sm" />
          <span className="text-gray-600 font-bold">=</span>
          <input type="text" inputMode="decimal" value={c} onChange={(e) => setC(e.target.value)} placeholder="C" aria-label="Value C" className="input-field w-20 text-center text-sm" />
          <span className="text-gray-600 font-bold">:</span>
          <input type="text" inputMode="decimal" value={d} onChange={(e) => setD(e.target.value)} placeholder="D" aria-label="Value D" className="input-field w-20 text-center text-sm" />
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Solve proportion" className="btn-primary">Solve</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-blue-600">{result.missing} = {result.value.toFixed(4)}</div>
              <div className="text-sm text-gray-500 mt-1">Simplified: {result.simplified}</div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono text-center">
              {result.formula}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
