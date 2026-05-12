'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToDotNotation - Convert nested text/paths to dot notation.
 */
export default function TextToDotNotation({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  function convert() {
    if (!input.trim()) { setOutput(''); return; }
    const lines = input.split('\n').filter((l) => l.trim());
    const result = lines.map((line) => {
      return line.trim()
        .replace(/\//g, '.')
        .replace(/\\/g, '.')
        .replace(/\[(\w+)\]/g, '.$1')
        .replace(/^\.+/, '')
        .replace(/\.+/g, '.');
    });
    setOutput(result.join('\n'));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Nested Paths for {toolName}</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="user/profile/name&#10;config[database][host]" aria-label="Text paths to convert to dot notation" className="input-field h-40 resize-y font-mono" />
      </InputArea>

      <button onClick={convert} aria-label="Convert to dot notation" className="btn-primary">Convert</button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
