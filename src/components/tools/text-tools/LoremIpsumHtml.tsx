'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

export default function LoremIpsumHtml({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [tag, setTag] = useState('p');
  const [count, setCount] = useState('3');
  const [output, setOutput] = useState('');

  const generate = () => {
    const num = Math.min(Math.max(parseInt(count) || 1, 1), 20);
    const lines = Array.from({ length: num }, () => `<${tag}>${LOREM}</${tag}>`);
    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-tag`} className="block text-sm font-medium text-gray-700 mb-1">HTML Tag</label>
        <select id={`${toolId}-tag`} value={tag} onChange={(e) => setTag(e.target.value)} className="input-field" aria-label={`Tag for ${toolName}`}>
          <option value="p">{'<p>'}</option><option value="div">{'<div>'}</option><option value="li">{'<li>'}</option><option value="span">{'<span>'}</option><option value="h2">{'<h2>'}</option>
        </select>
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">Count (1-20)</label>
        <input id={`${toolId}-count`} value={count} onChange={(e) => setCount(e.target.value)} className="input-field" aria-label={`Count for ${toolName}`} />
      </InputArea>
      <button onClick={generate} className="btn-primary">Generate</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
