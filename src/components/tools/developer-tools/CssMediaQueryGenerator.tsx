'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const PRESETS = [
  { label: 'Mobile (max: 480px)', query: '@media (max-width: 480px) {\n  \n}' },
  { label: 'Tablet (max: 768px)', query: '@media (max-width: 768px) {\n  \n}' },
  { label: 'Laptop (max: 1024px)', query: '@media (max-width: 1024px) {\n  \n}' },
  { label: 'Desktop (min: 1025px)', query: '@media (min-width: 1025px) {\n  \n}' },
  { label: 'Large (min: 1200px)', query: '@media (min-width: 1200px) {\n  \n}' },
];

export default function CssMediaQueryGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [minWidth, setMinWidth] = useState('');
  const [maxWidth, setMaxWidth] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    const conditions: string[] = [];
    if (minWidth) conditions.push(`(min-width: ${minWidth}px)`);
    if (maxWidth) conditions.push(`(max-width: ${maxWidth}px)`);
    if (conditions.length === 0) { setOutput('Enter at least one breakpoint value.'); return; }
    setOutput(`@media ${conditions.join(' and ')} {\n  /* styles here */\n}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-1">Custom Breakpoints</label>
        <div className="flex gap-2">
          <input value={minWidth} onChange={(e) => setMinWidth(e.target.value)} placeholder="Min width (px)" aria-label={`Min width for ${toolName}`} className="input-field" />
          <input value={maxWidth} onChange={(e) => setMaxWidth(e.target.value)} placeholder="Max width (px)" aria-label={`Max width for ${toolName}`} className="input-field" />
        </div>
      </InputArea>
      <button onClick={generate} className="btn-primary">Generate</button>
      <div className="space-y-1">{PRESETS.map(p => (<button key={p.label} onClick={() => setOutput(p.query)} className="block text-left text-sm text-blue-600 hover:underline">{p.label}</button>))}</div>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
