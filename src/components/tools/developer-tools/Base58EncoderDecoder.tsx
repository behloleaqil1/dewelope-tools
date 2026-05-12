'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

export default function Base58EncoderDecoder({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const process = () => {
    if (!input.trim()) { setOutput(''); return; }
    if (mode === 'encode') {
      const bytes = new TextEncoder().encode(input);
      let num = BigInt(0);
      for (const b of bytes) num = num * BigInt(256) + BigInt(b);
      let result = '';
      while (num > 0) { result = ALPHABET[Number(num % BigInt(58))] + result; num = num / BigInt(58); }
      for (const b of bytes) { if (b === 0) result = '1' + result; else break; }
      setOutput(result);
    } else {
      try {
        let num = BigInt(0);
        for (const c of input) { const i = ALPHABET.indexOf(c); if (i < 0) throw new Error('Invalid'); num = num * BigInt(58) + BigInt(i); }
        const hex = num.toString(16).padStart(2, '0');
        const bytes = hex.match(/.{2}/g)?.map(h => parseInt(h, 16)) || [];
        setOutput(new TextDecoder().decode(new Uint8Array(bytes)));
      } catch { setOutput('Error: Invalid Base58 input'); }
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
        <select id={`${toolId}-mode`} value={mode} onChange={(e) => setMode(e.target.value as 'encode' | 'decode')} className="input-field" aria-label={`Mode for ${toolName}`}>
          <option value="encode">Encode</option><option value="decode">Decode</option>
        </select>
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Input</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'encode' ? 'Text to encode...' : 'Base58 to decode...'} aria-label={`Input for ${toolName}`} className="input-field h-28 resize-y font-mono" />
      </InputArea>
      <button onClick={process} className="btn-primary">{mode === 'encode' ? 'Encode' : 'Decode'}</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 break-all">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
