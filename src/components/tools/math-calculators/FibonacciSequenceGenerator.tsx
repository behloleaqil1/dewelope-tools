'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function FibonacciSequenceGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [count, setCount] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    const n = parseInt(count);
    if (isNaN(n) || n < 1) { setOutput('Enter a positive integer (1-1000).'); return; }
    if (n > 1000) { setOutput('Maximum 1000 terms allowed.'); return; }

    const fib: bigint[] = [];
    for (let i = 0; i < n; i++) {
      if (i === 0) fib.push(BigInt(0));
      else if (i === 1) fib.push(BigInt(1));
      else fib.push(fib[i - 1] + fib[i - 2]);
    }

    const sequence = fib.map(f => f.toString()).join(', ');
    const goldenRatio = n >= 2 ? Number(fib[n - 1]) / Number(fib[n - 2]) : 'N/A';
    setOutput(`Fibonacci Sequence (${n} terms):\n${sequence}\n\nLast term: F(${n - 1}) = ${fib[n - 1].toString()}${n >= 10 ? `\nApprox. Golden Ratio (F(n)/F(n-1)): ${typeof goldenRatio === 'number' ? goldenRatio.toFixed(10) : goldenRatio}` : ''}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">Number of Terms</label>
        <input id={`${toolId}-count`} type="number" value={count} onChange={(e) => setCount(e.target.value)} placeholder="10" min="1" max="1000" aria-label={`Number of terms for ${toolName}`} className="input-field" />
      </InputArea>
      <button onClick={generate} className="btn-primary">Generate Sequence</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
