'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MatrixInverseCalculator - Calculate the inverse of a 2x2 matrix.
 * Formula: A^(-1) = (1/det(A)) * [[d, -b], [-c, a]] where A = [[a, b], [c, d]]
 */
export default function MatrixInverseCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [d, setD] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    setResult('');

    const av = parseFloat(a);
    const bv = parseFloat(b);
    const cv = parseFloat(c);
    const dv = parseFloat(d);

    if ([a, b, c, d].some((v) => !v.trim()) || [av, bv, cv, dv].some(isNaN)) {
      setError('Please enter valid numbers for all matrix elements.');
      return;
    }

    const det = av * dv - bv * cv;

    if (det === 0) {
      setError('Matrix is singular (determinant = 0). No inverse exists.');
      return;
    }

    const invA = dv / det;
    const invB = -bv / det;
    const invC = -cv / det;
    const invD = av / det;

    const fmt = (n: number) => {
      const rounded = Math.round(n * 1000000) / 1000000;
      return rounded.toString();
    };

    const output = [
      `Original Matrix A:`,
      `┌ ${a.padStart(8)} ${b.padStart(8)} ┐`,
      `└ ${c.padStart(8)} ${d.padStart(8)} ┘`,
      ``,
      `Determinant: det(A) = (${av})(${dv}) - (${bv})(${cv}) = ${det}`,
      ``,
      `Inverse Matrix A⁻¹:`,
      `┌ ${fmt(invA).padStart(10)} ${fmt(invB).padStart(10)} ┐`,
      `└ ${fmt(invC).padStart(10)} ${fmt(invD).padStart(10)} ┘`,
      ``,
      `Formula: A⁻¹ = (1/det) × [[d, -b], [-c, a]]`,
    ].join('\n');

    setResult(output);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter 2×2 Matrix Elements
        </label>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg font-mono">┌</span>
            <input
              type="text"
              inputMode="decimal"
              value={a}
              onChange={(e) => setA(e.target.value)}
              placeholder="a"
              aria-label={`Matrix element a (row 1, col 1) for ${toolName}`}
              className="input-field w-24 text-center"
            />
            <input
              type="text"
              inputMode="decimal"
              value={b}
              onChange={(e) => setB(e.target.value)}
              placeholder="b"
              aria-label="Matrix element b (row 1, col 2)"
              className="input-field w-24 text-center"
            />
            <span className="text-lg font-mono">┐</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-mono">└</span>
            <input
              type="text"
              inputMode="decimal"
              value={c}
              onChange={(e) => setC(e.target.value)}
              placeholder="c"
              aria-label="Matrix element c (row 2, col 1)"
              className="input-field w-24 text-center"
            />
            <input
              type="text"
              inputMode="decimal"
              value={d}
              onChange={(e) => setD(e.target.value)}
              placeholder="d"
              aria-label="Matrix element d (row 2, col 2)"
              className="input-field w-24 text-center"
            />
            <span className="text-lg font-mono">┘</span>
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate matrix inverse" className="btn-primary">
        Calculate Inverse
      </button>

      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Matrix Inverse</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
