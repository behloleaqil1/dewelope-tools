'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function DotenvValidator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const validate = () => {
    if (!input.trim()) { setOutput(''); return; }
    const lines = input.split('\n');
    const errors: string[] = [];
    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      if (!/^[A-Za-z_][A-Za-z0-9_]*=/.test(trimmed)) {
        errors.push(`Line ${i + 1}: Invalid syntax - "${trimmed.substring(0, 30)}"`);
      }
    });
    setOutput(errors.length === 0 ? '✓ Valid .env file syntax. No issues found.' : `Found ${errors.length} issue(s):\n\n${errors.join('\n')}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Paste .env content</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="KEY=value&#10;DB_HOST=localhost" aria-label={`Input for ${toolName}`} className="input-field h-40 resize-y font-mono" />
      </InputArea>
      <button onClick={validate} className="btn-primary">Validate</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
