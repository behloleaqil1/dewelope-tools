'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function TextMirrorReverser({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('mirror');

  const mirrorMap: Record<string, string> = {
    'a': 'ɒ', 'b': 'd', 'c': 'ɔ', 'd': 'b', 'e': 'ɘ', 'f': 'Ꮈ', 'g': 'ǫ',
    'h': 'ʜ', 'i': 'i', 'j': 'ꞁ', 'k': 'ʞ', 'l': 'l', 'm': 'm', 'n': 'ᴎ',
    'o': 'o', 'p': 'q', 'q': 'p', 'r': 'ɿ', 's': 'ꙅ', 't': 'ƚ', 'u': 'u',
    'v': 'v', 'w': 'w', 'x': 'x', 'y': 'ʏ', 'z': 'ꙅ',
    'A': 'A', 'B': 'ᗺ', 'C': 'Ↄ', 'D': 'ᗡ', 'E': 'Ǝ', 'F': 'ꟻ', 'G': 'Ꭾ',
    'H': 'H', 'I': 'I', 'J': 'Ꞁ', 'K': 'ꓘ', 'L': '⌐', 'M': 'M', 'N': 'ᴎ',
    'O': 'O', 'P': 'ꟼ', 'Q': 'Ọ', 'R': 'ᴙ', 'S': 'Ꙅ', 'T': 'T', 'U': 'U',
    'V': 'V', 'W': 'W', 'X': 'X', 'Y': 'Y', 'Z': 'Ꙅ',
  };

  const convert = () => {
    if (!input) { setOutput(''); return; }
    switch (mode) {
      case 'mirror': {
        const mirrored = Array.from(input).reverse().map(c => mirrorMap[c] || c).join('');
        setOutput(mirrored);
        break;
      }
      case 'reverse': {
        setOutput(Array.from(input).reverse().join(''));
        break;
      }
      case 'reverseWords': {
        setOutput(input.split(' ').reverse().join(' '));
        break;
      }
      case 'reverseEachWord': {
        setOutput(input.split(' ').map(w => Array.from(w).reverse().join('')).join(' '));
        break;
      }
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
        <select id={`${toolId}-mode`} value={mode} onChange={(e) => setMode(e.target.value)} aria-label={`Mode for ${toolName}`} className="input-field">
          <option value="mirror">Mirror (Unicode flip)</option>
          <option value="reverse">Reverse Characters</option>
          <option value="reverseWords">Reverse Word Order</option>
          <option value="reverseEachWord">Reverse Each Word</option>
        </select>
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Text Input</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Hello World" aria-label={`Text input for ${toolName}`} className="input-field h-28 resize-y font-mono" />
      </InputArea>
      <button onClick={convert} className="btn-primary">Transform</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><p className="text-lg break-all font-mono">{output}</p><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
