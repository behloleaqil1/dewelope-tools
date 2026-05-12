'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToBifidCipher - Encrypt/decrypt text using the Bifid cipher.
 * Uses a Polybius square with a keyword to fractionate and recombine coordinates.
 */
export default function TextToBifidCipher({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const ALPHABET = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // no J

  const generateSquare = (key: string): string[] => {
    const k = key.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
    const seen = new Set<string>();
    const square: string[] = [];

    for (const ch of k) {
      if (!seen.has(ch)) {
        seen.add(ch);
        square.push(ch);
      }
    }
    for (const ch of ALPHABET) {
      if (!seen.has(ch)) {
        seen.add(ch);
        square.push(ch);
      }
    }
    return square;
  };

  const getCoords = (square: string[], ch: string): [number, number] => {
    const idx = square.indexOf(ch);
    return [Math.floor(idx / 5), idx % 5];
  };

  const getChar = (square: string[], row: number, col: number): string => {
    return square[row * 5 + col];
  };

  const process = () => {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter text');
      return;
    }

    const text = input.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
    if (text.length === 0) {
      setError('Input must contain letters');
      return;
    }

    const square = generateSquare(keyword);

    if (mode === 'encrypt') {
      const rows: number[] = [];
      const cols: number[] = [];

      for (const ch of text) {
        const [r, c] = getCoords(square, ch);
        rows.push(r);
        cols.push(c);
      }

      const combined = [...rows, ...cols];
      let result = '';
      for (let i = 0; i < combined.length; i += 2) {
        result += getChar(square, combined[i], combined[i + 1]);
      }
      setOutput(result);
    } else {
      const coords: number[] = [];
      for (const ch of text) {
        const [r, c] = getCoords(square, ch);
        coords.push(r);
        coords.push(c);
      }

      const half = coords.length / 2;
      const rows = coords.slice(0, half);
      const cols = coords.slice(half);

      let result = '';
      for (let i = 0; i < rows.length; i++) {
        result += getChar(square, rows[i], cols[i]);
      }
      setOutput(result);
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="flex gap-4 mb-2">
          <label className="inline-flex items-center text-sm">
            <input type="radio" checked={mode === 'encrypt'} onChange={() => setMode('encrypt')} className="mr-1" />
            Encrypt
          </label>
          <label className="inline-flex items-center text-sm">
            <input type="radio" checked={mode === 'decrypt'} onChange={() => setMode('decrypt')} className="mr-1" />
            Decrypt
          </label>
        </div>
        <div className="mb-2">
          <label htmlFor={`${toolId}-key`} className="block text-sm font-medium text-gray-700 mb-1">Keyword</label>
          <input
            id={`${toolId}-key`}
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g. SECRET"
            className="input-field"
            aria-label={`Keyword for ${toolName}`}
          />
        </div>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Text</label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to encrypt or decrypt..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
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
