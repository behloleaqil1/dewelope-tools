'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * LinearEquationSolver - Solve systems of 2 linear equations with 2 unknowns.
 * Uses Cramer's rule: a1*x + b1*y = c1, a2*x + b2*y = c2
 */
export default function LinearEquationSolver({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [a1, setA1] = useState('');
  const [b1, setB1] = useState('');
  const [c1, setC1] = useState('');
  const [a2, setA2] = useState('');
  const [b2, setB2] = useState('');
  const [c2, setC2] = useState('');
  const [result, setResult] = useState<{ x: number; y: number } | null>(null);
  const [error, setError] = useState('');

  const solve = () => {
    setError('');
    setResult(null);

    const na1 = parseFloat(a1);
    const nb1 = parseFloat(b1);
    const nc1 = parseFloat(c1);
    const na2 = parseFloat(a2);
    const nb2 = parseFloat(b2);
    const nc2 = parseFloat(c2);

    if ([na1, nb1, nc1, na2, nb2, nc2].some(isNaN)) {
      setError('Please enter valid numbers for all coefficients.');
      return;
    }

    const det = na1 * nb2 - na2 * nb1;

    if (det === 0) {
      setError('The system has no unique solution (determinant is zero). The equations are either parallel or identical.');
      return;
    }

    const x = (nc1 * nb2 - nc2 * nb1) / det;
    const y = (na1 * nc2 - na2 * nc1) / det;

    setResult({ x, y });
  };

  const copyText = result
    ? `System:\n${a1}x + ${b1}y = ${c1}\n${a2}x + ${b2}y = ${c2}\n\nSolution:\nx = ${result.x}\ny = ${result.y}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Equation 1: a₁x + b₁y = c₁</label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label htmlFor={`${toolId}-a1`} className="block text-xs text-gray-500 mb-1">a₁</label>
              <input id={`${toolId}-a1`} type="text" inputMode="decimal" value={a1} onChange={(e) => setA1(e.target.value)} placeholder="a₁" aria-label={`Coefficient a1 for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-b1`} className="block text-xs text-gray-500 mb-1">b₁</label>
              <input id={`${toolId}-b1`} type="text" inputMode="decimal" value={b1} onChange={(e) => setB1(e.target.value)} placeholder="b₁" aria-label="Coefficient b1" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-c1`} className="block text-xs text-gray-500 mb-1">c₁</label>
              <input id={`${toolId}-c1`} type="text" inputMode="decimal" value={c1} onChange={(e) => setC1(e.target.value)} placeholder="c₁" aria-label="Coefficient c1" className="input-field" />
            </div>
          </div>
          <label className="block text-sm font-medium text-gray-700">Equation 2: a₂x + b₂y = c₂</label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label htmlFor={`${toolId}-a2`} className="block text-xs text-gray-500 mb-1">a₂</label>
              <input id={`${toolId}-a2`} type="text" inputMode="decimal" value={a2} onChange={(e) => setA2(e.target.value)} placeholder="a₂" aria-label="Coefficient a2" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-b2`} className="block text-xs text-gray-500 mb-1">b₂</label>
              <input id={`${toolId}-b2`} type="text" inputMode="decimal" value={b2} onChange={(e) => setB2(e.target.value)} placeholder="b₂" aria-label="Coefficient b2" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-c2`} className="block text-xs text-gray-500 mb-1">c₂</label>
              <input id={`${toolId}-c2`} type="text" inputMode="decimal" value={c2} onChange={(e) => setC2(e.target.value)} placeholder="c₂" aria-label="Coefficient c2" className="input-field" />
            </div>
          </div>
        </div>
      </InputArea>

      <button onClick={solve} className="btn-primary" aria-label="Solve linear equations">Solve System</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Solution</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.x % 1 === 0 ? result.x : result.x.toFixed(6)}</div>
                <div className="text-xs text-gray-500 mt-1">x</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.y % 1 === 0 ? result.y : result.y.toFixed(6)}</div>
                <div className="text-xs text-gray-500 mt-1">y</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              {a1}x + {b1}y = {c1}<br />
              {a2}x + {b2}y = {c2}<br />
              Solution: x = {result.x % 1 === 0 ? result.x : result.x.toFixed(6)}, y = {result.y % 1 === 0 ? result.y : result.y.toFixed(6)}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
