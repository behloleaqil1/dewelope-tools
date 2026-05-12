'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToZigzagCipher - Encrypt/decrypt text using the zigzag (rail fence) cipher variant.
 * Text is written in a zigzag pattern across N rails, then read off row by row.
 */
export default function TextToZigzagCipher({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [rails, setRails] = useState(3);
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [output, setOutput] = useState('');

  const encrypt = (text: string, numRails: number): string => {
    if (numRails <= 1 || numRails >= text.length) return text;
    const fence: string[][] = Array.from({ length: numRails }, () => []);
    let rail = 0;
    let direction = 1;

    for (const ch of text) {
      fence[rail].push(ch);
      if (rail === 0) direction = 1;
      if (rail === numRails - 1) direction = -1;
      rail += direction;
    }

    return fence.map(row => row.join('')).join('');
  };

  const decrypt = (text: string, numRails: number): string => {
    if (numRails <= 1 || numRails >= text.length) return text;
    const len = text.length;
    const fence: string[][] = Array.from({ length: numRails }, () => []);
    const pattern: number[] = [];
    let rail = 0;
    let direction = 1;

    for (let i = 0; i < len; i++) {
      pattern.push(rail);
      if (rail === 0) direction = 1;
      if (rail === numRails - 1) direction = -1;
      rail += direction;
    }

    const rowLengths = Array(numRails).fill(0);
    pattern.forEach(r => rowLengths[r]++);

    let idx = 0;
    for (let r = 0; r < numRails; r++) {
      fence[r] = text.slice(idx, idx + rowLengths[r]).split('');
      idx += rowLengths[r];
    }

    const rowIdx = Array(numRails).fill(0);
    let result = '';
    for (let i = 0; i < len; i++) {
      const r = pattern[i];
      result += fence[r][rowIdx[r]];
      rowIdx[r]++;
    }

    return result;
  };

  const process = () => {
    if (!input) {
      setOutput('');
      return;
    }
    if (mode === 'encrypt') {
      setOutput(encrypt(input, rails));
    } else {
      setOutput(decrypt(input, rails));
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
            <select id={`${toolId}-mode`} value={mode} onChange={(e) => setMode(e.target.value as 'encrypt' | 'decrypt')} className="input-field" aria-label={`Mode for ${toolName}`}>
              <option value="encrypt">Encrypt</option>
              <option value="decrypt">Decrypt</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-rails`} className="block text-sm font-medium text-gray-700 mb-1">Number of Rails</label>
            <input id={`${toolId}-rails`} type="number" min={2} max={20} value={rails} onChange={(e) => setRails(Math.max(2, Math.min(20, parseInt(e.target.value) || 2)))} className="input-field" aria-label="Number of rails" />
          </div>
        </div>
        <div>
          <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
            {mode === 'encrypt' ? 'Text to Encrypt' : 'Text to Decrypt'}
          </label>
          <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder={`Enter text to ${mode}...`} className="input-field h-32 resize-y font-mono" aria-label="Input text" />
        </div>
        <button onClick={process} className="btn-primary mt-4">{mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
