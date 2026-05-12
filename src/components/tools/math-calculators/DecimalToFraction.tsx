'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }

export default function DecimalToFraction({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = () => {
    const num = parseFloat(input);
    if (isNaN(num)) { setOutput('Enter a valid decimal number.'); return; }
    const decimalPlaces = (input.split('.')[1] || '').length;
    const denominator = Math.pow(10, decimalPlaces);
    const numerator = Math.round(num * denominator);
    const divisor = gcd(Math.abs(numerator), denominator);
    const simpNum = numerator / divisor;
    const simpDen = denominator / divisor;
    setOutput(`${input} = ${simpNum}/${simpDen}${simpDen === 1 ? ` = ${simpNum}` : ''}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Decimal Number</label>
        <input id={`${toolId}-input`} type="text" inputMode="decimal" value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. 0.75" aria-label={`Input for ${toolName}`} className="input-field" />
      </InputArea>
      <button onClick={convert} className="btn-primary">Convert to Fraction</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
