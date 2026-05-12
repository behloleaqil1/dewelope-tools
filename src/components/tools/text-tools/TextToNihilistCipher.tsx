'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToNihilistCipher - Encrypt and decrypt text using the Nihilist cipher.
 * Uses a Polybius square with a keyword to produce numeric ciphertext.
 */
export default function TextToNihilistCipher({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function buildPolybius(key: string): Map<string, number> {
    const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // J merged with I
    const seen = new Set<string>();
    let ordered = '';
    const cleanKey = key.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
    for (const ch of cleanKey + alphabet) {
      if (!seen.has(ch)) {
        seen.add(ch);
        ordered += ch;
      }
    }
    const map = new Map<string, number>();
    for (let i = 0; i < 25; i++) {
      const row = Math.floor(i / 5) + 1;
      const col = (i % 5) + 1;
      map.set(ordered[i], row * 10 + col);
    }
    return map;
  }

  function handleProcess() {
    setError('');
    setOutput('');
    if (!keyword.trim()) {
      setError('Please enter a keyword.');
      return;
    }
    if (!input.trim()) {
      setError('Please enter text to process.');
      return;
    }

    const polybiusMap = buildPolybius(keyword);
    const reverseMap = new Map<number, string>();
    polybiusMap.forEach((v, k) => reverseMap.set(v, k));

    const keyClean = keyword.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
    if (keyClean.length === 0) {
      setError('Keyword must contain at least one letter.');
      return;
    }
    const keyNums = [...keyClean].map(ch => polybiusMap.get(ch) || 0);

    if (mode === 'encrypt') {
      const plainClean = input.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
      if (plainClean.length === 0) {
        setError('Input must contain at least one letter.');
        return;
      }
      const result: number[] = [];
      for (let i = 0; i < plainClean.length; i++) {
        const pVal = polybiusMap.get(plainClean[i]) || 0;
        const kVal = keyNums[i % keyNums.length];
        result.push(pVal + kVal);
      }
      setOutput(result.join(' '));
    } else {
      const nums = input.trim().split(/[\s,]+/).map(Number);
      if (nums.some(isNaN)) {
        setError('Decrypt input must be space-separated numbers.');
        return;
      }
      let result = '';
      for (let i = 0; i < nums.length; i++) {
        const kVal = keyNums[i % keyNums.length];
        const pVal = nums[i] - kVal;
        const ch = reverseMap.get(pVal);
        if (!ch) {
          setError(`Invalid ciphertext number: ${nums[i]}`);
          return;
        }
        result += ch;
      }
      setOutput(result);
    }
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="flex gap-4 mb-3">
          <label className="flex items-center gap-1">
            <input type="radio" checked={mode === 'encrypt'} onChange={() => setMode('encrypt')} aria-label="Encrypt mode" />
            <span className="text-sm">Encrypt</span>
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" checked={mode === 'decrypt'} onChange={() => setMode('decrypt')} aria-label="Decrypt mode" />
            <span className="text-sm">Decrypt</span>
          </label>
        </div>
        <label htmlFor={`${toolId}-keyword`} className="block text-sm font-medium text-gray-700 mb-1">
          Keyword
        </label>
        <input
          id={`${toolId}-keyword`}
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter keyword..."
          aria-label="Cipher keyword"
          className="input-field mb-3"
        />
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          {mode === 'encrypt' ? 'Plaintext' : 'Ciphertext (space-separated numbers)'}
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encrypt' ? 'Enter text to encrypt...' : 'Enter numbers to decrypt...'}
          aria-label={`${mode === 'encrypt' ? 'Plaintext' : 'Ciphertext'} input for ${toolName}`}
          className="input-field h-36 resize-y font-mono"
        />
        <button onClick={handleProcess} className="btn-primary mt-2">{mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}</button>
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
