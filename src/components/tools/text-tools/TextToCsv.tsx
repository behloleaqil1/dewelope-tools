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
    if (!input.trim()) return;
    const lines = input.split('\n').filter(l => l.trim());
    setOutput(lines.map(l => l.includes(delimiter) ? `"${l}"` : l).join(delimiter + ' '));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Enter text (one item per line)</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Item 1&#10;Item 2&#10;Item 3" aria-label={`Text input for ${toolName}`} className="input-field h-40 resize-y font-mono" />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-delim`} className="block text-sm font-medium text-gray-700 mb-1">Delimiter</label>
        <select id={`${toolId}-delim`} value={delimiter} onChange={(e) => setDelimiter(e.target.value)} aria-label={`Delimiter for ${toolName}`} className="input-field">
          <option value=",">Comma (,)</option>
          <option value=";">Semicolon (;)</option>
          <option value="|">Pipe (|)</option>
          <option value="\t">Tab</option>
        </select>
      </InputArea>
      <button onClick={convert} className="btn-primary" aria-label="Convert to CSV">Convert to CSV</button>
      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
