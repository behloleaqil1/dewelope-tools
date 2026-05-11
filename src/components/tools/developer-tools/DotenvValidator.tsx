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
    const issues: string[] = [];
    let validCount = 0;
    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      if (!trimmed.includes('=')) { issues.push(`Line ${i + 1}: Missing '=' separator`); return; }
      const key = trimmed.split('=')[0].trim();
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) { issues.push(`Line ${i + 1}: Invalid key "${key}"`); return; }
      validCount++;
    });
    const result = issues.length === 0
      ? `✓ Valid .env file with ${validCount} variable(s). No issues found.`
      : `Found ${issues.length} issue(s):\n\n${issues.join('\n')}\n\nValid variables: ${validCount}`;
    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">.env Content</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="DB_HOST=localhost\nDB_PORT=5432" aria-label={`Input for ${toolName}`} className="input-field h-40 resize-y font-mono" />
      </InputArea>
      <button onClick={validate} className="btn-primary">Validate</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
