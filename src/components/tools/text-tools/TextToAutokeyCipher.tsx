'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToAutokeyCipher - Encrypt and decrypt text using the Autokey cipher.
 * Uses a keyword followed by the plaintext itself as the key stream.
 */
export default function TextToAutokeyCipher({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [output, setOutput] = useState('');

  const process = () => {
    const text = input.trim().toUpperCase();
    const key = keyword.trim().toUpperCase().replace(/[^A-Z]/g, '');

    if (!text || !key) {
      setOutput('Please enter both text and a keyword.');
      return;
    }

    const letters = text.replace(/[^A-Z]/g, '');
    let result = '';

    if (mode === 'encrypt') {
      // Key stream = keyword + plaintext
      let keyStream = key;
      for (let i = 0; i < letters.length; i++) {
        if (i >= keyStream.length) {
          keyStream += letters[i - key.length + (key.length > i ? 0 : key.length)];
          // Actually for autokey: keystream = keyword + plaintext chars
          // We build it as we go
        }
        const keyChar = i < key.length ? key.charCodeAt(i) - 65 : letters.charCodeAt(i - key.length) - 65;
        const plainChar = letters.charCodeAt(i) - 65;
        const cipherChar = (plainChar + keyChar) % 26;
        result += String.fromCharCode(cipherChar + 65);
      }
    } else {
      // Decrypt: key stream = keyword + decrypted plaintext
      const decrypted: number[] = [];
      for (let i = 0; i < letters.length; i++) {
        const keyChar = i < key.length ? key.charCodeAt(i) - 65 : decrypted[i - key.length];
        const cipherChar = letters.charCodeAt(i) - 65;
        const plainChar = (cipherChar - keyChar + 26) % 26;
        decrypted.push(plainChar);
        result += String.fromCharCode(plainChar + 65);
      }
    }

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex gap-4 mb-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name={`${toolId}-mode`}
            checked={mode === 'encrypt'}
            onChange={() => setMode('encrypt')}
          />
          Encrypt
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name={`${toolId}-mode`}
            checked={mode === 'decrypt'}
            onChange={() => setMode('decrypt')}
          />
          Decrypt
        </label>
      </div>

      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          {mode === 'encrypt' ? 'Plaintext' : 'Ciphertext'}
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encrypt' ? 'Enter text to encrypt...' : 'Enter text to decrypt...'}
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-key`} className="block text-sm font-medium text-gray-700 mb-1">
          Keyword
        </label>
        <input
          id={`${toolId}-key`}
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="e.g., SECRET"
          aria-label={`Keyword for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <button onClick={process} aria-label={`${mode} text`} className="btn-primary">
        {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
      </button>

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
