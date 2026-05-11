'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function OctalCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [op, setOp] = useState('+');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const numA = parseInt(a, 8);
    const numB = parseInt(b, 8);
    if (isNaN(numA) || isNaN(numB)) { setOutput('Please enter valid octal numbers (digits 0-7).'); return; }
    let result: number;
    switch (op) {
      case '+': result = numA + numB; break;
      case '-': result = numA - numB; break;
      case '*': result = numA * numB; break;
      case '/': if (numB === 0) { setOutput('Error: Division by zero.'); return; } result = Math.floor(numA / numB); break;
      default: result = 0;
    }
    setOutput(`${a}₈ ${op} ${b}₈ = ${result.toString(8)}₈\n\nDecimal: ${numA} ${op} ${numB} = ${result}\nBinary: ${result.toString(2)}\nHex: ${result.toString(16).toUpperCase()}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-3 gap-2 items-end">
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">Octal A</label>
          <input value={a} onChange={(e) => setA(e.target.value)} placeholder="e.g. 17" aria-label={`First octal for ${toolName}`} className="input-field font-mono" />
        </InputArea>
        <select value={op} onChange={(e) => setOp(e.target.value)} className="input-field" aria-label="Operation">
          <option value="+">+</option><option value="-">-</option><option value="*">×</option><option value="/">÷</option>
        </select>
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">Octal B</label>
          <input value={b} onChange={(e) => setB(e.target.value)} placeholder="e.g. 5" aria-label={`Second octal for ${toolName}`} className="input-field font-mono" />
        </InputArea>
      </div>
      <button onClick={calculate} className="btn-primary">Calculate</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
