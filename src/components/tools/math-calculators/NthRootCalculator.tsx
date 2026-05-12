'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function NthRootCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [number, setNumber] = useState('');
  const [root, setRoot] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const num = parseFloat(number); const n = parseFloat(root);
    if (isNaN(num) || isNaN(n) || n === 0) { setOutput('Enter valid numbers (root cannot be 0).'); return; }
    if (num < 0 && n % 2 === 0) { setOutput('Cannot calculate even root of a negative number.'); return; }
    const result = num < 0 ? -Math.pow(-num, 1 / n) : Math.pow(num, 1 / n);
    setOutput(`${n}√${num} = ${result}\n\nVerification: ${result.toFixed(6)}^${n} ≈ ${Math.pow(result, n).toFixed(6)}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="flex gap-2">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Number</label><input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="e.g. 81" aria-label={`Number for ${toolName}`} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Root (n)</label><input value={root} onChange={(e) => setRoot(e.target.value)} placeholder="e.g. 4" aria-label={`Root for ${toolName}`} className="input-field" /></div>
        </div>
      </InputArea>
      <button onClick={calculate} className="btn-primary">Calculate</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
