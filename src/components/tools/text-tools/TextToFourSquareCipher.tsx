'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToFourSquareCipher - Encrypt/decrypt text using the Four-Square cipher.
 * Uses two keyword-based 5x5 matrices (I/J combined) for digraph substitution.
 */
export default function TextToFourSquareCipher({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [keyword1, setKeyword1] = useState('');
  const [keyword2, setKeyword2] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const ALPHABET = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // no J

  const generateMatrix = (keyword: string): string[] => {
    const key = keyword.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
    const seen = new Set<string>();
    const matrix: string[] = [];

    for (const ch of key) {
      if (!seen.has(ch)) {
        seen.add(ch);
        matrix.push(ch);
      }
    }
    for (const ch of ALPHABET) {
      if (!seen.has(ch)) {
        seen.add(ch);
        matrix.push(ch);
      }
    }
    return matrix;
  };

  const plainMatrix = ALPHABET.split('');

  const getPos = (matrix: string[], ch: string): [number, number] => {
    const idx = matrix.indexOf(ch);
    return [Math.floor(idx / 5), idx % 5];
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

    const padded = text.length % 2 !== 0 ? text + 'X' : text;
    const matrix1 = generateMatrix(keyword1);
    const matrix2 = generateMatrix(keyword2);

    let result = '';

    for (let i = 0; i < padded.length; i += 2) {
      const a = padded[i];
      const b = padded[i + 1];

      if (mode === 'encrypt') {
        const [r1, c1] = getPos(plainMatrix, a);
        const [r2, c2] = getPos(plainMatrix, b);
        result += matrix1[r1 * 5 + c2];
        result += matrix2[r2 * 5 + c1];
      } else {
        const [r1, c1] = getPos(matrix1, a);
        const [r2, c2] = getPos(matrix2, b);
        result += plainMatrix[r1 * 5 + c2];
        result += plainMatrix[r2 * 5 + c1];
      }
    }

    setOutput(result);
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
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label htmlFor={`${toolId}-key1`} className="block text-sm font-medium text-gray-700 mb-1">Keyword 1</label>
            <input
              id={`${toolId}-key1`}
              type="text"
              value={keyword1}
              onChange={(e) => setKeyword1(e.target.value)}
              placeholder="e.g. EXAMPLE"
              className="input-field"
              aria-label={`First keyword for ${toolName}`}
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-key2`} className="block text-sm font-medium text-gray-700 mb-1">Keyword 2</label>
            <input
              id={`${toolId}-key2`}
              type="text"
              value={keyword2}
              onChange={(e) => setKeyword2(e.target.value)}
              placeholder="e.g. KEYWORD"
              className="input-field"
              aria-label={`Second keyword for ${toolName}`}
            />
          </div>
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
