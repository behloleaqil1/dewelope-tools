'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToPlayfairCipher - Encrypt text using the Playfair cipher with a keyword.
 * Implements the classic 5x5 grid cipher that encrypts digraphs (pairs of letters).
 */
export default function TextToPlayfairCipher({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [output, setOutput] = useState('');
  const [grid, setGrid] = useState<string[][]>([]);

  const buildGrid = (key: string): string[][] => {
    const seen = new Set<string>();
    const letters: string[] = [];
    const cleaned = (key + 'abcdefghiklmnopqrstuvwxyz').toLowerCase().replace(/j/g, 'i');

    for (const ch of cleaned) {
      if (ch >= 'a' && ch <= 'z' && !seen.has(ch)) {
        seen.add(ch);
        letters.push(ch);
      }
    }

    const matrix: string[][] = [];
    for (let i = 0; i < 5; i++) {
      matrix.push(letters.slice(i * 5, i * 5 + 5));
    }
    return matrix;
  };

  const findPosition = (matrix: string[][], ch: string): [number, number] => {
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (matrix[r][c] === ch) return [r, c];
      }
    }
    return [0, 0];
  };

  const processText = () => {
    const matrix = buildGrid(keyword);
    setGrid(matrix);

    const text = input.toLowerCase().replace(/j/g, 'i').replace(/[^a-z]/g, '');
    if (!text) { setOutput(''); return; }

    // Create digraphs
    const digraphs: string[] = [];
    let i = 0;
    while (i < text.length) {
      const a = text[i];
      const b = i + 1 < text.length ? text[i + 1] : 'x';
      if (a === b) {
        digraphs.push(a + 'x');
        i++;
      } else {
        digraphs.push(a + b);
        i += 2;
      }
    }

    const result = digraphs.map(pair => {
      const [r1, c1] = findPosition(matrix, pair[0]);
      const [r2, c2] = findPosition(matrix, pair[1]);

      if (r1 === r2) {
        const shift = mode === 'encrypt' ? 1 : 4;
        return matrix[r1][(c1 + shift) % 5] + matrix[r2][(c2 + shift) % 5];
      } else if (c1 === c2) {
        const shift = mode === 'encrypt' ? 1 : 4;
        return matrix[(r1 + shift) % 5][c1] + matrix[(r2 + shift) % 5][c2];
      } else {
        return matrix[r1][c2] + matrix[r2][c1];
      }
    });

    setOutput(result.join(' ').toUpperCase());
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-keyword`} className="block text-sm font-medium text-gray-700 mb-1">
          Keyword
        </label>
        <input
          id={`${toolId}-keyword`}
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="e.g. MONARCHY"
          aria-label={`Keyword for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Text to {mode}
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Enter text to ${mode}...`}
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input type="radio" name={`${toolId}-mode`} checked={mode === 'encrypt'} onChange={() => setMode('encrypt')} />
          <span className="text-sm text-gray-700">Encrypt</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name={`${toolId}-mode`} checked={mode === 'decrypt'} onChange={() => setMode('decrypt')} />
          <span className="text-sm text-gray-700">Decrypt</span>
        </label>
      </div>

      <button onClick={processText} aria-label={`${mode} text`} className="btn-primary">
        {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            {grid.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">5×5 Key Grid</label>
                <div className="font-mono text-sm bg-gray-50 p-3 rounded-lg border border-gray-200">
                  {grid.map((row, i) => (
                    <div key={i}>{row.join(' ').toUpperCase()}</div>
                  ))}
                </div>
              </div>
            )}
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
