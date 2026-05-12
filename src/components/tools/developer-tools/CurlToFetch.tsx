'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function CurlToFetch({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = () => {
    if (!input.trim()) { setOutput(''); return; }
    try {
      const urlMatch = input.match(/curl\s+(?:(?:-[A-Za-z]+\s+\S+\s+)*)?['"]?(https?:\/\/[^\s'"]+)['"]?/);
      const methodMatch = input.match(/-X\s+(\w+)/);
      const headerMatches = [...input.matchAll(/-H\s+['"]([^'"]+)['"]/g)];
      const dataMatch = input.match(/-d\s+['"]([^'"]+)['"]/);
      const url = urlMatch?.[1] || 'https://example.com';
      const method = methodMatch?.[1] || (dataMatch ? 'POST' : 'GET');
      const headers: Record<string, string> = {};
      headerMatches.forEach(m => { const [k, v] = m[1].split(': '); if (k && v) headers[k] = v; });
      let code = `fetch('${url}'`;
      const opts: string[] = [];
      if (method !== 'GET') opts.push(`  method: '${method}'`);
      if (Object.keys(headers).length) opts.push(`  headers: ${JSON.stringify(headers, null, 4)}`);
      if (dataMatch) opts.push(`  body: '${dataMatch[1]}'`);
      if (opts.length) code += `, {\n${opts.join(',\n')}\n}`;
      code += ')';
      setOutput(code);
    } catch { setOutput('Error: Could not parse cURL command.'); }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">cURL Command</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder={'curl -X POST https://api.example.com -H \'Content-Type: application/json\' -d \'{"key":"value"}\''} aria-label={`Input for ${toolName}`} className="input-field h-32 resize-y font-mono" />
      </InputArea>
      <button onClick={convert} className="btn-primary">Convert to fetch()</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
