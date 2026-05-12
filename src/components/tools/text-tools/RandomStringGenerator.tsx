'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function RandomStringGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [length, setLength] = useState('16');
  const [count, setCount] = useState('5');
  const [chars, setChars] = useState({ upper: true, lower: true, digits: true, special: false });
  const [output, setOutput] = useState('');

  const generate = () => {
    let charset = '';
    if (chars.upper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.lower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.digits) charset += '0123456789';
    if (chars.special) charset += '!@#$%^&*()_+-=';
    if (!charset) { setOutput('Select at least one character set'); return; }
    const len = Math.min(Math.max(parseInt(length) || 8, 1), 256);
    const num = Math.min(Math.max(parseInt(count) || 1, 1), 50);
    const results: string[] = [];
    for (let i = 0; i < num; i++) {
      let str = '';
      for (let j = 0; j < len; j++) str += charset[Math.floor(Math.random() * charset.length)];
      results.push(str);
    }
    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-len`} className="block text-sm font-medium text-gray-700 mb-1">Length</label>
        <input id={`${toolId}-len`} value={length} onChange={(e) => setLength(e.target.value)} className="input-field" aria-label={`Length for ${toolName}`} />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">Count</label>
        <input id={`${toolId}-count`} value={count} onChange={(e) => setCount(e.target.value)} className="input-field" aria-label={`Count for ${toolName}`} />
      </InputArea>
      <InputArea>
        <fieldset><legend className="block text-sm font-medium text-gray-700 mb-2">Characters</legend>
          <div className="flex flex-wrap gap-3">
            {Object.entries(chars).map(([k, v]) => (<label key={k} className="flex items-center gap-1 text-sm"><input type="checkbox" checked={v} onChange={() => setChars(p => ({ ...p, [k]: !p[k as keyof typeof p] }))} />{k}</label>))}
          </div>
        </fieldset>
      </InputArea>
      <button onClick={generate} className="btn-primary">Generate</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 break-all">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
