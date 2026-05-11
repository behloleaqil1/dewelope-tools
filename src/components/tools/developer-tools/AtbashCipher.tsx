'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AtbashCipher - Encrypt/decrypt text using the Atbash cipher (reverse alphabet substitution).
 * A↔Z, B↔Y, C↔X, etc. The same operation encodes and decodes.
 */
export default function AtbashCipher({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  function handleProcess() {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    const result = input.replace(/[a-zA-Z]/g, (char) => {
      const isUpper = char >= 'A' && char <= 'Z';
      const base = isUpper ? 65 : 97;
      return String.fromCharCode(base + (25 - (char.charCodeAt(0) - base)));
    });

    setOutput(result);
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to encrypt/decrypt
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to apply Atbash cipher (A↔Z, B↔Y, C↔X...)"
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <button onClick={handleProcess} aria-label="Apply Atbash cipher" className="btn-primary">
        Apply Atbash Cipher
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all p-3 bg-gray-50 rounded-lg">{output}</pre>
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-200">
              Mapping: A↔Z, B↔Y, C↔X, D↔W, E↔V, F↔U, G↔T, H↔S, I↔R, J↔Q, K↔P, L↔O, M↔N
            </div>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
