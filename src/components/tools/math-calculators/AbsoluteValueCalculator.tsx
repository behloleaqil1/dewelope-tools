'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function AbsoluteValueCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ value: number; absolute: number } | null>(null);

  const calculate = () => {
    const num = parseFloat(input);
    if (isNaN(num)) return;
    setResult({ value: num, absolute: Math.abs(num) });
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Enter a number</label>
        <input id={`${toolId}-input`} type="text" inputMode="decimal" value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. -42" aria-label={`Number for ${toolName}`} className="input-field" />
      </InputArea>
      <button onClick={calculate} className="btn-primary" aria-label="Calculate absolute value">Calculate</button>
      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">|{result.value}| = {result.absolute}</div>
            </div>
            <div className="w-full h-8 relative bg-gray-100 rounded border border-gray-200">
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-400" />
              <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-600" style={{ left: `${Math.min(Math.max((result.value + 100) / 200 * 100, 5), 95)}%` }} />
            </div>
            <CopyToClipboard text={`|${result.value}| = ${result.absolute}`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
