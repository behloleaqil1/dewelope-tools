'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * VigenereCipher - Encrypt and decrypt text using the Vigenère cipher with a keyword.
 */
export default function VigenereCipher({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('');
  const [keyword, setKeyword] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | undefined>();

  function process() {
    setError(undefined);
    setResult('');

    if (!text.trim()) {
      setError('Please enter text to process');
      return;
    }

    const key = keyword.replace(/[^a-zA-Z]/g, '').toUpperCase();
    if (!key) {
      setError('Please enter a keyword (letters only)');
      return;
    }

    let keyIndex = 0;
    const output = text
      .split('')
      .map((char) => {
        if (!/[a-zA-Z]/.test(char)) return char;

        const isUpper = char === char.toUpperCase();
        const base = isUpper ? 65 : 97;
        const charCode = char.charCodeAt(0) - base;
        const shift = key.charCodeAt(keyIndex % key.length) - 65;
        keyIndex++;

        let newCode: number;
        if (mode === 'encrypt') {
          newCode = (charCode + shift) % 26;
        } else {
          newCode = (charCode - shift + 26) % 26;
        }

        return String.fromCharCode(newCode + base);
      })
      .join('');

    setResult(output);
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">
          Text to {mode}
        </label>
        <textarea
          id={`${toolId}-text`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Enter text to ${mode}...`}
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label htmlFor={`${toolId}-keyword`} className="block text-xs text-gray-500 mb-1">Keyword</label>
            <input
              id={`${toolId}-keyword`}
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. SECRET"
              aria-label="Cipher keyword"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-mode`} className="block text-xs text-gray-500 mb-1">Mode</label>
            <select
              id={`${toolId}-mode`}
              value={mode}
              onChange={(e) => setMode(e.target.value as 'encrypt' | 'decrypt')}
              aria-label="Cipher mode"
              className="input-field text-sm"
            >
              <option value="encrypt">Encrypt</option>
              <option value="decrypt">Decrypt</option>
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={process} aria-label={`${mode} text`} className="btn-primary">
        {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
      </button>

      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg border border-gray-200">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
