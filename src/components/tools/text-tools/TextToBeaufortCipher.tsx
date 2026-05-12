'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToBeaufortCipher - Encrypt/decrypt text using the Beaufort cipher.
 * The Beaufort cipher is a polyalphabetic substitution cipher similar to Vigenère
 * but uses subtraction: C = (K - P) mod 26. It is reciprocal (encrypt = decrypt).
 */
export default function TextToBeaufortCipher({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [output, setOutput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const processBeaufort = () => {
    const newErrors: Record<string, string> = {};

    if (!input.trim()) {
      newErrors.input = 'Please enter text to process';
    }
    if (!key.trim()) {
      newErrors.key = 'Please enter a key (letters only)';
    } else if (!/^[a-zA-Z]+$/.test(key.trim())) {
      newErrors.key = 'Key must contain only letters (A-Z)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setOutput('');
      return;
    }

    setErrors({});
    const cleanKey = key.trim().toUpperCase();
    let keyIndex = 0;
    let result = '';

    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      if (/[a-zA-Z]/.test(char)) {
        const isUpper = char === char.toUpperCase();
        const plainVal = char.toUpperCase().charCodeAt(0) - 65;
        const keyVal = cleanKey[keyIndex % cleanKey.length].charCodeAt(0) - 65;
        // Beaufort: C = (K - P) mod 26
        const cipherVal = ((keyVal - plainVal + 26) % 26);
        const cipherChar = String.fromCharCode(cipherVal + 65);
        result += isUpper ? cipherChar : cipherChar.toLowerCase();
        keyIndex++;
      } else {
        result += char;
      }
    }

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={errors.input}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter Text
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => { setInput(e.target.value); if (errors.input) setErrors((prev) => ({ ...prev, input: '' })); }}
          placeholder="Enter text to encrypt or decrypt..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <InputArea error={errors.key}>
        <label htmlFor={`${toolId}-key`} className="block text-sm font-medium text-gray-700 mb-1">
          Key (letters only)
        </label>
        <input
          id={`${toolId}-key`}
          type="text"
          value={key}
          onChange={(e) => { setKey(e.target.value); if (errors.key) setErrors((prev) => ({ ...prev, key: '' })); }}
          placeholder="e.g. SECRET"
          aria-label={`Cipher key for ${toolName}`}
          className="input-field"
        />
        <p className="text-xs text-gray-500 mt-1">The Beaufort cipher is reciprocal — applying it twice with the same key returns the original text.</p>
      </InputArea>

      <button onClick={processBeaufort} aria-label="Apply Beaufort cipher" className="btn-primary">
        Apply Beaufort Cipher
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
