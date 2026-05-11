'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * Base32EncoderDecoder - Encode and decode Base32 strings.
 * Uses RFC 4648 standard Base32 alphabet (A-Z, 2-7, padding with =).
 */
export default function Base32EncoderDecoder({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');

  const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

  const encode = (str: string): string => {
    const bytes = new TextEncoder().encode(str);
    let bits = '';
    for (const byte of bytes) {
      bits += byte.toString(2).padStart(8, '0');
    }
    // Pad bits to multiple of 5
    while (bits.length % 5 !== 0) {
      bits += '0';
    }
    let result = '';
    for (let i = 0; i < bits.length; i += 5) {
      const index = parseInt(bits.slice(i, i + 5), 2);
      result += BASE32_ALPHABET[index];
    }
    // Add padding
    const padLength = [0, 6, 4, 3, 1][bytes.length % 5];
    result += '='.repeat(padLength);
    return result;
  };

  const decode = (str: string): string => {
    const cleaned = str.replace(/=+$/, '').toUpperCase();
    let bits = '';
    for (const char of cleaned) {
      const index = BASE32_ALPHABET.indexOf(char);
      if (index === -1) {
        throw new Error(`Invalid Base32 character: "${char}"`);
      }
      bits += index.toString(2).padStart(5, '0');
    }
    const bytes: number[] = [];
    for (let i = 0; i + 8 <= bits.length; i += 8) {
      bytes.push(parseInt(bits.slice(i, i + 8), 2));
    }
    return new TextDecoder().decode(new Uint8Array(bytes));
  };

  const handleConvert = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      setError('');
      if (mode === 'encode') {
        setOutput(encode(input));
      } else {
        setOutput(decode(input));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid input');
      setOutput('');
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => { setMode('encode'); setOutput(''); setError(''); }}
          className={`px-4 py-2 rounded text-sm font-medium ${mode === 'encode' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          aria-label="Switch to encode mode"
        >
          Encode
        </button>
        <button
          onClick={() => { setMode('decode'); setOutput(''); setError(''); }}
          className={`px-4 py-2 rounded text-sm font-medium ${mode === 'decode' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          aria-label="Switch to decode mode"
        >
          Decode
        </button>
      </div>

      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          {mode === 'encode' ? 'Text to encode' : 'Base32 string to decode'}
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Enter text to encode to Base32...' : 'Enter Base32 string to decode...'}
          aria-label={`Input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <button onClick={handleConvert} className="btn-primary" aria-label={`${mode === 'encode' ? 'Encode' : 'Decode'} Base32`}>
        {mode === 'encode' ? 'Encode to Base32' : 'Decode from Base32'}
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
