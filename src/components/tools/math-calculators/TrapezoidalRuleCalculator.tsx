'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function TrapezoidalRuleCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [funcStr, setFuncStr] = useState('');
  const [lower, setLower] = useState('');
  const [upper, setUpper] = useState('');
  const [intervals, setIntervals] = useState('100');
  const [output, setOutput] = useState('');

  const evaluate = (expr: string, x: number): number => {
    const sanitized = expr.replace(/\^/g, '**').replace(/x/gi, `(${x})`);
    try { return Function(`"use strict"; return (${sanitized})`)(); }
    catch { return NaN; }
  };

  const calculate = () => {
    if (!funcStr.trim()) { setOutput('Enter a function of x.'); return; }
    const a = parseFloat(lower);
    const b = parseFloat(upper);
    const n = parseInt(intervals);
    if (isNaN(a) || isNaN(b)) { setOutput('Enter valid bounds.'); return; }
    if (isNaN(n) || n < 1) { setOutput('Enter a positive number of intervals.'); return; }
    if (n > 100000) { setOutput('Maximum 100,000 intervals.'); return; }
    if (a >= b) { setOutput('Upper bound must be greater than lower bound.'); return; }

    const h = (b - a) / n;
    let sum = 0;
    const fa = evaluate(funcStr, a);
    const fb = evaluate(funcStr, b);
    if (isNaN(fa) || isNaN(fb)) { setOutput('Error evaluating function. Check syntax.'); return; }

    sum = fa + fb;
    for (let i = 1; i < n; i++) {
      const xi = a + i * h;
      const fxi = evaluate(funcStr, xi);
      if (isNaN(fxi)) { setOutput(`Error evaluating f(${xi}).`); return; }
      sum += 2 * fxi;
    }

    const area = (h / 2) * sum;
    const errorBound = ((b - a) ** 3) / (12 * n * n);

    setOutput(`Approximate Area: ${area.toFixed(8)}\n\nFunction: f(x) = ${funcStr}\nBounds: [${a}, ${b}]\nIntervals (n): ${n}\nStep size (h): ${h.toFixed(8)}\nError bound: O(${errorBound.toExponential(4)})`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-func`} className="block text-sm font-medium text-gray-700 mb-1">Function f(x)</label>
        <input id={`${toolId}-func`} type="text" value={funcStr} onChange={(e) => setFuncStr(e.target.value)} placeholder="x^2 + 1" aria-label={`Function for ${toolName}`} className="input-field font-mono" />
        <p className="text-xs text-gray-500 mt-1">Use x as variable. Operators: +, -, *, /, ^. Functions: Math.sin(x), Math.exp(x), etc.</p>
      </InputArea>
      <div className="grid grid-cols-3 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-lower`} className="block text-sm font-medium text-gray-700 mb-1">Lower Bound (a)</label>
          <input id={`${toolId}-lower`} type="number" value={lower} onChange={(e) => setLower(e.target.value)} placeholder="0" aria-label={`Lower bound for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-upper`} className="block text-sm font-medium text-gray-700 mb-1">Upper Bound (b)</label>
          <input id={`${toolId}-upper`} type="number" value={upper} onChange={(e) => setUpper(e.target.value)} placeholder="1" aria-label={`Upper bound for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-n`} className="block text-sm font-medium text-gray-700 mb-1">Intervals (n)</label>
          <input id={`${toolId}-n`} type="number" value={intervals} onChange={(e) => setIntervals(e.target.value)} placeholder="100" aria-label={`Number of intervals for ${toolName}`} className="input-field" />
        </InputArea>
      </div>
      <button onClick={calculate} className="btn-primary">Calculate Area</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
