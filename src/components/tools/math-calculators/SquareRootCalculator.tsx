'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function SquareRootCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [number, setNumber] = useState('');
  const [nthRoot, setNthRoot] = useState('2');
  const [result, setResult] = useState('');

  const calculate = () => {
    const num = parseFloat(number);
    const n = parseFloat(nthRoot);
    if (isNaN(num) || isNaN(n) || n === 0) return;
    const value = Math.pow(num, 1 / n);
    setResult(`${n === 2 ? '√' : n === 3 ? '∛' : `${n}√`}${num} = ${value.toFixed(8).replace(/\.?0+$/, '')}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-num`} className="block text-sm font-medium text-gray-700 mb-1">Number</label>
        <input id={`${toolId}-num`} type="text" inputMode="decimal" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="e.g. 144" aria-label={`Number for ${toolName}`} className="input-field" />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-root`} className="block text-sm font-medium text-gray-700 mb-1">Root (2=square, 3=cube, n=nth)</label>
        <input id={`${toolId}-root`} type="text" inputMode="decimal" value={nthRoot} onChange={(e) => setNthRoot(e.target.value)} placeholder="2" aria-label={`Root degree for ${toolName}`} className="input-field" />
      </InputArea>
      <button onClick={calculate} className="btn-primary" aria-label="Calculate root">Calculate</button>
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <p className="text-lg font-mono text-gray-800">{result}</p>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
