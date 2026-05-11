'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function TextEncoderDecoder({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [format, setFormat] = useState('uri');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [output, setOutput] = useState('');

  const process = () => {
    if (!input) return;
    try {
      if (format === 'uri') {
        setOutput(mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input));
      } else if (format === 'base64') {
        setOutput(mode === 'encode' ? btoa(unescape(encodeURIComponent(input))) : decodeURIComponent(escape(atob(input))));
      } else if (format === 'html') {
        if (mode === 'encode') {
          setOutput(input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'));
        } else {
          setOutput(input.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"'));
        }
      }
    } catch { setOutput('Error: Invalid input for decoding'); }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Enter text</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text to encode or decode..." aria-label={`Text input for ${toolName}`} className="input-field h-32 resize-y font-mono" />
      </InputArea>
      <div className="flex gap-4">
        <select value={format} onChange={(e) => setFormat(e.target.value)} aria-label="Encoding format" className="input-field flex-1">
          <option value="uri">URI Component</option>
          <option value="base64">Base64</option>
          <option value="html">HTML Entities</option>
        </select>
        <select value={mode} onChange={(e) => setMode(e.target.value as 'encode' | 'decode')} aria-label="Mode" className="input-field flex-1">
          <option value="encode">Encode</option>
          <option value="decode">Decode</option>
        </select>
      </div>
      <button onClick={process} className="btn-primary" aria-label="Process text">{mode === 'encode' ? 'Encode' : 'Decode'}</button>
      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
