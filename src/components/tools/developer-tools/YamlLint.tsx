'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function YamlLint({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [valid, setValid] = useState<boolean | null>(null);

  const validate = () => {
    if (!input.trim()) { setOutput(''); setValid(null); return; }
    const lines = input.split('\n');
    const errors: string[] = [];
    lines.forEach((line, i) => {
      if (line.includes('\t')) errors.push(`Line ${i + 1}: Tab character found (use spaces)`);
      if (line.match(/:\S/) && !line.match(/https?:/) && !line.match(/["'].*:.*["']/)) errors.push(`Line ${i + 1}: Missing space after colon`);
    });
    if (errors.length === 0) { setValid(true); setOutput('✓ YAML appears valid. No common issues found.'); }
    else { setValid(false); setOutput(errors.join('\n')); }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">YAML Input</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="key: value" aria-label={`Input for ${toolName}`} className="input-field h-40 resize-y font-mono" />
      </InputArea>
      <button onClick={validate} className="btn-primary">Validate YAML</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className={`whitespace-pre-wrap text-sm font-mono p-4 rounded-lg border ${valid ? 'text-green-700 bg-green-50 border-green-200' : 'text-red-700 bg-red-50 border-red-200'}`}>{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
