'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function SummationSeriesCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [formula, setFormula] = useState('arithmetic');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [param, setParam] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const s = parseInt(start);
    const e = parseInt(end);
    if (isNaN(s) || isNaN(e)) { setOutput('Enter valid start and end values.'); return; }
    if (e < s) { setOutput('End must be >= start.'); return; }
    if (e - s > 10000) { setOutput('Range too large (max 10000 terms).'); return; }

    let sum = 0;
    const terms: number[] = [];
    const p = parseFloat(param) || 1;

    for (let i = s; i <= e; i++) {
      let term = 0;
      switch (formula) {
        case 'arithmetic': term = i * p; break;
        case 'squares': term = i * i; break;
        case 'cubes': term = i * i * i; break;
        case 'geometric': term = Math.pow(p, i); break;
        case 'reciprocal': term = 1 / i; break;
        case 'alternating': term = Math.pow(-1, i) * i; break;
      }
      sum += term;
      if (terms.length < 10) terms.push(term);
    }

    const n = e - s + 1;
    const termsStr = terms.map(t => t.toFixed(4)).join(', ') + (n > 10 ? ', ...' : '');
    setOutput(`Sum: ${sum.toFixed(6)}\nTerms (${n} total): ${termsStr}\nRange: i = ${s} to ${e}\nFormula: ${formula}${formula === 'arithmetic' || formula === 'geometric' ? ` (param = ${p})` : ''}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-formula`} className="block text-sm font-medium text-gray-700 mb-1">Series Type</label>
        <select id={`${toolId}-formula`} value={formula} onChange={(e) => setFormula(e.target.value)} aria-label={`Series type for ${toolName}`} className="input-field">
          <option value="arithmetic">Arithmetic (i × p)</option>
          <option value="squares">Squares (i²)</option>
          <option value="cubes">Cubes (i³)</option>
          <option value="geometric">Geometric (p^i)</option>
          <option value="reciprocal">Harmonic (1/i)</option>
          <option value="alternating">Alternating ((-1)^i × i)</option>
        </select>
      </InputArea>
      <div className="grid grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-start`} className="block text-sm font-medium text-gray-700 mb-1">Start (i)</label>
          <input id={`${toolId}-start`} type="number" value={start} onChange={(e) => setStart(e.target.value)} placeholder="1" aria-label={`Start value for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-end`} className="block text-sm font-medium text-gray-700 mb-1">End (i)</label>
          <input id={`${toolId}-end`} type="number" value={end} onChange={(e) => setEnd(e.target.value)} placeholder="100" aria-label={`End value for ${toolName}`} className="input-field" />
        </InputArea>
      </div>
      <InputArea>
        <label htmlFor={`${toolId}-param`} className="block text-sm font-medium text-gray-700 mb-1">Parameter (for arithmetic/geometric)</label>
        <input id={`${toolId}-param`} type="number" value={param} onChange={(e) => setParam(e.target.value)} placeholder="1" aria-label={`Parameter for ${toolName}`} className="input-field" />
      </InputArea>
      <button onClick={calculate} className="btn-primary">Calculate Sum</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
