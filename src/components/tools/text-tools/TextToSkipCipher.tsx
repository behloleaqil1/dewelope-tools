'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToSkipCipher - Encrypt with Skip cipher (every nth character).
 * Reads every nth character from the text to produce the ciphertext.
 * Decryption reverses the process by placing characters at skip intervals.
 */
export default function TextToSkipCipher({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [skip, setSkip] = useState(3);
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [output, setOutput] = useState('');

  const encrypt = (text: string, n: number): string => {
    if (!text || n < 2) return text;
    const len = text.length;
    const result: string[] = [];
    let pos = 0;
    const visited = new Set<number>();

    for (let start = 0; start < n && visited.size < len; start++) {
      pos = start;
      while (pos < len) {
        if (!visited.has(pos)) {
          result.push(text[pos]);
          visited.add(pos);
        }
        pos += n;
      }
    }
    return result.join('');
  };

  const decrypt = (text: string, n: number): string => {
    if (!text || n < 2) return text;
    const len = text.length;
    const result: string[] = new Array(len).fill('');
    let idx = 0;

    for (let start = 0; start < n && idx < len; start++) {
      let pos = start;
      while (pos < len && idx < len) {
        result[pos] = text[idx];
        idx++;
        pos += n;
      }
    }
    return result.join('');
  };

  const process = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    if (mode === 'encrypt') {
      setOutput(encrypt(input, skip));
    } else {
      setOutput(decrypt(input, skip));
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
              placeholder="Enter text to encrypt or decrypt with skip cipher..."
              aria-label={`Text input for ${toolName}`}
              className="input-field h-32 resize-y font-mono"
            />
          </div>
          <div className="flex gap-3 items-end flex-wrap">
            <div>
              <label htmlFor={`${toolId}-skip`} className="block text-sm font-medium text-gray-700 mb-1">
                Skip interval (n)
              </label>
              <input
                id={`${toolId}-skip`}
                type="number"
                min={2}
                max={100}
                value={skip}
                onChange={(e) => setSkip(Math.max(2, parseInt(e.target.value) || 2))}
                aria-label="Skip interval"
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
