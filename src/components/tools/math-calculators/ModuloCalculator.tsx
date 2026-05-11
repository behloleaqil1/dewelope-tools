'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function ModuloCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dividend, setDividend] = useState('');
  const [divisor, setDivisor] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const a = parseFloat(dividend);
    const b = parseFloat(divisor);
    if (isNaN(a) || isNaN(b)) { setOutput('Please enter valid numbers.'); return; }
    if (b === 0) { setOutput('Error: Division by zero.'); return; }
    const remainder = a % b;
    const quotient = Math.floor(a / b);
    setOutput(`${a} mod ${b} = ${remainder}\n\nQuotient: ${quotient}\nRemainder: ${remainder}\nVerification: ${quotient} × ${b} + ${remainder} = ${quotient * b + remainder}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dividend</label>
          <input type="text" inputMode="decimal" value={dividend} onChange={(e) => setDividend(e.target.value)} placeholder="e.g. 17" aria-label={`Dividend for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">Divisor</label>
          <input type="text" inputMode="decimal" value={divisor} onChange={(e) => setDivisor(e.target.value)} placeholder="e.g. 5" aria-label={`Divisor for ${toolName}`} className="input-field" />
        </InputArea>
      </div>
      <button onClick={calculate} className="btn-primary">Calculate</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
