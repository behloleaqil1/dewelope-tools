'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function ModuloCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dividend, setDividend] = useState('');
  const [divisor, setDivisor] = useState('');
  const [result, setResult] = useState('');

  const calculate = () => {
    const a = parseFloat(dividend);
    const b = parseFloat(divisor);
    if (isNaN(a) || isNaN(b) || b === 0) return;
    const remainder = a % b;
    const quotient = Math.floor(a / b);
    setResult(`${a} mod ${b} = ${remainder}\nQuotient: ${quotient}\nVerification: ${quotient} × ${b} + ${remainder} = ${quotient * b + remainder}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-a`} className="block text-sm font-medium text-gray-700 mb-1">Dividend</label>
        <input id={`${toolId}-a`} type="text" inputMode="decimal" value={dividend} onChange={(e) => setDividend(e.target.value)} placeholder="e.g. 17" aria-label={`Dividend for ${toolName}`} className="input-field" />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-b`} className="block text-sm font-medium text-gray-700 mb-1">Divisor</label>
        <input id={`${toolId}-b`} type="text" inputMode="decimal" value={divisor} onChange={(e) => setDivisor(e.target.value)} placeholder="e.g. 5" aria-label={`Divisor for ${toolName}`} className="input-field" />
      </InputArea>
      <button onClick={calculate} className="btn-primary" aria-label="Calculate modulo">Calculate</button>
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
