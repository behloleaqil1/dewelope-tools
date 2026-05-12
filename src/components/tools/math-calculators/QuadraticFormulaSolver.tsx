'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * QuadraticFormulaSolver - Solve ax²+bx+c=0 showing discriminant and steps.
 */
export default function QuadraticFormulaSolver({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [result, setResult] = useState<{ discriminant: number; roots: string[]; nature: string; steps: string[] } | null>(null);
  const [error, setError] = useState('');

  const solve = () => {
    setError('');
    setResult(null);

    const aVal = parseFloat(a);
    const bVal = parseFloat(b);
    const cVal = parseFloat(c);

    if (isNaN(aVal) || isNaN(bVal) || isNaN(cVal)) {
      setError('Please enter valid numbers for a, b, and c.');
      return;
    }

    if (aVal === 0) {
      setError('Coefficient "a" cannot be zero (that would be a linear equation).');
      return;
    }

    const discriminant = bVal * bVal - 4 * aVal * cVal;
    const steps: string[] = [
      `Equation: ${aVal}x² + ${bVal}x + ${cVal} = 0`,
      `Discriminant (Δ) = b² - 4ac = (${bVal})² - 4(${aVal})(${cVal}) = ${discriminant.toFixed(6)}`,
    ];

    let roots: string[] = [];
    let nature: string;

    if (discriminant > 0) {
      const sqrtD = Math.sqrt(discriminant);
      const x1 = (-bVal + sqrtD) / (2 * aVal);
      const x2 = (-bVal - sqrtD) / (2 * aVal);
      nature = 'Two distinct real roots';
      roots = [x1.toFixed(6), x2.toFixed(6)];
      steps.push(`√Δ = √${discriminant.toFixed(6)} = ${sqrtD.toFixed(6)}`);
      steps.push(`x₁ = (-b + √Δ) / 2a = (${-bVal} + ${sqrtD.toFixed(6)}) / ${2 * aVal} = ${x1.toFixed(6)}`);
      steps.push(`x₂ = (-b - √Δ) / 2a = (${-bVal} - ${sqrtD.toFixed(6)}) / ${2 * aVal} = ${x2.toFixed(6)}`);
    } else if (discriminant === 0) {
      const x = -bVal / (2 * aVal);
      nature = 'One repeated real root';
      roots = [x.toFixed(6)];
      steps.push(`Δ = 0, so there is one repeated root`);
      steps.push(`x = -b / 2a = ${-bVal} / ${2 * aVal} = ${x.toFixed(6)}`);
    } else {
      const realPart = -bVal / (2 * aVal);
      const imagPart = Math.sqrt(-discriminant) / (2 * aVal);
      nature = 'Two complex conjugate roots';
      roots = [`${realPart.toFixed(6)} + ${imagPart.toFixed(6)}i`, `${realPart.toFixed(6)} - ${imagPart.toFixed(6)}i`];
      steps.push(`Δ < 0, so roots are complex`);
      steps.push(`Real part = -b / 2a = ${realPart.toFixed(6)}`);
      steps.push(`Imaginary part = √|Δ| / 2a = ${imagPart.toFixed(6)}`);
    }

    setResult({ discriminant, roots, nature, steps });
  };

  const copyText = result
    ? `${result.steps.join('\n')}\n\nNature: ${result.nature}\nRoots: ${result.roots.join(', ')}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label className="block text-sm font-medium text-gray-700 mb-2">Enter coefficients for ax² + bx + c = 0</label>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label htmlFor={`${toolId}-a`} className="block text-xs text-gray-500 mb-1">a (x² coefficient)</label>
            <input id={`${toolId}-a`} type="text" inputMode="decimal" value={a} onChange={(e) => setA(e.target.value)} placeholder="1" aria-label={`Coefficient a for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-b`} className="block text-xs text-gray-500 mb-1">b (x coefficient)</label>
            <input id={`${toolId}-b`} type="text" inputMode="decimal" value={b} onChange={(e) => setB(e.target.value)} placeholder="-5" aria-label={`Coefficient b for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-c`} className="block text-xs text-gray-500 mb-1">c (constant)</label>
            <input id={`${toolId}-c`} type="text" inputMode="decimal" value={c} onChange={(e) => setC(e.target.value)} placeholder="6" aria-label={`Coefficient c for ${toolName}`} className="input-field" />
          </div>
        </div>
      </InputArea>

      <button onClick={solve} className="btn-primary" aria-label="Solve quadratic equation">Solve Equation</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.discriminant.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Discriminant (Δ)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-sm font-bold text-blue-600">{result.nature}</div>
                <div className="text-xs text-gray-500 mt-1">Nature of Roots</div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-2">Roots:</div>
              {result.roots.map((root, i) => (
                <div key={i} className="text-lg font-mono text-gray-800">x{result.roots.length > 1 ? `₁₂`[i] : ''} = {root}</div>
              ))}
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-1">Solution Steps:</div>
              {result.steps.map((step, i) => (
                <div key={i} className="text-xs font-mono text-gray-600">{step}</div>
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
