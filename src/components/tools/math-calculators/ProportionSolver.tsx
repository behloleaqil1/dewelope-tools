'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ProportionSolver - Solves proportions of the form a/b = c/x (or any missing value).
 * Given three values, calculates the fourth using cross-multiplication.
 */
export default function ProportionSolver({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [d, setD] = useState('');
  const [result, setResult] = useState<{ missing: string; value: number; formula: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function handleSolve() {
    setError(undefined);
    setResult(null);

    const values = [a.trim(), b.trim(), c.trim(), d.trim()];
    const filled = values.filter((v) => v !== '');

    if (filled.length !== 3) {
      setError('Please fill in exactly 3 values and leave one empty to solve');
      return;
    }

    const numA = parseFloat(a);
    const numB = parseFloat(b);
    const numC = parseFloat(c);
    const numD = parseFloat(d);

    // a/b = c/d → cross multiply: a*d = b*c
    if (a.trim() === '') {
      if (numD === 0) { setError('Cannot divide by zero'); return; }
      const val = (numB * numC) / numD;
      setResult({ missing: 'a', value: val, formula: `a = (b × c) / d = (${numB} × ${numC}) / ${numD} = ${val}` });
    } else if (b.trim() === '') {
      if (numC === 0) { setError('Cannot divide by zero'); return; }
      const val = (numA * numD) / numC;
      setResult({ missing: 'b', value: val, formula: `b = (a × d) / c = (${numA} × ${numD}) / ${numC} = ${val}` });
    } else if (c.trim() === '') {
      if (numB === 0) { setError('Cannot divide by zero'); return; }
      const val = (numA * numD) / numB;
      setResult({ missing: 'c', value: val, formula: `c = (a × d) / b = (${numA} × ${numD}) / ${numB} = ${val}` });
    } else {
      if (numA === 0) { setError('Cannot divide by zero'); return; }
      const val = (numB * numC) / numA;
      setResult({ missing: 'd', value: val, formula: `d = (b × c) / a = (${numB} × ${numC}) / ${numA} = ${val}` });
    }
  }

  const copyText = result ? `${result.missing} = ${result.value}\n${result.formula}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-3">
        <InputArea error={error}>
          <p className="text-sm text-gray-600 mb-3">
            Solve a/b = c/d — fill in 3 values and leave one empty
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex-1 min-w-[80px]">
              <label htmlFor={`${toolId}-a`} className="block text-xs font-medium text-gray-500 mb-1">a</label>
              <input id={`${toolId}-a`} type="text" inputMode="decimal" value={a} onChange={(e) => setA(e.target.value)} placeholder="a" aria-label={`Value a for ${toolName}`} className="input-field" />
            </div>
            <span className="text-lg text-gray-500 mt-4">/</span>
            <div className="flex-1 min-w-[80px]">
              <label htmlFor={`${toolId}-b`} className="block text-xs font-medium text-gray-500 mb-1">b</label>
              <input id={`${toolId}-b`} type="text" inputMode="decimal" value={b} onChange={(e) => setB(e.target.value)} placeholder="b" aria-label={`Value b for ${toolName}`} className="input-field" />
            </div>
            <span className="text-lg text-gray-500 mt-4">=</span>
            <div className="flex-1 min-w-[80px]">
              <label htmlFor={`${toolId}-c`} className="block text-xs font-medium text-gray-500 mb-1">c</label>
              <input id={`${toolId}-c`} type="text" inputMode="decimal" value={c} onChange={(e) => setC(e.target.value)} placeholder="c" aria-label={`Value c for ${toolName}`} className="input-field" />
            </div>
            <span className="text-lg text-gray-500 mt-4">/</span>
            <div className="flex-1 min-w-[80px]">
              <label htmlFor={`${toolId}-d`} className="block text-xs font-medium text-gray-500 mb-1">d</label>
              <input id={`${toolId}-d`} type="text" inputMode="decimal" value={d} onChange={(e) => setD(e.target.value)} placeholder="d" aria-label={`Value d for ${toolName}`} className="input-field" />
            </div>
          </div>
        </InputArea>
      </div>

      <button onClick={handleSolve} aria-label="Solve proportion" className="btn-primary">
        Solve Proportion
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">{result.missing} = {result.value}</div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              {result.formula}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
