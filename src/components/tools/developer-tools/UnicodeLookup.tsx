'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function UnicodeLookup({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'char' | 'code'>('char');

  const lookup = () => {
    if (!input.trim()) { setOutput(''); return; }
    if (mode === 'char') {
      const results = [...input].map(c => `"${c}" → U+${c.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')} (decimal: ${c.codePointAt(0)})`);
      setOutput(results.join('\n'));
    } else {
      const codes = input.replace(/U\+/gi, '').split(/[\s,]+/).filter(Boolean);
      const results = codes.map(code => {
        const cp = parseInt(code, 16);
        if (isNaN(cp)) return `Invalid: ${code}`;
        return `U+${code.toUpperCase().padStart(4, '0')} → "${String.fromCodePoint(cp)}" (decimal: ${cp})`;
      });
      setOutput(results.join('\n'));
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
        <select id={`${toolId}-mode`} value={mode} onChange={(e) => setMode(e.target.value as 'char' | 'code')} className="input-field" aria-label={`Mode for ${toolName}`}>
          <option value="char">Character → Code Point</option><option value="code">Code Point → Character</option>
        </select>
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">{mode === 'char' ? 'Characters' : 'Code Points (hex)'}</label>
        <input id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'char' ? 'Hello 🌍' : 'U+0041 U+1F30D'} className="input-field" aria-label={`Input for ${toolName}`} />
      </InputArea>
      <button onClick={lookup} className="btn-primary">Look Up</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
