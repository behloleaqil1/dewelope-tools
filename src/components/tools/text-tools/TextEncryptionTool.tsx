'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function TextEncryptionTool({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [shift, setShift] = useState('13');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [output, setOutput] = useState('');

  const caesarCipher = (text: string, shiftAmount: number): string => {
    return text.split('').map(char => {
      if (char >= 'a' && char <= 'z') {
        return String.fromCharCode(((char.charCodeAt(0) - 97 + shiftAmount + 26) % 26) + 97);
      }
      if (char >= 'A' && char <= 'Z') {
        return String.fromCharCode(((char.charCodeAt(0) - 65 + shiftAmount + 26) % 26) + 65);
      }
      return char;
    }).join('');
  };

  const process = () => {
    if (!input) { setOutput(''); return; }
    const s = parseInt(shift) || 13;
    const effectiveShift = mode === 'encrypt' ? s : -s;
    const result = caesarCipher(input, effectiveShift);
    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex gap-2 mb-2">
        <button onClick={() => setMode('encrypt')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'encrypt' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} aria-label="Switch to encrypt mode">Encrypt</button>
        <button onClick={() => setMode('decrypt')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'decrypt' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} aria-label="Switch to decrypt mode">Decrypt</button>
      </div>
      <InputArea>
        <label htmlFor={`${toolId}-shift`} className="block text-sm font-medium text-gray-700 mb-1">Shift (1-25, default 13 for ROT13)</label>
        <input id={`${toolId}-shift`} type="number" min="1" max="25" value={shift} onChange={(e) => setShift(e.target.value)} aria-label={`Shift amount for ${toolName}`} className="input-field" />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Text</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text to encrypt or decrypt" aria-label={`Text input for ${toolName}`} className="input-field h-28 resize-y font-mono" />
      </InputArea>
      <button onClick={process} className="btn-primary">{mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
