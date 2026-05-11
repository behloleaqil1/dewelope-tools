'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CaesarCipher - Encrypt/decrypt text using the Caesar cipher with a configurable shift value.
 */
export default function CaesarCipher({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [shift, setShift] = useState('3');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [output, setOutput] = useState('');

  function handleProcess() {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    const shiftVal = ((parseInt(shift) || 0) % 26 + 26) % 26;
    const effectiveShift = mode === 'encrypt' ? shiftVal : 26 - shiftVal;

    const result = input.replace(/[a-zA-Z]/g, (char) => {
      const base = char >= 'a' ? 97 : 65;
      return String.fromCharCode(((char.charCodeAt(0) - base + effectiveShift) % 26) + base);
    });

    setOutput(result);
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex gap-2">
        <button
          onClick={() => { setMode('encrypt'); setOutput(''); }}
          aria-label="Encrypt mode"
          className={`px-4 py-2 text-sm font-medium rounded-md min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${mode === 'encrypt' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Encrypt
        </button>
        <button
          onClick={() => { setMode('decrypt'); setOutput(''); }}
          aria-label="Decrypt mode"
          className={`px-4 py-2 text-sm font-medium rounded-md min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${mode === 'decrypt' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Decrypt
        </button>
      </div>

      <InputArea>
        <label htmlFor={`${toolId}-shift`} className="block text-sm font-medium text-gray-700 mb-1">
          Shift Value (1-25)
        </label>
        <input
          id={`${toolId}-shift`}
          type="number"
          min="1"
          max="25"
          value={shift}
          onChange={(e) => setShift(e.target.value)}
          aria-label={`Shift value for ${toolName}`}
          className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
        />
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          {mode === 'encrypt' ? 'Plaintext' : 'Ciphertext'}
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encrypt' ? 'Enter text to encrypt...' : 'Enter text to decrypt...'}
          aria-label={`Text input for ${toolName}`}
          className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
        />
      </InputArea>

      <button
        onClick={handleProcess}
        aria-label={mode === 'encrypt' ? 'Encrypt text' : 'Decrypt text'}
        className="px-6 py-3 text-sm font-medium rounded-md min-h-[44px] bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all p-3 bg-gray-50 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
