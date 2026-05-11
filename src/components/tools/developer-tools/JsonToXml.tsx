'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function JsonToXml({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const jsonToXml = (obj: unknown, rootName: string = 'root', indent: number = 0): string => {
    const pad = '  '.repeat(indent);
    if (obj === null || obj === undefined) return `${pad}<${rootName}/>`;
    if (typeof obj !== 'object') return `${pad}<${rootName}>${String(obj)}</${rootName}>`;
    if (Array.isArray(obj)) return obj.map(item => jsonToXml(item, 'item', indent)).join('\n');
    const entries = Object.entries(obj as Record<string, unknown>);
    const children = entries.map(([key, val]) => jsonToXml(val, key, indent + 1)).join('\n');
    return `${pad}<${rootName}>\n${children}\n${pad}</${rootName}>`;
  };

  const convert = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput('<?xml version="1.0" encoding="UTF-8"?>\n' + jsonToXml(parsed));
    } catch { setOutput('Error: Invalid JSON input.'); }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">JSON Input</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder='{"name": "test", "value": 123}' aria-label={`Input for ${toolName}`} className="input-field h-40 resize-y font-mono" />
      </InputArea>
      <button onClick={convert} className="btn-primary">Convert to XML</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
