'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * LimitCalculator - Calculate limits of basic functions.
 */
export default function LimitCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [expression, setExpression] = useState('');
  const [variable, setVariable] = useState('x');
  const [approach, setApproach] = useState('0');
  const [result, setResult] = useState<{ limit: string; explanation: string } | null>(null);
  const [error, setError] = useState('');

  const evaluateAt = (expr: string, v: string, val: number): number => {
    const sanitized = expr
      .replace(new RegExp(v, 'g'), `(${val})`)
      .replace(/\^/g, '**')
      .replace(/sin/g, 'Math.sin')
      .replace(/cos/g, 'Math.cos')
      .replace(/tan/g, 'Math.tan')
      .replace(/ln/g, 'Math.log')
      .replace(/sqrt/g, 'Math.sqrt')
      .replace(/abs/g, 'Math.abs')
      .replace(/pi/g, 'Math.PI')
      .replace(/e(?![a-z])/g, 'Math.E');

    // eslint-disable-next-line no-new-func
    return new Function(`return ${sanitized}`)() as number;
  };

  const calculate = () => {
    setError('');
    setResult(null);

    if (!expression.trim()) {
      setError('Please enter an expression');
      return;
    }

    try {
      const a = approach.trim().toLowerCase();
      let limitValue: number;
      let explanation = '';

      if (a === 'infinity' || a === 'inf' || a === '∞') {
        // Approach infinity: evaluate at large values
        const v1 = evaluateAt(expression, variable, 1e6);
        const v2 = evaluateAt(expression, variable, 1e8);
        if (Math.abs(v2 - v1) < 1e-4) {
          limitValue = v2;
          explanation = `As ${variable} → ∞, f(${variable}) approaches ${isFinite(limitValue) ? limitValue.toFixed(6) : limitValue > 0 ? '+∞' : '-∞'}`;
        } else if (!isFinite(v2)) {
          limitValue = v2;
          explanation = `As ${variable} → ∞, f(${variable}) diverges to ${v2 > 0 ? '+∞' : '-∞'}`;
        } else {
          limitValue = v2;
          explanation = `As ${variable} → ∞, f(${variable}) ≈ ${v2.toFixed(6)} (may not converge)`;
        }
      } else {
        const target = parseFloat(a);
        if (isNaN(target)) {
          setError('Please enter a valid number or "infinity"');
          return;
        }

        // Approach from both sides
        const epsilon = 1e-8;
        const left = evaluateAt(expression, variable, target - epsilon);
        const right = evaluateAt(expression, variable, target + epsilon);

        if (!isFinite(left) && !isFinite(right)) {
          explanation = `As ${variable} → ${target}, f(${variable}) diverges (limit does not exist in finite form)`;
          limitValue = left;
        } else if (Math.abs(left - right) < 1e-4) {
          limitValue = (left + right) / 2;
          explanation = `As ${variable} → ${target}, f(${variable}) → ${limitValue.toFixed(6)} (left and right limits agree)`;
        } else {
          explanation = `Left limit: ${left.toFixed(6)}, Right limit: ${right.toFixed(6)} — limit may not exist`;
          limitValue = NaN;
        }
      }

      const displayValue = isNaN(limitValue) ? 'DNE (Does Not Exist)' : !isFinite(limitValue) ? (limitValue > 0 ? '+∞' : '-∞') : parseFloat(limitValue.toFixed(8)).toString();

      setResult({ limit: displayValue, explanation });
    } catch {
      setError('Could not evaluate the expression. Supported: basic arithmetic, ^, sin, cos, tan, ln, sqrt');
    }
  };

  const copyText = result ? `lim(${variable}→${approach}) ${expression} = ${result.limit}\n${result.explanation}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-expr`} className="block text-sm font-medium text-gray-700 mb-1">Expression f({variable})</label>
            <input id={`${toolId}-expr`} type="text" value={expression} onChange={(e) => setExpression(e.target.value)} placeholder="e.g. sin(x)/x, (x^2-1)/(x-1), 1/x" aria-label={`Expression for ${toolName}`} className="input-field font-mono" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-var`} className="block text-sm font-medium text-gray-700 mb-1">Variable</label>
              <input id={`${toolId}-var`} type="text" value={variable} onChange={(e) => setVariable(e.target.value || 'x')} maxLength={1} aria-label="Variable" className="input-field text-center" />
            </div>
            <div>
              <label htmlFor={`${toolId}-approach`} className="block text-sm font-medium text-gray-700 mb-1">Approaches</label>
              <input id={`${toolId}-approach`} type="text" value={approach} onChange={(e) => setApproach(e.target.value)} placeholder="0, 1, infinity" aria-label="Limit approach value" className="input-field text-center" />
            </div>
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} className="btn-primary" aria-label="Calculate limit">Calculate Limit</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-sm text-gray-500 mb-1">lim({variable}→{approach}) {expression}</div>
              <div className="text-2xl font-bold text-blue-600 font-mono">= {result.limit}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600">{result.explanation}</div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
