'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToSubstitutionCipher - Custom alphabet substitution cipher.
 * Encrypts/decrypts text using a user-defined substitution alphabet.
 */
export default function TextToSubstitutionCipher({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [alphabet, setAlphabet] = useState('ZYXWVUTSRQPONMLKJIHGFEDCBA');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [output, setOutput] = useState('');

  const STANDARD = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const process = () => {
    if (!input.trim()) {
      setOutput('Please enter text to process.');
      return;
    }

    const cleanAlphabet = alphabet.toUpperCase().replace(/[^A-Z]/g, '');
    if (cleanAlphabet.length !== 26) {
      setOutput('Substitution alphabet must contain exactly 26 unique letters.');
      return;
    }

    const uniqueChars = new Set(cleanAlphabet);
    if (uniqueChars.size !== 26) {
      setOutput('Substitution alphabet must contain all 26 unique letters (no duplicates).');
      return;
    }

    let fromAlpha: string;
    let toAlpha: string;

    if (mode === 'encrypt') {
      fromAlpha = STANDARD;
      toAlpha = cleanAlphabet;
    } else {
      fromAlpha = cleanAlphabet;
      toAlpha = STANDARD;
    }

    const result = input.split('').map(char => {
      const upper = char.toUpperCase();
      const idx = fromAlpha.indexOf(upper);
      if (idx === -1) return char;
      const mapped = toAlpha[idx];
      return char === char.toLowerCase() ? mapped.toLowerCase() : mapped;
    }).join('');

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">
                Mode
              </label>
              <select
                id={`${toolId}-mode`}
                value={mode}
                onChange={(e) => setMode(e.target.value as 'encrypt' | 'decrypt')}
                className="input-field"
                aria-label={`Mode for ${toolName}`}
              >
                <option value="encrypt">Encrypt</option>
                <option value="decrypt">Decrypt</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-alpha`} className="block text-sm font-medium text-gray-700 mb-1">
                Substitution Alphabet (26 letters)
              </label>
              <input
                id={`${toolId}-alpha`}
                type="text"
                value={alphabet}
                onChange={(e) => setAlphabet(e.target.value)}
                placeholder="ZYXWVUTSRQPONMLKJIHGFEDCBA"
                maxLength={26}
                className="input-field font-mono"
                aria-label="Substitution alphabet"
              />
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
