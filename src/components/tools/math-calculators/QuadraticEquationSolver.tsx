'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * QuadraticEquationSolver - Solves quadratic equations ax² + bx + c = 0 using the quadratic formula.
 * Shows discriminant, roots (real or complex), and vertex.
 */
export default function QuadraticEquationSolver({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [a, setA] = useState('1');
  const [b, setB] = useState('-5');
  const [c, setC] = useState('6');
  const [result, setResult] = useState<{
    discriminant: number;
    roots: string[];
    vertex: { x: number; y: number };
    equation: string;
  } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function solve() {
    setError(undefined);
    setResult(null);

    const aVal = parseFloat(a);
    const bVal = parseFloat(b);
    const cVal = parseFloat(c);

    if (isNaN(aVal) || isNaN(bVal) || isNaN(cVal)) {
      setError('Please enter valid numbers for a, b, and c');
      return;
    }
    if (aVal === 0) {
      setError('Coefficient "a" cannot be zero (that would be a linear equation)');
      return;
    }

    const discriminant = bVal * bVal - 4 * aVal * cVal;
    const roots: string[] = [];

    if (discriminant > 0) {
      const x1 = (-bVal + Math.sqrt(discriminant)) / (2 * aVal);
      const x2 = (-bVal - Math.sqrt(discriminant)) / (2 * aVal);
      roots.push(`x₁ = ${x1.toFixed(6)}`, `x₂ = ${x2.toFixed(6)}`);
    } else if (discriminant === 0) {
      const x = -bVal / (2 * aVal);
      roots.push(`x = ${x.toFixed(6)} (double root)`);
    } else {
      const realPart = -bVal / (2 * aVal);
      const imagPart = Math.sqrt(-discriminant) / (2 * aVal);
      roots.push(
        `x₁ = ${realPart.toFixed(4)} + ${imagPart.toFixed(4)}i`,
        `x₂ = ${realPart.toFixed(4)} - ${imagPart.toFixed(4)}i`
      );
    }

    const vertexX = -bVal / (2 * aVal);
    const vertexY = aVal * vertexX * vertexX + bVal * vertexX + cVal;

    const equation = `${aVal}x² ${bVal >= 0 ? '+' : ''}${bVal}x ${cVal >= 0 ? '+' : ''}${cVal} = 0`;

    setResult({ discriminant, roots, vertex: { x: vertexX, y: vertexY }, equation });
  }

  const copyText = result
    ? `Equation: ${result.equation}\nDiscriminant: ${result.discriminant}\nRoots: ${result.roots.join(', ')}\nVertex: (${result.vertex.x.toFixed(4)}, ${result.vertex.y.toFixed(4)})`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label className="block text-sm font-medium text-gray-700 mb-2" id={`${toolId}-label`}>
          Enter coefficients for {toolName}: ax² + bx + c = 0
        </label>
        <div className="flex items-center gap-2 flex-wrap" aria-labelledby={`${toolId}-label`}>
          <div className="flex items-center gap-1">
            <input
              type="text"
              inputMode="decimal"
              value={a}
              onChange={(e) => setA(e.target.value)}
              aria-label="Coefficient a"
              className="input-field w-20 text-center text-sm"
            />
            <span className="text-sm text-gray-600 font-mono">x² +</span>
          </div>
          <div className="flex items-center gap-1">
            <input
              type="text"
              inputMode="decimal"
              value={b}
              onChange={(e) => setB(e.target.value)}
              aria-label="Coefficient b"
              className="input-field w-20 text-center text-sm"
            />
            <span className="text-sm text-gray-600 font-mono">x +</span>
          </div>
          <div className="flex items-center gap-1">
            <input
              type="text"
              inputMode="decimal"
              value={c}
              onChange={(e) => setC(e.target.value)}
              aria-label="Coefficient c"
              className="input-field w-20 text-center text-sm"
            />
            <span className="text-sm text-gray-600 font-mono">= 0</span>
          </div>
        </div>
      </InputArea>

      <button onClick={solve} aria-label="Solve equation" className="btn-primary">
        Solve
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center font-mono text-sm text-gray-700">
              {result.equation}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className={`text-xl font-bold ${result.discriminant >= 0 ? 'text-green-600' : 'text-orange-600'}`}>
                  {result.discriminant.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Discriminant (Δ)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-sm font-bold text-blue-600 font-mono">
                  ({result.vertex.x.toFixed(2)}, {result.vertex.y.toFixed(2)})
                </div>
                <div className="text-xs text-gray-500 mt-1">Vertex</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-sm font-bold text-purple-600">
                  {result.discriminant > 0 ? '2 Real' : result.discriminant === 0 ? '1 Real (double)' : '2 Complex'}
                </div>
                <div className="text-xs text-gray-500 mt-1">Root Type</div>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-sm font-medium text-blue-800 mb-2">Solutions:</div>
              {result.roots.map((root, i) => (
                <div key={i} className="text-sm font-mono text-blue-700">{root}</div>
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
