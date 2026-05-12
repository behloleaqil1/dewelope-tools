'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function CombinationsGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [n, setN] = useState('');
  const [r, setR] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const nVal = parseInt(n); const rVal = parseInt(r);
    if (isNaN(nVal) || isNaN(rVal) || nVal < 0 || rVal < 0) { setOutput('Enter valid positive integers.'); return; }
    if (rVal > nVal) { setOutput('r cannot be greater than n.'); return; }
    const factorial = (x: number): number => { let result = 1; for (let i = 2; i <= x; i++) result *= i; return result; };
    const comb = factorial(nVal) / (factorial(rVal) * factorial(nVal - rVal));
    const perm = factorial(nVal) / factorial(nVal - rVal);
    setOutput(`C(${nVal}, ${rVal}) = ${comb}\nP(${nVal}, ${rVal}) = ${perm}\n\nFormula: C(n,r) = n! / (r! × (n-r)!)`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="flex gap-2">
          <div>
            <label htmlFor={`${toolId}-n`} className="block text-sm font-medium text-gray-700 mb-1">n (total items)</label>
            <input id={`${toolId}-n`} type="number" value={n} onChange={(e) => setN(e.target.value)} placeholder="e.g. 10" aria-label={`n for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-r`} className="block text-sm font-medium text-gray-700 mb-1">r (choose)</label>
            <input id={`${toolId}-r`} type="number" value={r} onChange={(e) => setR(e.target.value)} placeholder="e.g. 3" aria-label={`r for ${toolName}`} className="input-field" />
          </div>
        </div>
      </InputArea>
      <button onClick={calculate} className="btn-primary">Calculate</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
