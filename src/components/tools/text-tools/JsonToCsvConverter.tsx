'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function JsonToCsvConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [delimiter, setDelimiter] = useState(',');

  const convert = () => {
    if (!input.trim()) { setOutput(''); return; }
    try {
      const data = JSON.parse(input);
      if (!Array.isArray(data) || data.length === 0) { setOutput('Input must be a non-empty JSON array of objects.'); return; }

      const headers = [...new Set(data.flatMap(obj => Object.keys(obj)))];
      const csvRows = [headers.join(delimiter)];

      for (const obj of data) {
        const row = headers.map(h => {
          const val = obj[h] !== undefined ? String(obj[h]) : '';
          return val.includes(delimiter) || val.includes('"') || val.includes('\n')
            ? `"${val.replace(/"/g, '""')}"` : val;
        });
        csvRows.push(row.join(delimiter));
      }

      setOutput(csvRows.join('\n'));
    } catch {
      setOutput('Invalid JSON. Please enter a valid JSON array.');
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-delim`} className="block text-sm font-medium text-gray-700 mb-1">Delimiter</label>
        <select id={`${toolId}-delim`} value={delimiter} onChange={(e) => setDelimiter(e.target.value)} aria-label={`Delimiter for ${toolName}`} className="input-field">
          <option value=",">Comma (,)</option>
          <option value=";">Semicolon (;)</option>
          <option value="\t">Tab</option>
          <option value="|">Pipe (|)</option>
        </select>
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">JSON Array Input</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder='[{"name":"Alice","age":30},{"name":"Bob","age":25}]' aria-label={`JSON input for ${toolName}`} className="input-field h-40 resize-y font-mono" />
      </InputArea>
      <button onClick={convert} className="btn-primary">Convert to CSV</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
