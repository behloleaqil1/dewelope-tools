'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function NumberEachLine({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [separator, setSeparator] = useState('. ');
  const [startNum, setStartNum] = useState('1');
  const [output, setOutput] = useState('');

  const numberLines = () => {
    if (!input) { setOutput(''); return; }
    const start = parseInt(startNum) || 1;
    const result = input.split('\n').map((line, i) => `${start + i}${separator}${line}`).join('\n');
    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Text</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Line one\nLine two\nLine three" aria-label={`Input for ${toolName}`} className="input-field h-32 resize-y font-mono" />
      </InputArea>
      <div className="grid grid-cols-2 gap-4">
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">Separator</label>
          <input value={separator} onChange={(e) => setSeparator(e.target.value)} className="input-field" aria-label="Separator" />
        </InputArea>
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Number</label>
          <input type="number" value={startNum} onChange={(e) => setStartNum(e.target.value)} className="input-field" aria-label="Start number" />
        </InputArea>
      </div>
      <button onClick={numberLines} className="btn-primary">Number Lines</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
