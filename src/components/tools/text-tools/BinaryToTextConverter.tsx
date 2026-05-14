'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function BinaryToTextConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = () => {
    if (!input.trim()) { setOutput(''); return; }
    const cleaned = input.replace(/[^01]/g, ' ').trim();
    const bytes = cleaned.split(/\s+/).filter(b => b.length > 0);

    if (bytes.some(b => b.length !== 8)) {
      // Try splitting continuous binary into 8-bit chunks
      const continuous = input.replace(/[^01]/g, '');
      if (continuous.length % 8 !== 0) { setOutput('Invalid binary. Each character needs 8 bits.'); return; }
      const chunks = continuous.match(/.{8}/g) || [];
      const text = chunks.map(b => String.fromCharCode(parseInt(b, 2))).join('');
      setOutput(text);
      return;
    }

    const text = bytes.map(b => String.fromCharCode(parseInt(b, 2))).join('');
    setOutput(text);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Binary Input</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="01001000 01100101 01101100 01101100 01101111" aria-label={`Binary input for ${toolName}`} className="input-field h-28 resize-y font-mono" />
      </InputArea>
      <button onClick={convert} className="btn-primary">Convert to Text</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
