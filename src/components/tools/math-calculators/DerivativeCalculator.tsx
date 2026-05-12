'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DerivativeCalculator - Calculate symbolic derivatives of basic functions.
 */
export default function DerivativeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [expression, setExpression] = useState('');
  const [variable, setVariable] = useState('x');
  const [result, setResult] = useState<{ derivative: string; steps: string[] } | null>(null);
  const [error, setError] = useState('');

  const differentiate = (expr: string, v: string): { derivative: string; steps: string[] } => {
    const steps: string[] = [];
    const trimmed = expr.trim().replace(/\s+/g, '');

    // Constant
    if (!trimmed.includes(v)) {
      steps.push(`d/d${v}(${expr}) = 0 (constant rule)`);
      return { derivative: '0', steps };
    }

    // Just x
    if (trimmed === v) {
      steps.push(`d/d${v}(${v}) = 1 (identity rule)`);
      return { derivative: '1', steps };
    }

    // ax^n pattern
    const powerMatch = trimmed.match(/^(-?\d*\.?\d*)\*?(\w)\^(-?\d+\.?\d*)$/);
    if (powerMatch) {
      const coeff = powerMatch[1] === '' || powerMatch[1] === '-' ? (powerMatch[1] === '-' ? -1 : 1) : parseFloat(powerMatch[1]);
      const n = parseFloat(powerMatch[3]);
      const newCoeff = coeff * n;
      const newPow = n - 1;
      steps.push(`Using power rule: d/d${v}(${coeff}${v}^${n}) = ${coeff}*${n}*${v}^(${n}-1)`);
      if (newPow === 0) {
        steps.push(`= ${newCoeff}`);
        return { derivative: `${newCoeff}`, steps };
      } else if (newPow === 1) {
        steps.push(`= ${newCoeff}${v}`);
        return { derivative: `${newCoeff}${v}`, steps };
      }
      steps.push(`= ${newCoeff}${v}^${newPow}`);
      return { derivative: `${newCoeff}${v}^${newPow}`, steps };
    }

    // ax pattern (linear)
    const linearMatch = trimmed.match(/^(-?\d*\.?\d*)\*?(\w)$/);
    if (linearMatch && linearMatch[2] === v) {
      const coeff = linearMatch[1] === '' || linearMatch[1] === '-' ? (linearMatch[1] === '-' ? -1 : 1) : parseFloat(linearMatch[1]);
      steps.push(`d/d${v}(${coeff}${v}) = ${coeff} (linear rule)`);
      return { derivative: `${coeff}`, steps };
    }

    // sin(x)
    if (trimmed === `sin(${v})`) {
      steps.push(`d/d${v}(sin(${v})) = cos(${v}) (trig rule)`);
      return { derivative: `cos(${v})`, steps };
    }

    // cos(x)
    if (trimmed === `cos(${v})`) {
      steps.push(`d/d${v}(cos(${v})) = -sin(${v}) (trig rule)`);
      return { derivative: `-sin(${v})`, steps };
    }

    // e^x
    if (trimmed === `e^${v}`) {
      steps.push(`d/d${v}(e^${v}) = e^${v} (exponential rule)`);
      return { derivative: `e^${v}`, steps };
    }

    // ln(x)
    if (trimmed === `ln(${v})`) {
      steps.push(`d/d${v}(ln(${v})) = 1/${v} (logarithm rule)`);
      return { derivative: `1/${v}`, steps };
    }

    // tan(x)
    if (trimmed === `tan(${v})`) {
      steps.push(`d/d${v}(tan(${v})) = sec²(${v}) (trig rule)`);
      return { derivative: `sec²(${v})`, steps };
    }

    steps.push('Expression not recognized. Supported: constants, x, ax^n, sin(x), cos(x), tan(x), e^x, ln(x)');
    return { derivative: 'Unable to differentiate', steps };
  };

  const calculate = () => {
    setError('');
    setResult(null);

    if (!expression.trim()) {
      setError('Please enter an expression');
      return;
    }

    try {
      const res = differentiate(expression, variable);
      setResult(res);
    } catch {
      setError('Could not parse the expression');
    }
  };

  const copyText = result ? `f(${variable}) = ${expression}\nf'(${variable}) = ${result.derivative}\n\nSteps:\n${result.steps.join('\n')}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-expr`} className="block text-sm font-medium text-gray-700 mb-1">Expression f({variable})</label>
            <input id={`${toolId}-expr`} type="text" value={expression} onChange={(e) => setExpression(e.target.value)} placeholder="e.g. 3x^2, sin(x), e^x, ln(x)" aria-label={`Expression for ${toolName}`} className="input-field font-mono" />
          </div>
          <div className="w-24">
            <label htmlFor={`${toolId}-var`} className="block text-sm font-medium text-gray-700 mb-1">Variable</label>
            <input id={`${toolId}-var`} type="text" value={variable} onChange={(e) => setVariable(e.target.value || 'x')} maxLength={1} aria-label="Variable" className="input-field text-center" />
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} className="btn-primary" aria-label="Calculate derivative">Calculate Derivative</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-sm text-gray-500 mb-1">f({variable}) = {expression}</div>
              <div className="text-2xl font-bold text-blue-600 font-mono">f&apos;({variable}) = {result.derivative}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-2">Steps:</div>
              {result.steps.map((step, i) => (
                <div key={i} className="text-sm text-gray-600 font-mono">{step}</div>
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
