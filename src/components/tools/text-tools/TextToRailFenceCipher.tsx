'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToRailFenceCipher - Encrypt/decrypt text using the Rail Fence cipher.
 * Arranges text in a zigzag pattern across a specified number of rails.
 */
export default function TextToRailFenceCipher({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [rails, setRails] = useState('3');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [output, setOutput] = useState('');

  const encrypt = (text: string, numRails: number): string => {
    if (numRails <= 1 || numRails >= text.length) return text;

    const fence: string[][] = Array.from({ length: numRails }, () => []);
    let rail = 0;
    let direction = 1;

    for (const char of text) {
      fence[rail].push(char);
      if (rail === 0) direction = 1;
      if (rail === numRails - 1) direction = -1;
      rail += direction;
    }

    return fence.flat().join('');
  };

  const decrypt = (text: string, numRails: number): string => {
    if (numRails <= 1 || numRails >= text.length) return text;

    const len = text.length;
    const fence: string[][] = Array.from({ length: numRails }, () => []);

    // Calculate the length of each rail
    const railLengths = new Array(numRails).fill(0);
    let rail = 0;
    let direction = 1;
    for (let i = 0; i < len; i++) {
      railLengths[rail]++;
      if (rail === 0) direction = 1;
      if (rail === numRails - 1) direction = -1;
      rail += direction;
    }

    // Fill the rails with characters
    let idx = 0;
    for (let r = 0; r < numRails; r++) {
      for (let j = 0; j < railLengths[r]; j++) {
        fence[r].push(text[idx++]);
      }
    }

    // Read off in zigzag order
    const result: string[] = [];
    const railIndices = new Array(numRails).fill(0);
    rail = 0;
    direction = 1;
    for (let i = 0; i < len; i++) {
      result.push(fence[rail][railIndices[rail]]);
      railIndices[rail]++;
      if (rail === 0) direction = 1;
      if (rail === numRails - 1) direction = -1;
      rail += direction;
    }

    return result.join('');
  };

  const process = () => {
    if (!input.trim()) {
      setOutput('Please enter text to process.');
      return;
    }

    const numRails = parseInt(rails);
    if (isNaN(numRails) || numRails < 2) {
      setOutput('Please enter at least 2 rails.');
      return;
    }

    if (mode === 'encrypt') {
      setOutput(encrypt(input, numRails));
    } else {
      setOutput(decrypt(input, numRails));
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Input Text
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to encrypt or decrypt..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <div className="flex flex-wrap gap-4 items-end">
        <InputArea>
          <label htmlFor={`${toolId}-rails`} className="block text-sm font-medium text-gray-700 mb-1">
            Number of Rails
          </label>
          <input
            id={`${toolId}-rails`}
            type="number"
            min="2"
            max="20"
            value={rails}
            onChange={(e) => setRails(e.target.value)}
            aria-label={`Number of rails for ${toolName}`}
            className="input-field w-24"
          />
        </InputArea>

        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={mode === 'encrypt'} onChange={() => setMode('encrypt')} className="text-blue-600" />
              <span className="text-sm">Encrypt</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={mode === 'decrypt'} onChange={() => setMode('decrypt')} className="text-blue-600" />
              <span className="text-sm">Decrypt</span>
            </label>
          </div>
        </InputArea>
      </div>

      <button onClick={process} aria-label={`${mode === 'encrypt' ? 'Encrypt' : 'Decrypt'} with Rail Fence cipher`} className="btn-primary">
        {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {mode === 'encrypt' ? 'Encrypted' : 'Decrypted'} Text
            </label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
