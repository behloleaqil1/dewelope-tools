'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function TextToBinaryConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [separator, setSeparator] = useState(' ');

  const convert = () => {
    if (!input) { setOutput(''); return; }
    const binary = Array.from(input)
      .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
      .join(separator);
    setOutput(binary);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-sep`} className="block text-sm font-medium text-gray-700 mb-1">Separator</label>
        <select id={`${toolId}-sep`} value={separator} onChange={(e) => setSeparator(e.target.value)} aria-label={`Separator for ${toolName}`} className="input-field">
          <option value=" ">Space</option>
          <option value="">None</option>
          <option value="\n">New Line</option>
        </select>
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Text Input</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Hello World" aria-label={`Text input for ${toolName}`} className="input-field h-28 resize-y font-mono" />
      </InputArea>
      <button onClick={convert} className="btn-primary">Convert to Binary</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
