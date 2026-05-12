'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToGridCipher - Encrypt text using a grid/matrix cipher (Polybius square variant).
 * Maps letters to row/column coordinates in a 5x5 grid.
 */
export default function TextToGridCipher({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [output, setOutput] = useState('');

  const buildGrid = (key: string): string[][] => {
    const seen = new Set<string>();
    const letters: string[] = [];
    const combined = (key.toUpperCase() + 'ABCDEFGHIKLMNOPQRSTUVWXYZ').replace(/J/g, 'I');
    for (const ch of combined) {
      if (/[A-Z]/.test(ch) && !seen.has(ch)) {
        seen.add(ch);
        letters.push(ch);
      }
    }
    const grid: string[][] = [];
    for (let i = 0; i < 5; i++) {
      grid.push(letters.slice(i * 5, i * 5 + 5));
    }
    return grid;
  };

  const encrypt = (text: string, grid: string[][]): string => {
    const cleaned = text.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
    let result = '';
    for (const ch of cleaned) {
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
          if (grid[r][c] === ch) {
            result += `${r + 1}${c + 1} `;
          }
        }
      }
    }
    return result.trim();
  };

  const decrypt = (text: string, grid: string[][]): string => {
    const pairs = text.replace(/[^0-9]/g, '').match(/.{2}/g) || [];
    let result = '';
    for (const pair of pairs) {
      const r = parseInt(pair[0]) - 1;
      const c = parseInt(pair[1]) - 1;
      if (r >= 0 && r < 5 && c >= 0 && c < 5) {
        result += grid[r][c];
      }
    }
    return result;
  };

  const process = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    const grid = buildGrid(keyword);
    if (mode === 'encrypt') {
      setOutput(encrypt(input, grid));
    } else {
      setOutput(decrypt(input, grid));
    }
  };

  const grid = buildGrid(keyword);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
            <select id={`${toolId}-mode`} value={mode} onChange={(e) => setMode(e.target.value as 'encrypt' | 'decrypt')} className="input-field" aria-label={`Mode for ${toolName}`}>
              <option value="encrypt">Encrypt</option>
              <option value="decrypt">Decrypt</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-keyword`} className="block text-sm font-medium text-gray-700 mb-1">Keyword (optional)</label>
            <input id={`${toolId}-keyword`} type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="input-field" placeholder="Leave empty for standard grid" aria-label="Cipher keyword" />
          </div>
        </div>
        <div>
          <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
            {mode === 'encrypt' ? 'Text to Encrypt' : 'Numbers to Decrypt'}
          </label>
          <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'encrypt' ? 'Enter text to encrypt...' : 'Enter number pairs (e.g., 23 15 31 31 34)...'} className="input-field h-32 resize-y font-mono" aria-label="Input text" />
        </div>
        <button onClick={process} className="btn-primary mt-4">{mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}</button>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Grid (5×5 Polybius Square)</label>
          <div className="grid grid-cols-6 gap-1 text-center text-xs font-mono bg-gray-50 p-2 rounded">
            <div></div>
            {[1, 2, 3, 4, 5].map(c => <div key={c} className="font-bold">{c}</div>)}
            {grid.map((row, r) => (
              <>{<div key={`r${r}`} className="font-bold">{r + 1}</div>}{row.map((ch, c) => <div key={`${r}${c}`} className="bg-white border rounded p-1">{ch}</div>)}</>
            ))}
          </div>
        </div>
      </InputArea>

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
