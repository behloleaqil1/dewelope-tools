'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToAdfgvxCipher - Encrypt/decrypt text using the ADFGVX cipher.
 * A WWI-era cipher combining a Polybius square with columnar transposition.
 */
export default function TextToAdfgvxCipher({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [transKey, setTransKey] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const LABELS = ['A', 'D', 'F', 'G', 'V', 'X'];
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  const generateSquare = (key: string): string => {
    const seen = new Set<string>();
    let result = '';
    const combined = key.toUpperCase().replace(/[^A-Z0-9]/g, '') + ALPHABET;
    for (const ch of combined) {
      if (!seen.has(ch)) {
        seen.add(ch);
        result += ch;
      }
    }
    return result;
  };

  const encryptAdfgvx = (text: string, square: string, transposition: string): string => {
    const clean = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!clean || !transposition) return '';

    // Step 1: Polybius substitution
    let fractionated = '';
    for (const ch of clean) {
      const idx = square.indexOf(ch);
      if (idx === -1) continue;
      const row = Math.floor(idx / 6);
      const col = idx % 6;
      fractionated += LABELS[row] + LABELS[col];
    }

    // Step 2: Columnar transposition
    const cols = transposition.length;
    const rows = Math.ceil(fractionated.length / cols);
    const grid: string[][] = [];
    let pos = 0;
    for (let r = 0; r < rows; r++) {
      grid[r] = [];
      for (let c = 0; c < cols; c++) {
        grid[r][c] = pos < fractionated.length ? fractionated[pos] : '';
        pos++;
      }
    }

    // Read columns in alphabetical order of key
    const order = transposition.split('').map((ch, i) => ({ ch, i })).sort((a, b) => a.ch.localeCompare(b.ch));
    let result = '';
    for (const { i } of order) {
      for (let r = 0; r < rows; r++) {
        if (grid[r][i]) result += grid[r][i];
      }
    }
    return result;
  };

  const decryptAdfgvx = (text: string, square: string, transposition: string): string => {
    const clean = text.toUpperCase().replace(/[^ADFGVX]/g, '');
    if (!clean || !transposition) return '';

    // Step 1: Reverse columnar transposition
    const cols = transposition.length;
    const totalLen = clean.length;
    const rows = Math.ceil(totalLen / cols);
    const remainder = totalLen % cols;

    const order = transposition.split('').map((ch, i) => ({ ch, i })).sort((a, b) => a.ch.localeCompare(b.ch));
    const colLengths: number[] = new Array(cols).fill(rows);
    if (remainder > 0) {
      for (let i = remainder; i < cols; i++) {
        const origIdx = order[i]?.i ?? 0;
        colLengths[origIdx] = rows - 1;
      }
    }

    // Fill columns
    const columns: string[][] = new Array(cols).fill(null).map(() => []);
    let pos = 0;
    for (const { i } of order) {
      const len = colLengths[i];
      for (let r = 0; r < len; r++) {
        if (pos < clean.length) columns[i].push(clean[pos++]);
      }
    }

    // Read row by row
    let fractionated = '';
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (r < columns[c].length) fractionated += columns[c][r];
      }
    }

    // Step 2: Reverse Polybius substitution
    let result = '';
    for (let i = 0; i < fractionated.length - 1; i += 2) {
      const rowIdx = LABELS.indexOf(fractionated[i]);
      const colIdx = LABELS.indexOf(fractionated[i + 1]);
      if (rowIdx >= 0 && colIdx >= 0) {
        result += square[rowIdx * 6 + colIdx];
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
    if (!transKey.trim()) {
      setError('Please enter a transposition key');
      return;
    }

    const square = generateSquare(keyword);

    if (mode === 'encrypt') {
      const result = encryptAdfgvx(input, square, transKey.toUpperCase().replace(/[^A-Z]/g, ''));
      setOutput(result || 'Could not encrypt');
    } else {
      const result = decryptAdfgvx(input, square, transKey.toUpperCase().replace(/[^A-Z]/g, ''));
      setOutput(result || 'Could not decrypt');
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
          Square Keyword (optional, for Polybius square)
        </label>
        <input
          id={`${toolId}-keyword`}
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="e.g. PRIVACY"
          aria-label={`Square keyword for ${toolName}`}
          className="input-field mb-3"
        />
        <label htmlFor={`${toolId}-transkey`} className="block text-sm font-medium text-gray-700 mb-1">
          Transposition Key (required, letters only)
        </label>
        <input
          id={`${toolId}-transkey`}
          type="text"
          value={transKey}
          onChange={(e) => setTransKey(e.target.value)}
          placeholder="e.g. GERMAN"
          aria-label={`Transposition key for ${toolName}`}
          className="input-field mb-3"
        />
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          {mode === 'encrypt' ? 'Plaintext' : 'Ciphertext'}
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encrypt' ? 'Enter text to encrypt...' : 'Enter ADFGVX ciphertext...'}
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
