'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToBaconCipher - Encrypts and decrypts text using Bacon's cipher.
 * Uses a steganographic binary encoding (A/B or 0/1) for each letter.
 */
export default function TextToBaconCipher({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [encoding, setEncoding] = useState<'ab' | 'binary'>('ab');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();

  // Bacon's cipher mapping (distinct cipher - 26 unique codes)
  const baconMap: Record<string, string> = {
    A: 'AAAAA', B: 'AAAAB', C: 'AAABA', D: 'AAABB', E: 'AABAA',
    F: 'AABAB', G: 'AABBA', H: 'AABBB', I: 'ABAAA', J: 'ABAAB',
    K: 'ABABA', L: 'ABABB', M: 'ABBAA', N: 'ABBAB', O: 'ABBBA',
    P: 'ABBBB', Q: 'BAAAA', R: 'BAAAB', S: 'BAABA', T: 'BAABB',
    U: 'BABAA', V: 'BABAB', W: 'BABBA', X: 'BABBB', Y: 'BAAAA',
    Z: 'BAAAB',
  };

  // Fix Y and Z with unique codes
  baconMap['Y'] = 'BABBA';
  baconMap['Z'] = 'BABBB';
  baconMap['W'] = 'BABAA';
  baconMap['X'] = 'BABAB';
  baconMap['Y'] = 'BABBA';
  baconMap['Z'] = 'BABBB';

  // Use 26-letter version with unique codes
  const cipher: Record<string, string> = {};
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < 26; i++) {
    cipher[alphabet[i]] = i.toString(2).padStart(5, '0').replace(/0/g, 'A').replace(/1/g, 'B');
  }

  const reverseCipher: Record<string, string> = {};
  for (const [key, value] of Object.entries(cipher)) {
    reverseCipher[value] = key;
  }

  const encrypt = (text: string): string => {
    const upper = text.toUpperCase();
    let result = '';
    for (const char of upper) {
      if (cipher[char]) {
        const code = cipher[char];
        if (encoding === 'binary') {
          result += code.replace(/A/g, '0').replace(/B/g, '1') + ' ';
        } else {
          result += code + ' ';
        }
      }
    }
    return result.trim();
  };

  const decrypt = (text: string): string => {
    let cleaned = text.toUpperCase().replace(/[^AB01\s]/g, '');
    if (encoding === 'binary') {
      cleaned = cleaned.replace(/0/g, 'A').replace(/1/g, 'B');
    }
    const groups = cleaned.replace(/\s+/g, '').match(/.{1,5}/g);
    if (!groups) return '';

    let result = '';
    for (const group of groups) {
      if (group.length === 5 && reverseCipher[group]) {
        result += reverseCipher[group];
      }
    }
    return result;
  };

  const process = () => {
    if (!input.trim()) {
      setError('Please enter text to process');
      setOutput('');
      return;
    }
    setError(undefined);

    if (mode === 'encrypt') {
      const text = input.trim();
      if (!/[a-zA-Z]/.test(text)) {
        setError('Text must contain at least one letter');
        setOutput('');
        return;
      }
      setOutput(encrypt(text));
    } else {
      const result = decrypt(input.trim());
      if (!result) {
        setError('Could not decode input. Ensure it contains valid 5-character groups of A/B or 0/1.');
        setOutput('');
        return;
      }
      setOutput(result);
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          {mode === 'encrypt' ? 'Plaintext' : 'Bacon Cipher Text'}
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encrypt' ? 'Enter text to encrypt...' : 'Enter Bacon cipher (e.g., AAAAA AAAAB AAABA)...'}
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
          <select value={mode} onChange={(e) => setMode(e.target.value as 'encrypt' | 'decrypt')} aria-label="Mode" className="input-field">
            <option value="encrypt">Encrypt</option>
            <option value="decrypt">Decrypt</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Encoding</label>
          <select value={encoding} onChange={(e) => setEncoding(e.target.value as 'ab' | 'binary')} aria-label="Encoding format" className="input-field">
            <option value="ab">A/B Format</option>
            <option value="binary">Binary (0/1)</option>
          </select>
        </div>
      </div>

      <button onClick={process} aria-label={`${mode === 'encrypt' ? 'Encrypt' : 'Decrypt'} text`} className="btn-primary">
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
