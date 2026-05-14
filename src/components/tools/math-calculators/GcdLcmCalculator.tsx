'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function GcdLcmCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [numA, setNumA] = useState('');
  const [numB, setNumB] = useState('');
  const [output, setOutput] = useState('');

  function gcd(a: number, b: number): number {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) { [a, b] = [b, a % b]; }
    return a;
  }

  function lcm(a: number, b: number): number {
    if (a === 0 || b === 0) return 0;
    return Math.abs(a * b) / gcd(a, b);
  }

  const calculate = () => {
    const a = parseInt(numA);
    const b = parseInt(numB);
    if (isNaN(a) || isNaN(b)) { setOutput('Please enter valid integers.'); return; }
    if (a === 0 && b === 0) { setOutput('Both numbers cannot be zero.'); return; }

    const gcdResult = gcd(a, b);
    const lcmResult = lcm(a, b);

    setOutput(`Numbers: ${a} and ${b}\n\nGCD (Greatest Common Divisor): ${gcdResult}\nLCM (Least Common Multiple): ${lcmResult}\n\nRelationship: GCD × LCM = |a × b|\n${gcdResult} × ${lcmResult} = ${Math.abs(a * b)}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-a`} className="block text-sm font-medium text-gray-700 mb-1">First Number</label>
        <input id={`${toolId}-a`} type="number" value={numA} onChange={(e) => setNumA(e.target.value)} placeholder="48" aria-label={`First number for ${toolName}`} className="input-field" />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-b`} className="block text-sm font-medium text-gray-700 mb-1">Second Number</label>
        <input id={`${toolId}-b`} type="number" value={numB} onChange={(e) => setNumB(e.target.value)} placeholder="36" aria-label={`Second number for ${toolName}`} className="input-field" />
      </InputArea>
      <button onClick={calculate} className="btn-primary">Calculate GCD & LCM</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
