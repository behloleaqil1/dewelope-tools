'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function NewtonsMethodSolver({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [funcStr, setFuncStr] = useState('');
  const [guess, setGuess] = useState('');
  const [iterations, setIterations] = useState('20');
  const [output, setOutput] = useState('');

  const evaluate = (expr: string, x: number): number => {
    const sanitized = expr.replace(/\^/g, '**').replace(/x/gi, `(${x})`);
    try { return Function(`"use strict"; return (${sanitized})`)(); }
    catch { return NaN; }
  };

  const derivative = (expr: string, x: number): number => {
    const h = 1e-8;
    return (evaluate(expr, x + h) - evaluate(expr, x - h)) / (2 * h);
  };

  const calculate = () => {
    if (!funcStr.trim()) { setOutput('Enter a function of x (e.g., x^2 - 4).'); return; }
    let x = parseFloat(guess);
    const maxIter = parseInt(iterations) || 20;
    if (isNaN(x)) { setOutput('Enter a valid initial guess.'); return; }

    const steps: string[] = [`Initial guess: x₀ = ${x}`];
    const tol = 1e-10;

    for (let i = 0; i < maxIter; i++) {
      const fx = evaluate(funcStr, x);
      const fpx = derivative(funcStr, x);
      if (isNaN(fx) || isNaN(fpx)) { setOutput('Error evaluating function. Check syntax.'); return; }
      if (Math.abs(fpx) < 1e-15) { steps.push(`Iteration ${i + 1}: derivative ≈ 0, method fails.`); break; }

      const xNew = x - fx / fpx;
      steps.push(`Iteration ${i + 1}: x = ${xNew.toFixed(10)}, f(x) = ${evaluate(funcStr, xNew).toExponential(4)}`);

      if (Math.abs(xNew - x) < tol) {
        steps.push(`\nConverged after ${i + 1} iterations.`);
        break;
      }
      x = xNew;
    }

    setOutput(`Root approximation: x ≈ ${x.toFixed(10)}\nf(x) ≈ ${evaluate(funcStr, x).toExponential(4)}\n\n${steps.join('\n')}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-func`} className="block text-sm font-medium text-gray-700 mb-1">Function f(x)</label>
        <input id={`${toolId}-func`} type="text" value={funcStr} onChange={(e) => setFuncStr(e.target.value)} placeholder="x^3 - x - 2" aria-label={`Function for ${toolName}`} className="input-field font-mono" />
        <p className="text-xs text-gray-500 mt-1">Use x as variable. Operators: +, -, *, /, ^ (power). Functions: Math.sin(x), Math.sqrt(x), etc.</p>
      </InputArea>
      <div className="grid grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-guess`} className="block text-sm font-medium text-gray-700 mb-1">Initial Guess (x₀)</label>
          <input id={`${toolId}-guess`} type="number" value={guess} onChange={(e) => setGuess(e.target.value)} placeholder="1.5" aria-label={`Initial guess for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-iter`} className="block text-sm font-medium text-gray-700 mb-1">Max Iterations</label>
          <input id={`${toolId}-iter`} type="number" value={iterations} onChange={(e) => setIterations(e.target.value)} placeholder="20" aria-label={`Max iterations for ${toolName}`} className="input-field" />
        </InputArea>
      </div>
      <button onClick={calculate} className="btn-primary">Find Root</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
