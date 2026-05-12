'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function PowerOfTwoCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const exp = parseInt(input);
    if (isNaN(exp) || exp < 0 || exp > 1023) { setOutput('Enter a valid exponent (0-1023).'); return; }
    const result = BigInt(2) ** BigInt(exp);
    setOutput(`2^${exp} = ${result.toString()}\n\nBinary: 1${'0'.repeat(exp)}\nDigits: ${result.toString().length}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Exponent</label>
        <input id={`${toolId}-input`} type="number" value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. 10" aria-label={`Input for ${toolName}`} className="input-field" />
      </InputArea>
      <button onClick={calculate} className="btn-primary">Calculate 2^n</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
