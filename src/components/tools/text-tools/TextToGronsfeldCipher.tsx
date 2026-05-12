'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToGronsfeldCipher - Encrypt/decrypt text using the Gronsfeld cipher.
 * A variant of Vigenère that uses a numeric key (digits 0-9) instead of letters.
 */
export default function TextToGronsfeldCipher({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const process = () => {
    setError('');
    if (!input.trim()) {
      setOutput('');
      return;
    }
    if (!key.trim() || !/^\d+$/.test(key.trim())) {
      setError('Key must contain only digits (0-9)');
      setOutput('');
      return;
    }

    const numericKey = key.trim();
    let keyIndex = 0;
    const result = input.split('').map(char => {
      if (/[a-zA-Z]/.test(char)) {
        const base = char >= 'a' && char <= 'z' ? 97 : 65;
        const shift = parseInt(numericKey[keyIndex % numericKey.length]);
        keyIndex++;
        if (mode === 'encrypt') {
          return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
        } else {
          return String.fromCharCode(((char.charCodeAt(0) - base - shift + 26) % 26) + base);
        }
      }
      return char;
    }).join('');

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex gap-2">
        <button
          onClick={() => setMode('encrypt')}
          className={`px-4 py-2 rounded text-sm font-medium ${mode === 'encrypt' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          aria-label="Switch to encrypt mode"
        >
          Encrypt
        </button>
        <button
          onClick={() => setMode('decrypt')}
          className={`px-4 py-2 rounded text-sm font-medium ${mode === 'decrypt' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          aria-label="Switch to decrypt mode"
        >
          Decrypt
        </button>
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
          aria-label={`Input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <InputArea error={error}>
        <label htmlFor={`${toolId}-key`} className="block text-sm font-medium text-gray-700 mb-1">
          Numeric Key (digits only)
        </label>
        <input
          id={`${toolId}-key`}
          type="text"
          value={key}
          onChange={(e) => { setKey(e.target.value); setError(''); }}
          placeholder="e.g. 31415"
          aria-label={`Numeric key for ${toolName}`}
          className="input-field font-mono"
        />
      </InputArea>

      <button onClick={process} aria-label={`${mode} text`} className="btn-primary">
        {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-1">How Gronsfeld Cipher Works</h3>
        <p className="text-xs text-gray-600">
          The Gronsfeld cipher is a polyalphabetic substitution cipher similar to Vigenère, but uses a numeric key (digits 0-9) instead of a keyword. Each digit shifts the corresponding letter by that many positions in the alphabet.
        </p>
      </div>
    </div>
  );
}
