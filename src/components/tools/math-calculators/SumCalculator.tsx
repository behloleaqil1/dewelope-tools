'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function SumCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const nums = input.split(/[\s,]+/).filter(Boolean).map(Number);
    if (nums.some(isNaN)) { setOutput('Error: All values must be numbers'); return; }
    if (nums.length === 0) { setOutput(''); return; }
    const sum = nums.reduce((a, b) => a + b, 0);
    setOutput(`Sum: ${sum}\nCount: ${nums.length}\nNumbers: ${nums.join(' + ')}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Numbers (comma or space separated)</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="10, 20, 30, 40, 50" aria-label={`Input for ${toolName}`} className="input-field h-28 resize-y" />
      </InputArea>
      <button onClick={calculate} className="btn-primary">Calculate Sum</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
