'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function UnixToDate({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = () => {
    const ts = parseInt(input);
    if (isNaN(ts)) { setOutput('Enter a valid Unix timestamp.'); return; }
    const ms = ts > 9999999999 ? ts : ts * 1000;
    const date = new Date(ms);
    if (isNaN(date.getTime())) { setOutput('Invalid timestamp.'); return; }
    setOutput(`UTC: ${date.toUTCString()}\nLocal: ${date.toLocaleString()}\nISO: ${date.toISOString()}\nDate: ${date.toDateString()}\nTime: ${date.toTimeString()}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Unix Timestamp</label>
        <input id={`${toolId}-input`} type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. 1700000000" aria-label={`Input for ${toolName}`} className="input-field font-mono" />
      </InputArea>
      <button onClick={convert} className="btn-primary">Convert to Date</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
