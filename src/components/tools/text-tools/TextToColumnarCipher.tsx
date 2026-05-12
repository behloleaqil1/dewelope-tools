'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToColumnarCipher - Encrypt/decrypt text using Columnar Transposition cipher.
 * Arranges text in columns based on a keyword and reads off columns in alphabetical key order.
 */
export default function TextToColumnarCipher({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [output, setOutput] = useState('');

  const getKeyOrder = (key: string): number[] => {
    const chars = key.toUpperCase().split('');
    const sorted = [...chars].sort();
    const order: number[] = [];
    const used = new Array(chars.length).fill(false);

    for (const ch of chars) {
      for (let i = 0; i < sorted.length; i++) {
        if (sorted[i] === ch && !used[i]) {
          order.push(i);
          used[i] = true;
          break;
        }
      }
    }
    return order;
  };

  const encrypt = (text: string, key: string): string => {
    const order = getKeyOrder(key);
    const numCols = key.length;
    const numRows = Math.ceil(text.length / numCols);

    // Fill grid row by row
    const grid: string[][] = [];
    let idx = 0;
    for (let r = 0; r < numRows; r++) {
      const row: string[] = [];
      for (let c = 0; c < numCols; c++) {
        row.push(idx < text.length ? text[idx] : 'X');
        idx++;
      }
      grid.push(row);
    }

    // Read columns in key order
    const result: string[] = [];
    for (let col = 0; col < numCols; col++) {
      const colIdx = order.indexOf(col);
      for (let r = 0; r < numRows; r++) {
        result.push(grid[r][colIdx]);
      }
    }

    return result.join('');
  };

  const decrypt = (text: string, key: string): string => {
    const order = getKeyOrder(key);
    const numCols = key.length;
    const numRows = Math.ceil(text.length / numCols);

    // Fill columns in key order
    const grid: string[][] = Array.from({ length: numRows }, () => new Array(numCols).fill(''));
    let idx = 0;
    for (let col = 0; col < numCols; col++) {
      const colIdx = order.indexOf(col);
      for (let r = 0; r < numRows; r++) {
        if (idx < text.length) {
          grid[r][colIdx] = text[idx];
          idx++;
        }
      }
    }

    // Read row by row
    return grid.flat().join('').replace(/X+$/, '');
  };

  const process = () => {
    if (!input.trim()) {
      setOutput('Please enter text to process.');
      return;
    }
    if (!keyword.trim() || keyword.trim().length < 2) {
      setOutput('Please enter a keyword with at least 2 characters.');
      return;
    }

    const cleanKey = keyword.trim().replace(/[^a-zA-Z]/g, '');
    if (cleanKey.length < 2) {
      setOutput('Keyword must contain at least 2 letters.');
      return;
    }

    if (mode === 'encrypt') {
      setOutput(encrypt(input, cleanKey));
    } else {
      setOutput(decrypt(input, cleanKey));
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Input Text
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to encrypt or decrypt..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <div className="flex flex-wrap gap-4 items-end">
        <InputArea>
          <label htmlFor={`${toolId}-keyword`} className="block text-sm font-medium text-gray-700 mb-1">
            Keyword
          </label>
          <input
            id={`${toolId}-keyword`}
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g. SECRET"
            aria-label={`Keyword for ${toolName}`}
            className="input-field w-48"
          />
        </InputArea>

        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={mode === 'encrypt'} onChange={() => setMode('encrypt')} className="text-blue-600" />
              <span className="text-sm">Encrypt</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={mode === 'decrypt'} onChange={() => setMode('decrypt')} className="text-blue-600" />
              <span className="text-sm">Decrypt</span>
            </label>
          </div>
        </InputArea>
      </div>

      <button onClick={process} aria-label={`${mode === 'encrypt' ? 'Encrypt' : 'Decrypt'} with Columnar Transposition cipher`} className="btn-primary">
        {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {mode === 'encrypt' ? 'Encrypted' : 'Decrypted'} Text
            </label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
