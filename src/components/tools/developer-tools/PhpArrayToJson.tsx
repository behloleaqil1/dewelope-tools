'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function PhpArrayToJson({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();

  const convert = () => {
    if (!input.trim()) { setError('Please enter PHP array syntax'); setOutput(''); return; }
    setError(undefined);
    try {
      let json = input.replace(/array\s*\(/g, '[').replace(/\)/g, ']');
      json = json.replace(/=>/g, ':');
      json = json.replace(/'/g, '"');
      json = json.replace(/,\s*([\]}])/g, '$1');
      JSON.parse(json);
      setOutput(JSON.stringify(JSON.parse(json), null, 2));
    } catch { setOutput(''); setError('Could not parse PHP array. Ensure it uses simple syntax.'); }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">PHP Array</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="array('key' => 'value')" aria-label={`Input for ${toolName}`} className="input-field h-36 resize-y font-mono" />
      </InputArea>
      <button onClick={convert} className="btn-primary">Convert to JSON</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
