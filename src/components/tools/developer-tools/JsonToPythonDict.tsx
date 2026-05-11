'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function JsonToPythonDict({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = () => {
    try {
      const parsed = JSON.parse(input);
      const toPython = (val: unknown, indent: number = 0): string => {
        const pad = '    '.repeat(indent);
        if (val === null) return 'None';
        if (val === true) return 'True';
        if (val === false) return 'False';
        if (typeof val === 'string') return `"${val}"`;
        if (typeof val === 'number') return String(val);
        if (Array.isArray(val)) {
          if (val.length === 0) return '[]';
          const items = val.map(v => `${pad}    ${toPython(v, indent + 1)}`).join(',\n');
          return `[\n${items}\n${pad}]`;
        }
        if (typeof val === 'object') {
          const entries = Object.entries(val as Record<string, unknown>);
          if (entries.length === 0) return '{}';
          const items = entries.map(([k, v]) => `${pad}    "${k}": ${toPython(v, indent + 1)}`).join(',\n');
          return `{\n${items}\n${pad}}`;
        }
        return String(val);
      };
      setOutput(toPython(parsed));
    } catch { setOutput('Error: Invalid JSON input.'); }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">JSON Input</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder='{"name": "test", "active": true}' aria-label={`Input for ${toolName}`} className="input-field h-40 resize-y font-mono" />
      </InputArea>
      <button onClick={convert} className="btn-primary">Convert to Python</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
