'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToStraddlingCheckerboard - Encrypt and decrypt text using the Straddling Checkerboard cipher.
 * A fractionating transposition cipher that produces variable-length numeric ciphertext.
 */
export default function TextToStraddlingCheckerboard({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  // Standard straddling checkerboard layout
  // Row headers: none, 2, 6 (spare positions in top row)
  const topRow = ['E', 'T', '', 'A', 'O', 'N', '', 'R', 'I', 'S'];
  const row2 =   ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'];
  const row6 =   ['P', 'Q', 'U', 'V', 'W', 'X', 'Y', 'Z', '.', '/'];

  function buildEncryptMap(): Map<string, string> {
    const map = new Map<string, string>();
    for (let i = 0; i < 10; i++) {
      if (topRow[i]) map.set(topRow[i], String(i));
    }
    for (let i = 0; i < 10; i++) {
      map.set(row2[i], '2' + String(i));
    }
    for (let i = 0; i < 10; i++) {
      map.set(row6[i], '6' + String(i));
    }
    return map;
  }

  function buildDecryptMap(): Map<string, string> {
    const map = new Map<string, string>();
    for (let i = 0; i < 10; i++) {
      if (topRow[i]) map.set(String(i), topRow[i]);
    }
    for (let i = 0; i < 10; i++) {
      map.set('2' + String(i), row2[i]);
    }
    for (let i = 0; i < 10; i++) {
      map.set('6' + String(i), row6[i]);
    }
    return map;
  }

  function handleProcess() {
    setError('');
    setOutput('');
    if (!input.trim()) {
      setError('Please enter text to process.');
      return;
    }

    if (mode === 'encrypt') {
      const encMap = buildEncryptMap();
      const plainUpper = input.toUpperCase().replace(/[^A-Z./]/g, '');
      if (plainUpper.length === 0) {
        setError('Input must contain at least one letter.');
        return;
      }
      let result = '';
      for (const ch of plainUpper) {
        const code = encMap.get(ch);
        if (code) result += code;
      }
      setOutput(result);
    } else {
      const digits = input.replace(/[^0-9]/g, '');
      if (digits.length === 0) {
        setError('Decrypt input must contain digits.');
        return;
      }
      const decMap = buildDecryptMap();
      let result = '';
      let i = 0;
      while (i < digits.length) {
        const d = digits[i];
        if (d === '2' || d === '6') {
          if (i + 1 >= digits.length) {
            setError('Invalid ciphertext: escape digit at end.');
            return;
          }
          const code = d + digits[i + 1];
          const ch = decMap.get(code);
          if (!ch) {
            setError(`Invalid code: ${code}`);
            return;
          }
          result += ch;
          i += 2;
        } else {
          const ch = decMap.get(d);
          if (!ch) {
            setError(`Invalid digit: ${d}`);
            return;
          }
          result += ch;
          i += 1;
        }
      }
      setOutput(result);
    }
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="flex gap-4 mb-3">
          <label className="flex items-center gap-1">
            <input type="radio" checked={mode === 'encrypt'} onChange={() => setMode('encrypt')} aria-label="Encrypt mode" />
            <span className="text-sm">Encrypt</span>
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" checked={mode === 'decrypt'} onChange={() => setMode('decrypt')} aria-label="Decrypt mode" />
            <span className="text-sm">Decrypt</span>
          </label>
        </div>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          {mode === 'encrypt' ? 'Plaintext' : 'Ciphertext (digits)'}
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encrypt' ? 'Enter text to encrypt...' : 'Enter digits to decrypt...'}
          aria-label={`${mode === 'encrypt' ? 'Plaintext' : 'Ciphertext'} input for ${toolName}`}
          className="input-field h-36 resize-y font-mono"
        />
        <button onClick={handleProcess} className="btn-primary mt-2">{mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}</button>
        <div className="mt-3 text-xs text-gray-500">
          <p className="font-medium mb-1">Checkerboard Layout:</p>
          <p>Top: E T _ A O N _ R I S (single digit)</p>
          <p>Row 2: B C D F G H J K L M (prefix 2)</p>
          <p>Row 6: P Q U V W X Y Z . / (prefix 6)</p>
        </div>
      </InputArea>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
