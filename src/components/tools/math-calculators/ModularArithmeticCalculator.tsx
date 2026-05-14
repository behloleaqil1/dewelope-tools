'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function ModularArithmeticCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [mod, setMod] = useState('');
  const [operation, setOperation] = useState('add');
  const [output, setOutput] = useState('');

  const modPow = (base: number, exp: number, m: number): number => {
    let result = 1;
    base = ((base % m) + m) % m;
    while (exp > 0) {
      if (exp % 2 === 1) result = (result * base) % m;
      exp = Math.floor(exp / 2);
      base = (base * base) % m;
    }
    return result;
  };

  const calculate = () => {
    const numA = parseInt(a);
    const numB = parseInt(b);
    const m = parseInt(mod);
    if (isNaN(numA) || isNaN(numB) || isNaN(m)) { setOutput('Enter valid integers.'); return; }
    if (m <= 0) { setOutput('Modulus must be positive.'); return; }

    let result: number;
    let formula: string;
    switch (operation) {
      case 'add':
        result = ((numA % m) + (numB % m) + m + m) % m;
        formula = `(${numA} + ${numB}) mod ${m}`;
        break;
      case 'subtract':
        result = ((numA % m) - (numB % m) + m + m) % m;
        formula = `(${numA} - ${numB}) mod ${m}`;
        break;
      case 'multiply':
        result = ((numA % m) * (numB % m) % m + m) % m;
        formula = `(${numA} × ${numB}) mod ${m}`;
        break;
      case 'power':
        if (numB < 0) { setOutput('Exponent must be non-negative.'); return; }
        result = modPow(numA, numB, m);
        formula = `${numA}^${numB} mod ${m}`;
        break;
      default:
        result = ((numA % m) + m) % m;
        formula = `${numA} mod ${m}`;
    }

    setOutput(`${formula} = ${result}\n\na mod m = ${((numA % m) + m) % m}\nb mod m = ${((numB % m) + m) % m}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-op`} className="block text-sm font-medium text-gray-700 mb-1">Operation</label>
        <select id={`${toolId}-op`} value={operation} onChange={(e) => setOperation(e.target.value)} aria-label={`Operation for ${toolName}`} className="input-field">
          <option value="add">Addition (a + b) mod m</option>
          <option value="subtract">Subtraction (a - b) mod m</option>
          <option value="multiply">Multiplication (a × b) mod m</option>
          <option value="power">Exponentiation a^b mod m</option>
        </select>
      </InputArea>
      <div className="grid grid-cols-3 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-a`} className="block text-sm font-medium text-gray-700 mb-1">a</label>
          <input id={`${toolId}-a`} type="number" value={a} onChange={(e) => setA(e.target.value)} placeholder="17" aria-label={`Value a for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-b`} className="block text-sm font-medium text-gray-700 mb-1">b</label>
          <input id={`${toolId}-b`} type="number" value={b} onChange={(e) => setB(e.target.value)} placeholder="5" aria-label={`Value b for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-mod`} className="block text-sm font-medium text-gray-700 mb-1">mod (m)</label>
          <input id={`${toolId}-mod`} type="number" value={mod} onChange={(e) => setMod(e.target.value)} placeholder="7" aria-label={`Modulus for ${toolName}`} className="input-field" />
        </InputArea>
      </div>
      <button onClick={calculate} className="btn-primary">Calculate</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
