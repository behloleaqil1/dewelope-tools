'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function JsonToPhpArray({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = () => {
    if (!input.trim()) { setOutput(''); return; }
    try {
      const obj = JSON.parse(input);
      const toPhp = (val: unknown, indent: number): string => {
        const pad = '    '.repeat(indent);
        if (val === null) return 'null';
        if (typeof val === 'boolean') return val ? 'true' : 'false';
        if (typeof val === 'number') return String(val);
        if (typeof val === 'string') return `'${val.replace(/'/g, "\\'")}'`;
        if (Array.isArray(val)) {
          if (val.length === 0) return '[]';
          const items = val.map(v => `${pad}    ${toPhp(v, indent + 1)}`);
          return `[\n${items.join(',\n')}\n${pad}]`;
        }
        if (typeof val === 'object') {
          const entries = Object.entries(val as Record<string, unknown>);
          if (entries.length === 0) return '[]';
          const items = entries.map(([k, v]) => `${pad}    '${k}' => ${toPhp(v, indent + 1)}`);
          return `[\n${items.join(',\n')}\n${pad}]`;
        }
        return String(val);
      };
      setOutput(toPhp(obj, 0));
    } catch { setOutput('Error: Invalid JSON input.'); }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">JSON Input</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder='{"key": "value"}' aria-label={`Input for ${toolName}`} className="input-field h-40 resize-y font-mono" />
      </InputArea>
      <button onClick={convert} className="btn-primary">Convert to PHP Array</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
