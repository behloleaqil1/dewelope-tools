'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function CubeRootCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const num = parseFloat(input);
    if (isNaN(num)) { setOutput('Please enter a valid number.'); return; }
    const result = Math.cbrt(num);
    const isPerfect = Number.isInteger(result);
    setOutput(`∛${num} = ${result}\n\nPerfect cube: ${isPerfect ? 'Yes' : 'No'}\nDecimal: ${result.toFixed(10)}\nVerification: ${result.toFixed(6)}³ = ${(result * result * result).toFixed(6)}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Number</label>
        <input id={`${toolId}-input`} type="text" inputMode="decimal" value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. 27" aria-label={`Input for ${toolName}`} className="input-field" />
      </InputArea>
      <button onClick={calculate} className="btn-primary">Calculate</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
