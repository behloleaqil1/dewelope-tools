'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToOneTimePad - Encrypt text using a one-time pad (XOR with a random key).
 * Generates a random key and produces hex-encoded ciphertext.
 */
export default function TextToOneTimePad({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [decrypted, setDecrypted] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');

  function generateKey(length: number): string {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  function xorEncrypt(text: string, hexKey: string): string {
    const keyBytes = hexKey.match(/.{1,2}/g)?.map((h) => parseInt(h, 16)) || [];
    const result: string[] = [];
    for (let i = 0; i < text.length; i++) {
      const xored = text.charCodeAt(i) ^ (keyBytes[i] || 0);
      result.push(xored.toString(16).padStart(2, '0'));
    }
    return result.join('');
  }

  function xorDecrypt(hexCipher: string, hexKey: string): string {
    const cipherBytes = hexCipher.match(/.{1,2}/g)?.map((h) => parseInt(h, 16)) || [];
    const keyBytes = hexKey.match(/.{1,2}/g)?.map((h) => parseInt(h, 16)) || [];
    let result = '';
    for (let i = 0; i < cipherBytes.length; i++) {
      result += String.fromCharCode(cipherBytes[i] ^ (keyBytes[i] || 0));
    }
    return result;
  }

  function handleEncrypt() {
    if (!input.trim()) return;
    const newKey = generateKey(input.length);
    setKey(newKey);
    setCiphertext(xorEncrypt(input, newKey));
    setDecrypted('');
  }

  function handleDecrypt() {
    if (!ciphertext.trim() || !key.trim()) return;
    setDecrypted(xorDecrypt(ciphertext, key));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setMode('encrypt')}
            className={`px-3 py-1 rounded text-sm ${mode === 'encrypt' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Encrypt
          </button>
          <button
            onClick={() => setMode('decrypt')}
            className={`px-3 py-1 rounded text-sm ${mode === 'decrypt' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Decrypt
          </button>
        </div>

        {mode === 'encrypt' ? (
          <>
            <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
              Plaintext
            </label>
            <textarea
              id={`${toolId}-input`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to encrypt..."
              aria-label={`Text input for ${toolName}`}
              className="input-field h-32 resize-y font-mono"
            />
            <button onClick={handleEncrypt} className="btn-primary mt-2">
              Encrypt with Random Key
            </button>
          </>
        ) : (
          <>
            <label htmlFor={`${toolId}-cipher`} className="block text-sm font-medium text-gray-700 mb-1">
              Ciphertext (hex)
            </label>
            <textarea
              id={`${toolId}-cipher`}
              value={ciphertext}
              onChange={(e) => setCiphertext(e.target.value)}
              placeholder="Enter hex ciphertext..."
              aria-label="Ciphertext input"
              className="input-field h-24 resize-y font-mono"
            />
            <label htmlFor={`${toolId}-key`} className="block text-sm font-medium text-gray-700 mb-1 mt-2">
              Key (hex)
            </label>
            <textarea
              id={`${toolId}-key`}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter hex key..."
              aria-label="Key input"
              className="input-field h-24 resize-y font-mono"
            />
            <button onClick={handleDecrypt} className="btn-primary mt-2">
              Decrypt
            </button>
          </>
        )}
      </InputArea>

      <OutputArea hasContent={!!(ciphertext || decrypted)}>
        {mode === 'encrypt' && ciphertext && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Ciphertext (hex)</label>
              <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all mt-1">{ciphertext}</pre>
              <CopyToClipboard text={ciphertext} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Key (hex) — save this to decrypt</label>
              <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all mt-1">{key}</pre>
              <CopyToClipboard text={key} />
            </div>
          </div>
        )}
        {mode === 'decrypt' && decrypted && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Decrypted Text</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{decrypted}</pre>
            <CopyToClipboard text={decrypted} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
