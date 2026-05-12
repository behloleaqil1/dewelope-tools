'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function FractionToDecimal({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [numerator, setNumerator] = useState('');
  const [denominator, setDenominator] = useState('');
  const [output, setOutput] = useState('');

  const convert = () => {
    const num = parseFloat(numerator); const den = parseFloat(denominator);
    if (isNaN(num) || isNaN(den)) { setOutput('Enter valid numbers.'); return; }
    if (den === 0) { setOutput('Denominator cannot be zero.'); return; }
    const result = num / den;
    const percentage = result * 100;
    setOutput(`${num}/${den} = ${result}\nPercentage: ${percentage.toFixed(4)}%`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="flex gap-2 items-end">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Numerator</label><input value={numerator} onChange={(e) => setNumerator(e.target.value)} placeholder="3" aria-label={`Numerator for ${toolName}`} className="input-field" /></div>
          <span className="text-2xl text-gray-500 pb-2">/</span>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Denominator</label><input value={denominator} onChange={(e) => setDenominator(e.target.value)} placeholder="4" aria-label={`Denominator for ${toolName}`} className="input-field" /></div>
        </div>
      </InputArea>
      <button onClick={convert} className="btn-primary">Convert to Decimal</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
