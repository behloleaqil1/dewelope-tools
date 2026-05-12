'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToKeywordCipher - Keyword-based substitution cipher.
 * Generates a cipher alphabet from a keyword and encrypts/decrypts text.
 */
export default function TextToKeywordCipher({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [output, setOutput] = useState('');

  const STANDARD = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const buildCipherAlphabet = (kw: string): string => {
    const upper = kw.toUpperCase().replace(/[^A-Z]/g, '');
    const seen = new Set<string>();
    let cipherAlpha = '';

    for (const ch of upper) {
      if (!seen.has(ch)) {
        seen.add(ch);
        cipherAlpha += ch;
      }
    }

    for (const ch of STANDARD) {
      if (!seen.has(ch)) {
        seen.add(ch);
        cipherAlpha += ch;
      }
    }

    return cipherAlpha;
  };

  const process = () => {
    if (!input.trim()) {
      setOutput('Please enter text to process.');
      return;
    }
    if (!keyword.trim()) {
      setOutput('Please enter a keyword.');
      return;
    }

    const cipherAlpha = buildCipherAlphabet(keyword);

    let fromAlpha: string;
    let toAlpha: string;

    if (mode === 'encrypt') {
      fromAlpha = STANDARD;
      toAlpha = cipherAlpha;
    } else {
      fromAlpha = cipherAlpha;
      toAlpha = STANDARD;
    }

    const result = input.split('').map(char => {
      const upper = char.toUpperCase();
      const idx = fromAlpha.indexOf(upper);
      if (idx === -1) return char;
      const mapped = toAlpha[idx];
      return char === char.toLowerCase() ? mapped.toLowerCase() : mapped;
    }).join('');

    const lines: string[] = [];
    lines.push(`Keyword: ${keyword.trim()}`);
    lines.push(`Cipher Alphabet: ${cipherAlpha}`);
    lines.push(`Standard:        ${STANDARD}`);
    lines.push('');
    lines.push(`${mode === 'encrypt' ? 'Ciphertext' : 'Plaintext'}:`);
    lines.push(result);

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor={`${toolId}-keyword`} className="block text-sm font-medium text-gray-700 mb-1">
                Keyword
              </label>
              <input
                id={`${toolId}-keyword`}
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g. SECRET"
                className="input-field font-mono"
                aria-label={`Keyword for ${toolName}`}
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">
                Mode
              </label>
              <select
                id={`${toolId}-mode`}
                value={mode}
                onChange={(e) => setMode(e.target.value as 'encrypt' | 'decrypt')}
                className="input-field"
                aria-label="Cipher mode"
              >
                <option value="encrypt">Encrypt</option>
                <option value="decrypt">Decrypt</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
              Input Text
            </label>
            <textarea
              id={`${toolId}-input`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to encrypt or decrypt..."
              className="input-field h-32 resize-y font-mono"
              aria-label="Input text"
            />
          </div>
        </div>

        <button
          onClick={process}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
