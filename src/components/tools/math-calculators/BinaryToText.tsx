'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function BinaryToText({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = () => {
    if (!input.trim()) { setOutput(''); return; }
    try {
      const bytes = input.trim().split(/\s+/);
      const text = bytes.map(b => {
        if (!/^[01]+$/.test(b)) throw new Error(`Invalid binary: ${b}`);
        return String.fromCharCode(parseInt(b, 2));
      }).join('');
      setOutput(`Text: ${text}\n\nCharacters: ${text.length}`);
    } catch (e) { setOutput(`Error: ${e instanceof Error ? e.message : 'Invalid binary input'}`); }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Binary (space-separated bytes)</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="01001000 01100101 01101100 01101100 01101111" aria-label={`Input for ${toolName}`} className="input-field h-32 resize-y font-mono" />
      </InputArea>
      <button onClick={convert} className="btn-primary">Convert to Text</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
