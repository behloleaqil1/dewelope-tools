'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function DateToUnix({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = () => {
    if (!input.trim()) { setOutput(''); return; }
    const d = new Date(input);
    if (isNaN(d.getTime())) { setOutput('Error: Could not parse date. Try formats like:\n2024-01-15\nJan 15, 2024\n2024-01-15T10:30:00Z'); return; }
    const unix = Math.floor(d.getTime() / 1000);
    const unixMs = d.getTime();
    setOutput(`Input: ${input}\nParsed: ${d.toISOString()}\n\nUnix Timestamp (seconds): ${unix}\nUnix Timestamp (milliseconds): ${unixMs}\n\nLocal: ${d.toLocaleString()}\nUTC: ${d.toUTCString()}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Date Input</label>
        <input id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="2024-01-15 or Jan 15, 2024 10:30 AM" aria-label={`Input for ${toolName}`} className="input-field font-mono" />
      </InputArea>
      <button onClick={convert} className="btn-primary">Convert to Unix</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
