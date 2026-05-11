'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function HtmlBeautifier({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const beautify = () => {
    if (!input.trim()) { setOutput(''); return; }
    let indent = 0;
    const lines = input.replace(/>\s*</g, '>\n<').split('\n');
    const result = lines.map(line => {
      line = line.trim();
      if (!line) return '';
      if (line.startsWith('</')) indent = Math.max(0, indent - 1);
      const formatted = '  '.repeat(indent) + line;
      if (line.startsWith('<') && !line.startsWith('</') && !line.endsWith('/>') && !line.includes('</')) indent++;
      return formatted;
    }).filter(Boolean).join('\n');
    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">HTML Input</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste HTML to beautify..." aria-label={`Input for ${toolName}`} className="input-field h-48 resize-y font-mono" />
      </InputArea>
      <button onClick={beautify} className="btn-primary">Beautify HTML</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
