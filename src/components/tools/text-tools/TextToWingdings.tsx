'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const wingdingsMap: Record<string, string> = {
  'a': '✌', 'b': '👌', 'c': '👈', 'd': '👉', 'e': '☝', 'f': '👆',
  'g': '👇', 'h': '✋', 'i': '☺', 'j': '😐', 'k': '☹', 'l': '💣',
  'm': '☠', 'n': '⚐', 'o': '✈', 'p': '☀', 'q': '❄', 'r': '✝',
  's': '✡', 't': '☪', 'u': '☯', 'v': '♠', 'w': '♣', 'x': '♥',
  'y': '♦', 'z': '◆',
  'A': '✌', 'B': '👌', 'C': '👈', 'D': '👉', 'E': '☝', 'F': '👆',
  'G': '👇', 'H': '✋', 'I': '☺', 'J': '😐', 'K': '☹', 'L': '💣',
  'M': '☠', 'N': '⚐', 'O': '✈', 'P': '☀', 'Q': '❄', 'R': '✝',
  'S': '✡', 'T': '☪', 'U': '☯', 'V': '♠', 'W': '♣', 'X': '♥',
  'Y': '♦', 'Z': '◆',
  '0': '📁', '1': '📂', '2': '📄', '3': '🗏', '4': '🗐', '5': '🗄',
  '6': '⌛', '7': '🖮', '8': '🖰', '9': '🖲',
  ' ': ' ', '.': '●', ',': '○', '!': '✏', '?': '✂', '-': '✄',
};

/**
 * TextToWingdings - Converts text to Wingdings-like Unicode symbols.
 * Maps ASCII letters to various decorative Unicode symbols.
 */
export default function TextToWingdings({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!input) { setOutput(''); return; }

    debounceRef.current = setTimeout(() => {
      const result = input.split('').map((char) => wingdingsMap[char] || char).join('');
      setOutput(result);
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to convert
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type text here..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Wingdings Output</label>
            <pre className="whitespace-pre-wrap text-2xl text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
