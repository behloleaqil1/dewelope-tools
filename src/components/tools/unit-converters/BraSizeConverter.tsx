'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const SIZES: Record<string, Record<string, string>> = {
  '32A': { us: '32A', uk: '32A', eu: '70A' }, '32B': { us: '32B', uk: '32B', eu: '70B' }, '32C': { us: '32C', uk: '32C', eu: '70C' }, '32D': { us: '32D', uk: '32D', eu: '70D' },
  '34A': { us: '34A', uk: '34A', eu: '75A' }, '34B': { us: '34B', uk: '34B', eu: '75B' }, '34C': { us: '34C', uk: '34C', eu: '75C' }, '34D': { us: '34D', uk: '34D', eu: '75D' },
  '36A': { us: '36A', uk: '36A', eu: '80A' }, '36B': { us: '36B', uk: '36B', eu: '80B' }, '36C': { us: '36C', uk: '36C', eu: '80C' }, '36D': { us: '36D', uk: '36D', eu: '80D' },
  '38A': { us: '38A', uk: '38A', eu: '85A' }, '38B': { us: '38B', uk: '38B', eu: '85B' }, '38C': { us: '38C', uk: '38C', eu: '85C' }, '38D': { us: '38D', uk: '38D', eu: '85D' },
};

export default function BraSizeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [size, setSize] = useState('34B');
  const [output, setOutput] = useState('');

  const convert = () => {
    const match = SIZES[size.toUpperCase()];
    if (!match) { setOutput('Size not found. Try: 32A-38D'); return; }
    setOutput(`US: ${match.us}\nUK: ${match.uk}\nEU: ${match.eu}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">US/UK Size</label>
        <select id={`${toolId}-size`} value={size} onChange={(e) => setSize(e.target.value)} className="input-field" aria-label={`Size for ${toolName}`}>
          {Object.keys(SIZES).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </InputArea>
      <button onClick={convert} className="btn-primary">Convert</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
