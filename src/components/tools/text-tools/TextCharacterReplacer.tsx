'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function TextCharacterReplacer({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [find, setFind] = useState('');
  const [replace, setReplace] = useState('');
  const [output, setOutput] = useState('');

  const process = () => {
    if (!input) { setOutput(''); return; }
    if (!find) { setOutput(input); return; }
    const result = input.split(find).join(replace);
    const _count = (input.length - result.length + replace.length * (input.split(find).length - 1)) / find.length;
    setOutput(`Replaced ${Math.max(0, input.split(find).length - 1)} occurrence(s):\n\n${result}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Text</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text..." aria-label={`Input for ${toolName}`} className="input-field h-32 resize-y font-mono" />
        <div className="flex gap-2 mt-2">
          <input value={find} onChange={(e) => setFind(e.target.value)} placeholder="Find" aria-label="Find text" className="input-field" />
          <input value={replace} onChange={(e) => setReplace(e.target.value)} placeholder="Replace with" aria-label="Replace with" className="input-field" />
        </div>
      </InputArea>
      <button onClick={process} className="btn-primary">Replace</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
