'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function TextToCsv({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [delimiter, setDelimiter] = useState(',');
  const [output, setOutput] = useState('');

  const convert = () => {
    if (!input.trim()) { setOutput(''); return; }
    const lines = input.split('\n').filter(l => l.trim());
    const result = lines.map(line => {
      const value = line.includes(delimiter) || line.includes('"') ? `"${line.replace(/"/g, '""')}"` : line;
      return value;
    }).join(delimiter + '\n');
    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Text (one item per line)</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Item 1\nItem 2\nItem 3" aria-label={`Input for ${toolName}`} className="input-field h-32 resize-y font-mono" />
      </InputArea>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-1">Delimiter</label>
        <input value={delimiter} onChange={(e) => setDelimiter(e.target.value)} className="input-field w-20" aria-label="Delimiter" />
      </InputArea>
      <button onClick={convert} className="btn-primary">Convert to CSV</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
