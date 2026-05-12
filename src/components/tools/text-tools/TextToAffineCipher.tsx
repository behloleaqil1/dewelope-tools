'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToAffineCipher - Encrypt/decrypt text using the Affine cipher.
 * Formula: E(x) = (ax + b) mod 26, D(x) = a^-1(x - b) mod 26
 * Requires 'a' to be coprime with 26.
 */
export default function TextToAffineCipher({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [a, setA] = useState('5');
  const [b, setB] = useState('8');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [output, setOutput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validAValues = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];

  const modInverse = (aVal: number, m: number): number => {
    for (let i = 1; i < m; i++) {
      if ((aVal * i) % m === 1) return i;
    }
    return -1;
  };

  const process = () => {
    const newErrors: Record<string, string> = {};

    if (!input.trim()) {
      newErrors.input = 'Please enter text to process';
    }

    const aVal = parseInt(a);
    const bVal = parseInt(b);

    if (isNaN(aVal) || !validAValues.includes(aVal)) {
      newErrors.a = `'a' must be coprime with 26: ${validAValues.join(', ')}`;
    }
    if (isNaN(bVal) || bVal < 0 || bVal > 25) {
      newErrors.b = `'b' must be between 0 and 25`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setOutput('');
      return;
    }

    setErrors({});
    let result = '';

    if (mode === 'encrypt') {
      for (let i = 0; i < input.length; i++) {
        const char = input[i];
        if (/[a-zA-Z]/.test(char)) {
          const isUpper = char === char.toUpperCase();
          const x = char.toUpperCase().charCodeAt(0) - 65;
          const encrypted = (aVal * x + bVal) % 26;
          const encChar = String.fromCharCode(encrypted + 65);
          result += isUpper ? encChar : encChar.toLowerCase();
        } else {
          result += char;
        }
      }
    } else {
      const aInv = modInverse(aVal, 26);
      for (let i = 0; i < input.length; i++) {
        const char = input[i];
        if (/[a-zA-Z]/.test(char)) {
          const isUpper = char === char.toUpperCase();
          const y = char.toUpperCase().charCodeAt(0) - 65;
          const decrypted = ((aInv * (y - bVal + 26)) % 26 + 26) % 26;
          const decChar = String.fromCharCode(decrypted + 65);
          result += isUpper ? decChar : decChar.toLowerCase();
        } else {
          result += char;
        }
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

      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={mode === 'encrypt'} onChange={() => setMode('encrypt')} className="text-blue-600" />
            <span className="text-sm">Encrypt</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={mode === 'decrypt'} onChange={() => setMode('decrypt')} className="text-blue-600" />
            <span className="text-sm">Decrypt</span>
          </label>
        </div>
      </InputArea>

      <div className="grid grid-cols-2 gap-4">
        <InputArea error={errors.a}>
          <label htmlFor={`${toolId}-a`} className="block text-sm font-medium text-gray-700 mb-1">
            Key &apos;a&apos; (coprime with 26)
          </label>
          <select
            id={`${toolId}-a`}
            value={a}
            onChange={(e) => { setA(e.target.value); if (errors.a) setErrors((prev) => ({ ...prev, a: '' })); }}
            aria-label={`Key a for ${toolName}`}
            className="input-field"
          >
            {validAValues.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </InputArea>

        <InputArea error={errors.b}>
          <label htmlFor={`${toolId}-b`} className="block text-sm font-medium text-gray-700 mb-1">
            Key &apos;b&apos; (0-25)
          </label>
          <input
            id={`${toolId}-b`}
            type="number"
            min="0"
            max="25"
            value={b}
            onChange={(e) => { setB(e.target.value); if (errors.b) setErrors((prev) => ({ ...prev, b: '' })); }}
            aria-label={`Key b for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <p className="text-xs text-gray-500">Formula: E(x) = ({a}x + {b}) mod 26</p>

      <button onClick={process} aria-label={`${mode === 'encrypt' ? 'Encrypt' : 'Decrypt'} with Affine cipher`} className="btn-primary">
        {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result ({mode === 'encrypt' ? 'Ciphertext' : 'Plaintext'})</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
