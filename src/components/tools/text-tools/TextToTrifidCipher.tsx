'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToTrifidCipher - Encrypt/decrypt text using the Trifid cipher.
 * Uses a 3x3x3 cube with a 27-character alphabet (A-Z + period).
 */
export default function TextToTrifidCipher({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [period, setPeriod] = useState('5');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ.';

  const generateAlphabet = (key: string): string => {
    const seen = new Set<string>();
    let result = '';
    const combined = (key.toUpperCase().replace(/[^A-Z.]/g, '') + ALPHABET);
    for (const ch of combined) {
      if (!seen.has(ch)) {
        seen.add(ch);
        result += ch;
      }
    }
    return result;
  };

  const getCoords = (ch: string, alpha: string): [number, number, number] => {
    const idx = alpha.indexOf(ch);
    const layer = Math.floor(idx / 9);
    const row = Math.floor((idx % 9) / 3);
    const col = idx % 3;
    return [layer, row, col];
  };

  const fromCoords = (l: number, r: number, c: number, alpha: string): string => {
    return alpha[l * 9 + r * 3 + c];
  };

  const encrypt = (text: string, alpha: string, groupSize: number): string => {
    const clean = text.toUpperCase().replace(/[^A-Z.]/g, '');
    if (!clean) return '';

    let result = '';
    for (let i = 0; i < clean.length; i += groupSize) {
      const group = clean.slice(i, i + groupSize);
      const layers: number[] = [];
      const rows: number[] = [];
      const cols: number[] = [];

      for (const ch of group) {
        const [l, r, c] = getCoords(ch, alpha);
        layers.push(l);
        rows.push(r);
        cols.push(c);
      }

      const combined = [...layers, ...rows, ...cols];
      for (let j = 0; j < group.length; j++) {
        const l = combined[j * 3] ?? 0;
        const r = combined[j * 3 + 1] ?? 0;
        const c = combined[j * 3 + 2] ?? 0;
        result += fromCoords(l, r, c, alpha);
      }
    }
    return result;
  };

  const decrypt = (text: string, alpha: string, groupSize: number): string => {
    const clean = text.toUpperCase().replace(/[^A-Z.]/g, '');
    if (!clean) return '';

    let result = '';
    for (let i = 0; i < clean.length; i += groupSize) {
      const group = clean.slice(i, i + groupSize);
      const combined: number[] = [];

      for (const ch of group) {
        const [l, r, c] = getCoords(ch, alpha);
        combined.push(l, r, c);
      }

      const len = group.length;
      const layers = combined.slice(0, len);
      const rows = combined.slice(len, len * 2);
      const cols = combined.slice(len * 2, len * 3);

      for (let j = 0; j < len; j++) {
        result += fromCoords(layers[j] ?? 0, rows[j] ?? 0, cols[j] ?? 0, alpha);
      }
    }
    return result;
  };

  const process = () => {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter text to process');
      return;
    }

    const groupSize = Math.max(2, parseInt(period) || 5);
    const alpha = generateAlphabet(keyword);

    if (mode === 'encrypt') {
      setOutput(encrypt(input, alpha, groupSize));
    } else {
      setOutput(decrypt(input, alpha, groupSize));
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="flex gap-4 mb-3">
          <label className="inline-flex items-center text-sm">
            <input type="radio" checked={mode === 'encrypt'} onChange={() => setMode('encrypt')} className="mr-1" />
            Encrypt
          </label>
          <label className="inline-flex items-center text-sm">
            <input type="radio" checked={mode === 'decrypt'} onChange={() => setMode('decrypt')} className="mr-1" />
            Decrypt
          </label>
        </div>
        <label htmlFor={`${toolId}-keyword`} className="block text-sm font-medium text-gray-700 mb-1">
          Keyword (optional)
        </label>
        <input
          id={`${toolId}-keyword`}
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="e.g. SECRET"
          aria-label={`Keyword for ${toolName}`}
          className="input-field mb-3"
        />
        <label htmlFor={`${toolId}-period`} className="block text-sm font-medium text-gray-700 mb-1">
          Period (group size)
        </label>
        <input
          id={`${toolId}-period`}
          type="text"
          inputMode="numeric"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          placeholder="5"
          aria-label={`Period for ${toolName}`}
          className="input-field mb-3"
        />
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          {mode === 'encrypt' ? 'Plaintext' : 'Ciphertext'}
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encrypt' ? 'Enter text to encrypt...' : 'Enter ciphertext to decrypt...'}
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <button onClick={process} aria-label={mode === 'encrypt' ? 'Encrypt text' : 'Decrypt text'} className="btn-primary">
        {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {mode === 'encrypt' ? 'Ciphertext' : 'Plaintext'}
            </label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
