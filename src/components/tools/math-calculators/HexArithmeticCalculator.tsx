'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function HexArithmeticCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [op, setOp] = useState('+');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const numA = parseInt(a, 16); const numB = parseInt(b, 16);
    if (isNaN(numA) || isNaN(numB)) { setOutput('Enter valid hexadecimal numbers.'); return; }
    let result: number;
    switch (op) {
      case '+': result = numA + numB; break;
      case '-': result = numA - numB; break;
      case '*': result = numA * numB; break;
      case '/': if (numB === 0) { setOutput('Cannot divide by zero.'); return; } result = Math.floor(numA / numB); break;
      default: result = 0;
    }
    setOutput(`0x${a.toUpperCase()} ${op} 0x${b.toUpperCase()} = 0x${result.toString(16).toUpperCase()}\nDecimal: ${numA} ${op} ${numB} = ${result}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="flex gap-2 items-end">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Hex A</label><input value={a} onChange={(e) => setA(e.target.value)} placeholder="FF" aria-label={`Hex A for ${toolName}`} className="input-field" /></div>
          <select value={op} onChange={(e) => setOp(e.target.value)} className="input-field w-16" aria-label="Operator"><option>+</option><option>-</option><option>*</option><option>/</option></select>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Hex B</label><input value={b} onChange={(e) => setB(e.target.value)} placeholder="0A" aria-label={`Hex B for ${toolName}`} className="input-field" /></div>
        </div>
      </InputArea>
      <button onClick={calculate} className="btn-primary">Calculate</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
