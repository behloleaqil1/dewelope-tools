'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToHomophonicCipher - Encrypt/decrypt text using a homophonic substitution cipher.
 * Each letter maps to multiple possible numeric codes based on frequency.
 */
export default function TextToHomophonicCipher({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [error, setError] = useState('');

  // Homophonic substitution table: each letter maps to multiple two-digit codes
  const encryptionTable: Record<string, number[]> = {
    A: [10, 11, 12, 13, 14, 15, 16, 17],
    B: [18, 19],
    C: [20, 21, 22],
    D: [23, 24, 25, 26],
    E: [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
    F: [40, 41, 42],
    G: [43, 44],
    H: [45, 46, 47, 48, 49, 50],
    I: [51, 52, 53, 54, 55, 56, 57],
    J: [58],
    K: [59],
    L: [60, 61, 62, 63],
    M: [64, 65, 66],
    N: [67, 68, 69, 70, 71, 72, 73],
    O: [74, 75, 76, 77, 78, 79, 80, 81],
    P: [82, 83],
    Q: [84],
    R: [85, 86, 87, 88, 89, 90],
    S: [91, 92, 93, 94, 95, 96],
    T: [97, 98, 99, 100, 101, 102, 103, 104, 105],
    U: [106, 107, 108],
    V: [109, 110],
    W: [111, 112, 113],
    X: [114],
    Y: [115, 116],
    Z: [117],
  };

  // Build reverse lookup
  const decryptionTable: Record<number, string> = {};
  for (const [letter, codes] of Object.entries(encryptionTable)) {
    for (const code of codes) {
      decryptionTable[code] = letter;
    }
  }

  function encrypt(text: string): string {
    const upper = text.toUpperCase();
    const result: string[] = [];
    for (const ch of upper) {
      if (ch >= 'A' && ch <= 'Z') {
        const codes = encryptionTable[ch];
        const randomCode = codes[Math.floor(Math.random() * codes.length)];
        result.push(randomCode.toString().padStart(2, '0'));
      } else if (ch === ' ') {
        result.push('--');
      } else {
        result.push(ch);
      }
    }
    return result.join(' ');
  }

  function decrypt(text: string): string {
    const tokens = text.trim().split(/\s+/);
    let result = '';
    for (const token of tokens) {
      if (token === '--') {
        result += ' ';
      } else {
        const num = parseInt(token, 10);
        if (!isNaN(num) && decryptionTable[num]) {
          result += decryptionTable[num];
        } else {
          result += token;
        }
      }
    }
    return result;
  }

  function handleProcess() {
    setError('');
    setOutput('');
    if (!input.trim()) {
      setError('Please enter text to process.');
      return;
    }
    if (mode === 'encrypt') {
      setOutput(encrypt(input));
    } else {
      setOutput(decrypt(input));
    }
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="flex gap-4 mb-3">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name={`${toolId}-mode`}
              checked={mode === 'encrypt'}
              onChange={() => setMode('encrypt')}
            />
            <span className="text-sm">Encrypt</span>
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name={`${toolId}-mode`}
              checked={mode === 'decrypt'}
              onChange={() => setMode('decrypt')}
            />
            <span className="text-sm">Decrypt</span>
          </label>
        </div>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          {mode === 'encrypt' ? 'Plaintext' : 'Ciphertext (space-separated codes)'}
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encrypt' ? 'Enter text to encrypt...' : 'Enter codes like: 45 27 60 60 74'}
          aria-label={`Text input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
        <button
          onClick={handleProcess}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
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
