'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToPortaCipher - Encrypt/decrypt text using the Porta cipher (reciprocal polyalphabetic cipher).
 */
export default function TextToPortaCipher({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const portaTableau: string[][] = [
    ['N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
    ['O','P','Q','R','S','T','U','V','W','X','Y','Z','N'],
    ['P','Q','R','S','T','U','V','W','X','Y','Z','N','O'],
    ['Q','R','S','T','U','V','W','X','Y','Z','N','O','P'],
    ['R','S','T','U','V','W','X','Y','Z','N','O','P','Q'],
    ['S','T','U','V','W','X','Y','Z','N','O','P','Q','R'],
    ['T','U','V','W','X','Y','Z','N','O','P','Q','R','S'],
    ['U','V','W','X','Y','Z','N','O','P','Q','R','S','T'],
    ['V','W','X','Y','Z','N','O','P','Q','R','S','T','U'],
    ['W','X','Y','Z','N','O','P','Q','R','S','T','U','V'],
    ['X','Y','Z','N','O','P','Q','R','S','T','U','V','W'],
    ['Y','Z','N','O','P','Q','R','S','T','U','V','W','X'],
    ['Z','N','O','P','Q','R','S','T','U','V','W','X','Y'],
  ];

  function portaCipher(text: string, key: string): string {
    const upperText = text.toUpperCase();
    const upperKey = key.toUpperCase().replace(/[^A-Z]/g, '');
    if (!upperKey) return text;

    let keyIndex = 0;
    let result = '';

    for (let i = 0; i < upperText.length; i++) {
      const ch = upperText[i];
      if (ch < 'A' || ch > 'Z') {
        result += text[i];
        continue;
      }

      const keyChar = upperKey[keyIndex % upperKey.length];
      const row = Math.floor((keyChar.charCodeAt(0) - 65) / 2);
      const plainIndex = ch.charCodeAt(0) - 65;

      if (plainIndex < 13) {
        // First half (A-M) -> lookup in tableau
        result += portaTableau[row][plainIndex];
      } else {
        // Second half (N-Z) -> reverse lookup
        const col = portaTableau[row].indexOf(ch);
        result += String.fromCharCode(65 + col);
      }
      keyIndex++;
    }
    return result;
  }

  function handleProcess() {
    setError('');
    setOutput('');
    if (!input.trim()) {
      setError('Please enter text to encrypt/decrypt.');
      return;
    }
    if (!keyword.trim() || !/[a-zA-Z]/.test(keyword)) {
      setError('Please enter a valid alphabetic keyword.');
      return;
    }
    setOutput(portaCipher(input, keyword));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-keyword`} className="block text-sm font-medium text-gray-700 mb-1">
          Keyword
        </label>
        <input
          id={`${toolId}-keyword`}
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter keyword..."
          aria-label={`Keyword for ${toolName}`}
          className="input-field mb-3"
        />
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Text (Porta cipher is reciprocal — same operation encrypts and decrypts)
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to encrypt or decrypt..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
        <button
          onClick={handleProcess}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Encrypt / Decrypt
        </button>
      </InputArea>

      {error && <p className="text-red-600 text-sm">{error}</p>}

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
