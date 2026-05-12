'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToCaesarBoxCipher - Encrypt with Caesar Box (geometric transposition).
 * The text is written into a grid row by row and read column by column.
 * The key is the number of columns (grid width).
 */
export default function TextToCaesarBoxCipher({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [key, setKey] = useState(4);
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [output, setOutput] = useState('');

  const encrypt = (text: string, cols: number): string => {
    if (!text || cols < 2) return text;
    const padded = text.padEnd(Math.ceil(text.length / cols) * cols, 'X');
    const rows = Math.ceil(padded.length / cols);
    let result = '';
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        result += padded[r * cols + c];
      }
    }
    return result;
  };

  const decrypt = (text: string, cols: number): string => {
    if (!text || cols < 2) return text;
    const rows = Math.ceil(text.length / cols);
    const grid: string[] = new Array(text.length).fill('');
    let idx = 0;
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        if (idx < text.length) {
          grid[r * cols + c] = text[idx];
          idx++;
        }
      }
    }
    return grid.join('');
  };

  const process = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    if (mode === 'encrypt') {
      setOutput(encrypt(input, key));
    } else {
      setOutput(decrypt(input, key));
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
              Enter text
            </label>
            <textarea
              id={`${toolId}-input`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to encrypt or decrypt..."
              aria-label={`Text input for ${toolName}`}
              className="input-field h-32 resize-y font-mono"
            />
          </div>
          <div className="flex gap-3 items-end flex-wrap">
            <div>
              <label htmlFor={`${toolId}-key`} className="block text-sm font-medium text-gray-700 mb-1">
                Key (columns)
              </label>
              <input
                id={`${toolId}-key`}
                type="number"
                min={2}
                max={50}
                value={key}
                onChange={(e) => setKey(Math.max(2, parseInt(e.target.value) || 2))}
                aria-label="Number of columns (key)"
                className="input-field w-24"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as 'encrypt' | 'decrypt')}
                aria-label="Encrypt or decrypt mode"
                className="input-field w-32"
              >
                <option value="encrypt">Encrypt</option>
                <option value="decrypt">Decrypt</option>
              </select>
            </div>
            <button onClick={process} className="btn-primary text-sm">
              {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
            </button>
          </div>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {mode === 'encrypt' ? 'Encrypted' : 'Decrypted'} Text
            </label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
