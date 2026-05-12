'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToPolybiusSquare - Encrypt/decrypt text using the Polybius square cipher.
 * Maps letters to two-digit coordinates in a 5x5 grid (I/J share a cell).
 */
export default function TextToPolybiusSquare({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [output, setOutput] = useState('');

  const GRID = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // I/J share position

  const encrypt = (text: string): string => {
    return text
      .toUpperCase()
      .replace(/J/g, 'I')
      .split('')
      .map(char => {
        const idx = GRID.indexOf(char);
        if (idx === -1) return char === ' ' ? ' ' : '';
        const row = Math.floor(idx / 5) + 1;
        const col = (idx % 5) + 1;
        return `${row}${col}`;
      })
      .join(' ');
  };

  const decrypt = (text: string): string => {
    const pairs = text.trim().split(/\s+/);
    return pairs
      .map(pair => {
        if (pair.length !== 2) return '';
        const row = parseInt(pair[0]) - 1;
        const col = parseInt(pair[1]) - 1;
        if (row < 0 || row > 4 || col < 0 || col > 4) return '?';
        return GRID[row * 5 + col];
      })
      .join('');
  };

  const handleConvert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    if (mode === 'encrypt') {
      setOutput(encrypt(input));
    } else {
      setOutput(decrypt(input));
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex gap-2">
        <button
          onClick={() => setMode('encrypt')}
          className={`px-4 py-2 rounded text-sm font-medium ${mode === 'encrypt' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          aria-label="Switch to encrypt mode"
        >
          Encrypt
        </button>
        <button
          onClick={() => setMode('decrypt')}
          className={`px-4 py-2 rounded text-sm font-medium ${mode === 'decrypt' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          aria-label="Switch to decrypt mode"
        >
          Decrypt
        </button>
      </div>

      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          {mode === 'encrypt' ? 'Text to Encrypt' : 'Numbers to Decrypt (space-separated pairs)'}
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encrypt' ? 'Enter text to encrypt...' : 'e.g. 23 15 31 31 34'}
          aria-label={`Input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <button onClick={handleConvert} aria-label={`${mode} text`} className="btn-primary">
        {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Polybius Square Grid</h3>
        <div className="font-mono text-xs">
          <div className="grid grid-cols-6 gap-1 max-w-xs">
            <div></div>
            {[1,2,3,4,5].map(c => <div key={c} className="text-center font-bold">{c}</div>)}
            {[0,1,2,3,4].map(row => (
              <>
                <div key={`r${row}`} className="font-bold">{row + 1}</div>
                {[0,1,2,3,4].map(col => (
                  <div key={`${row}${col}`} className="text-center bg-white border border-gray-300 p-1">
                    {GRID[row * 5 + col]}{row === 1 && col === 2 ? '/J' : ''}
                  </div>
                ))}
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
