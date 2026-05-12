'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function JsonStringEscape({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'escape' | 'unescape'>('escape');

  const process = () => {
    if (!input) { setOutput(''); return; }
    try {
      if (mode === 'escape') {
        setOutput(JSON.stringify(input));
      } else {
        setOutput(JSON.parse(input));
      }
    } catch { setOutput('Error: Invalid input for the selected operation.'); }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Input String</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder='Enter text to escape or a JSON string to unescape...' aria-label={`Input for ${toolName}`} className="input-field h-32 resize-y font-mono" />
        <div className="flex gap-2 mt-2">
          <button onClick={() => setMode('escape')} className={`px-3 py-1 rounded text-sm border ${mode === 'escape' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}>Escape</button>
          <button onClick={() => setMode('unescape')} className={`px-3 py-1 rounded text-sm border ${mode === 'unescape' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}>Unescape</button>
        </div>
      </InputArea>
      <button onClick={process} className="btn-primary">{mode === 'escape' ? 'Escape' : 'Unescape'}</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
