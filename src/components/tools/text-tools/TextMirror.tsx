'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextMirror - Creates mirror/reflected text using Unicode RTL override characters.
 * Reverses text and applies RTL marks so it appears mirrored.
 */

const flipMap: Record<string, string> = {
  'a': 'ɒ', 'b': 'd', 'c': 'ɔ', 'd': 'b', 'e': 'ɘ', 'f': 'Ꮈ', 'g': 'ǫ',
  'h': 'ʜ', 'i': 'i', 'j': 'ꞁ', 'k': 'ʞ', 'l': 'l', 'm': 'm', 'n': 'ᴎ',
  'o': 'o', 'p': 'q', 'q': 'p', 'r': 'ɿ', 's': 'ꙅ', 't': 'ƚ', 'u': 'u',
  'v': 'v', 'w': 'w', 'x': 'x', 'y': 'ʏ', 'z': 'z',
  'A': 'A', 'B': 'ᗺ', 'C': 'Ↄ', 'D': 'ᗡ', 'E': 'Ǝ', 'F': 'ꟻ', 'G': 'Ꭾ',
  'H': 'H', 'I': 'I', 'J': 'Ꞁ', 'K': 'ꓘ', 'L': '⌐', 'M': 'M', 'N': 'ᴎ',
  'O': 'O', 'P': 'ꟼ', 'Q': 'Ọ', 'R': 'ᴙ', 'S': 'Ꙅ', 'T': 'T', 'U': 'U',
  'V': 'V', 'W': 'W', 'X': 'X', 'Y': 'Y', 'Z': 'Z',
  '1': '1', '2': '2', '3': 'Ɛ', '4': '4', '5': '5', '6': '6', '7': '7',
  '8': '8', '9': '9', '0': '0',
  '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{',
  '<': '>', '>': '<', '/': '\\', '\\': '/', '?': '⸮',
};

export default function TextMirror({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'reverse' | 'flip' | 'rtl'>('reverse');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input) {
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      let result = '';
      switch (mode) {
        case 'reverse':
          result = input.split('').reverse().join('');
          break;
        case 'flip':
          result = input
            .split('')
            .reverse()
            .map((char) => flipMap[char] || char)
            .join('');
          break;
        case 'rtl':
          result = '\u202E' + input + '\u202C';
          break;
      }
      setOutput(result);
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, mode]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to mirror
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to create mirror effect..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
        <div className="flex gap-3 mt-3">
          {([
            { value: 'reverse', label: 'Reverse' },
            { value: 'flip', label: 'Mirror Flip' },
            { value: 'rtl', label: 'RTL Override' },
          ] as const).map((opt) => (
            <label key={opt.value} className="flex items-center gap-1.5 text-sm text-gray-700">
              <input
                type="radio"
                name={`${toolId}-mode`}
                value={opt.value}
                checked={mode === opt.value}
                onChange={() => setMode(opt.value)}
                className="text-blue-600"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Mirrored Text</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
