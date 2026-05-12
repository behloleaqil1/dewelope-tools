'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function BinaryAdditionCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    if (!/^[01]+$/.test(a) || !/^[01]+$/.test(b)) { setOutput('Enter valid binary numbers (0s and 1s only).'); return; }
    const numA = parseInt(a, 2); const numB = parseInt(b, 2);
    const sum = numA + numB;
    setOutput(`${a}\n+ ${b}\n${'─'.repeat(Math.max(a.length, b.length) + 2)}\n= ${sum.toString(2)}\n\nDecimal: ${numA} + ${numB} = ${sum}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-1">Binary Numbers</label>
        <div className="flex gap-2">
          <input value={a} onChange={(e) => setA(e.target.value)} placeholder="1010" aria-label={`Binary A for ${toolName}`} className="input-field font-mono" />
          <input value={b} onChange={(e) => setB(e.target.value)} placeholder="1101" aria-label={`Binary B for ${toolName}`} className="input-field font-mono" />
        </div>
      </InputArea>
      <button onClick={calculate} className="btn-primary">Add</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
