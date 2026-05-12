'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function AddPrefixSuffix({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [output, setOutput] = useState('');

  const process = () => {
    if (!input.trim()) { setOutput(''); return; }
    const lines = input.split('\n');
    const result = lines.map(line => `${prefix}${line}${suffix}`);
    setOutput(result.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Text (one item per line)</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="line 1&#10;line 2&#10;line 3" aria-label={`Input for ${toolName}`} className="input-field h-32 resize-y font-mono" />
        <div className="flex gap-2 mt-2">
          <input value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="Prefix" aria-label="Prefix" className="input-field" />
          <input value={suffix} onChange={(e) => setSuffix(e.target.value)} placeholder="Suffix" aria-label="Suffix" className="input-field" />
        </div>
      </InputArea>
      <button onClick={process} className="btn-primary">Apply</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
