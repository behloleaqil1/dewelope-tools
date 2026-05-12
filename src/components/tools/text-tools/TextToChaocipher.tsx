'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToChaocipher - Encrypt/decrypt text using the Chaocipher algorithm.
 * Uses two evolving alphabets that permute after each character is enciphered.
 */
export default function TextToChaocipher({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [leftAlphabet, setLeftAlphabet] = useState('HXUCZVAMDSLKPEFJRIGTWOBNYQ');
  const [rightAlphabet, setRightAlphabet] = useState('PTLNBQDEOYSFAVZKGJRIHWXUMC');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const isValidAlphabet = (alpha: string): boolean => {
    const upper = alpha.toUpperCase();
    if (upper.length !== 26) return false;
    const sorted = upper.split('').sort().join('');
    return sorted === 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  };

  const chaocipher = (text: string, left: string, right: string, encrypting: boolean): string => {
    let leftArr = left.toUpperCase().split('');
    let rightArr = right.toUpperCase().split('');
    const result: string[] = [];

    const upperText = text.toUpperCase();

    for (let i = 0; i < upperText.length; i++) {
      const ch = upperText[i];
      if (ch < 'A' || ch > 'Z') {
        result.push(text[i]);
        continue;
      }

      let outChar: string;
      let index: number;

      if (encrypting) {
        index = rightArr.indexOf(ch);
        outChar = leftArr[index];
      } else {
        index = leftArr.indexOf(ch);
        outChar = rightArr[index];
      }

      // Preserve original case
      if (text[i] === text[i].toLowerCase()) {
        outChar = outChar.toLowerCase();
      }
      result.push(outChar);

      // Permute left alphabet
      const leftShifted = [...leftArr.slice(index), ...leftArr.slice(0, index)];
      const leftExtracted = leftShifted.splice(1, 1)[0];
      leftShifted.splice(13, 0, leftExtracted);
      leftArr = leftShifted;

      // Permute right alphabet
      const rightShifted = [...rightArr.slice(index), ...rightArr.slice(0, index)];
      // Shift one more position
      rightShifted.push(rightShifted.shift()!);
      const rightExtracted = rightShifted.splice(2, 1)[0];
      rightShifted.splice(13, 0, rightExtracted);
      rightArr = rightShifted;
    }

    return result.join('');
  };

  const handleConvert = () => {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter text.');
      return;
    }

    if (!isValidAlphabet(leftAlphabet)) {
      setError('Left alphabet must contain all 26 unique letters A-Z.');
      return;
    }

    if (!isValidAlphabet(rightAlphabet)) {
      setError('Right alphabet must contain all 26 unique letters A-Z.');
      return;
    }

    const result = chaocipher(input, leftAlphabet, rightAlphabet, mode === 'encrypt');
    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="flex gap-4 mb-3">
          <label className="flex items-center gap-1 text-sm">
            <input
              type="radio"
              name={`${toolId}-mode`}
              checked={mode === 'encrypt'}
              onChange={() => setMode('encrypt')}
            />
            Encrypt
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input
              type="radio"
              name={`${toolId}-mode`}
              checked={mode === 'decrypt'}
              onChange={() => setMode('decrypt')}
            />
            Decrypt
          </label>
        </div>
        <label htmlFor={`${toolId}-left`} className="block text-sm font-medium text-gray-700 mb-1">
          Left Alphabet (ciphertext alphabet)
        </label>
        <input
          id={`${toolId}-left`}
          type="text"
          value={leftAlphabet}
          onChange={(e) => setLeftAlphabet(e.target.value)}
          maxLength={26}
          aria-label="Left alphabet for Chaocipher"
          className="input-field font-mono mb-2"
        />
        <label htmlFor={`${toolId}-right`} className="block text-sm font-medium text-gray-700 mb-1">
          Right Alphabet (plaintext alphabet)
        </label>
        <input
          id={`${toolId}-right`}
          type="text"
          value={rightAlphabet}
          onChange={(e) => setRightAlphabet(e.target.value)}
          maxLength={26}
          aria-label="Right alphabet for Chaocipher"
          className="input-field font-mono mb-2"
        />
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          {mode === 'encrypt' ? 'Plaintext' : 'Ciphertext'}
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encrypt' ? 'Enter plaintext...' : 'Enter ciphertext...'}
          aria-label={`Input for ${toolName}`}
          className="input-field h-36 resize-y font-mono"
        />
        <button onClick={handleConvert} className="btn-primary mt-2">
          {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
        </button>
      </InputArea>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {mode === 'encrypt' ? 'Ciphertext' : 'Plaintext'}
            </label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
