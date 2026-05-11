'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function IniToJson({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = () => {
    if (!input.trim()) { setOutput(''); return; }
    const result: Record<string, Record<string, string> | string> = {};
    let currentSection = '';
    input.split('\n').forEach(line => {
      line = line.trim();
      if (!line || line.startsWith(';') || line.startsWith('#')) return;
      const sectionMatch = line.match(/^\[(.+)\]$/);
      if (sectionMatch) { currentSection = sectionMatch[1]; result[currentSection] = {}; return; }
      const eqIdx = line.indexOf('=');
      if (eqIdx === -1) return;
      const key = line.slice(0, eqIdx).trim();
      const val = line.slice(eqIdx + 1).trim();
      if (currentSection) { (result[currentSection] as Record<string, string>)[key] = val; }
      else { result[key] = val; }
    });
    setOutput(JSON.stringify(result, null, 2));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">INI Input</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="[section]\nkey=value" aria-label={`Input for ${toolName}`} className="input-field h-40 resize-y font-mono" />
      </InputArea>
      <button onClick={convert} className="btn-primary">Convert to JSON</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
