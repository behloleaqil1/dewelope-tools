'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function CombinationsGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [size, setSize] = useState('2');
  const [output, setOutput] = useState('');

  const generate = () => {
    const items = input.split(/[,\n]+/).map(s => s.trim()).filter(Boolean);
    const r = parseInt(size);
    if (items.length === 0 || isNaN(r) || r < 1) { setOutput('Enter items and a valid group size.'); return; }
    if (r > items.length) { setOutput('Group size cannot exceed number of items.'); return; }
    const combos: string[][] = [];
    const combine = (start: number, current: string[]) => {
      if (current.length === r) { combos.push([...current]); return; }
      if (combos.length > 500) return;
      for (let i = start; i < items.length; i++) { current.push(items[i]); combine(i + 1, current); current.pop(); }
    };
    combine(0, []);
    const total = combos.length;
    setOutput(`Total combinations: ${total}${total > 500 ? ' (showing first 500)' : ''}\n\n${combos.map((c, i) => `${i + 1}. ${c.join(', ')}`).join('\n')}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Items (comma separated)</label>
        <input id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="A, B, C, D" aria-label={`Input for ${toolName}`} className="input-field" />
      </InputArea>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-1">Group Size</label>
        <input type="number" min="1" value={size} onChange={(e) => setSize(e.target.value)} className="input-field w-24" aria-label="Group size" />
      </InputArea>
      <button onClick={generate} className="btn-primary">Generate</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 max-h-96 overflow-y-auto">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
