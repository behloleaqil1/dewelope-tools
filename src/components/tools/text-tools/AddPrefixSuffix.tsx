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

  const apply = () => {
    if (!input) { setOutput(''); return; }
    const result = input.split('\n').map(line => line.trim() ? `${prefix}${line}${suffix}` : line).join('\n');
    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Text (one item per line)</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Line 1\nLine 2\nLine 3" aria-label={`Input for ${toolName}`} className="input-field h-32 resize-y font-mono" />
      </InputArea>
      <div className="grid grid-cols-2 gap-4">
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prefix</label>
          <input value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder='e.g. "' className="input-field" aria-label="Prefix" />
        </InputArea>
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">Suffix</label>
          <input value={suffix} onChange={(e) => setSuffix(e.target.value)} placeholder='e.g. ",' className="input-field" aria-label="Suffix" />
        </InputArea>
      </div>
      <button onClick={apply} className="btn-primary">Apply</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
