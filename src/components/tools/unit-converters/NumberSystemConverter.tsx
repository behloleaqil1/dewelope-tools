'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function NumberSystemConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState('10');
  const [toBase, setToBase] = useState('2');
  const [output, setOutput] = useState('');

  const convert = () => {
    if (!input.trim()) { setOutput(''); return; }
    const from = parseInt(fromBase);
    const to = parseInt(toBase);
    try {
      const decimal = parseInt(input, from);
      if (isNaN(decimal)) { setOutput('Invalid number for the selected base.'); return; }
      const result = decimal.toString(to).toUpperCase();
      setOutput(`Input: ${input} (base ${from})\nResult: ${result} (base ${to})\nDecimal: ${decimal}`);
    } catch { setOutput('Error: Invalid input.'); }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Number</label>
        <input id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter number..." aria-label={`Input for ${toolName}`} className="input-field font-mono" />
      </InputArea>
      <div className="grid grid-cols-2 gap-4">
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">From Base (2-36)</label>
          <input type="number" min="2" max="36" value={fromBase} onChange={(e) => setFromBase(e.target.value)} className="input-field" aria-label="From base" />
        </InputArea>
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">To Base (2-36)</label>
          <input type="number" min="2" max="36" value={toBase} onChange={(e) => setToBase(e.target.value)} className="input-field" aria-label="To base" />
        </InputArea>
      </div>
      <button onClick={convert} className="btn-primary">Convert</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
