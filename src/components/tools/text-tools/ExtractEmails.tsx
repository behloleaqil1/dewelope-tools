'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function ExtractEmails({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const extract = () => {
    if (!input.trim()) { setOutput(''); return; }
    const emails = input.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g) || [];
    const unique = [...new Set(emails)];
    setOutput(unique.length > 0 ? `Found ${unique.length} email(s):\n\n${unique.join('\n')}` : 'No email addresses found.');
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Text to Search</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste text containing email addresses..." aria-label={`Input for ${toolName}`} className="input-field h-40 resize-y font-mono" />
      </InputArea>
      <button onClick={extract} className="btn-primary">Extract Emails</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
