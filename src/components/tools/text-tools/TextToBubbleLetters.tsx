'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToBubbleLetters - Converts text to Unicode bubble/enclosed characters.
 * Maps A-Z, a-z, and 0-9 to their circled Unicode equivalents.
 */
export default function TextToBubbleLetters({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [style, setStyle] = useState<'filled' | 'outlined'>('filled');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input) {
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      setOutput(convertToBubble(input, style));
    }, 200);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, style]);

  const convertToBubble = (text: string, mode: 'filled' | 'outlined'): string => {
    return text.split('').map((char) => {
      if (mode === 'filled') {
        if (char >= 'A' && char <= 'Z') return String.fromCodePoint(0x1F150 + char.charCodeAt(0) - 65);
        if (char >= 'a' && char <= 'z') return String.fromCodePoint(0x1F150 + char.charCodeAt(0) - 97);
        if (char === '0') return '\u24EA';
        if (char >= '1' && char <= '9') return String.fromCodePoint(0x2460 + char.charCodeAt(0) - 49);
      } else {
        if (char >= 'A' && char <= 'Z') return String.fromCodePoint(0x24B6 + char.charCodeAt(0) - 65);
        if (char >= 'a' && char <= 'z') return String.fromCodePoint(0x24D0 + char.charCodeAt(0) - 97);
        if (char === '0') return '\u24EA';
        if (char >= '1' && char <= '9') return String.fromCodePoint(0x2460 + char.charCodeAt(0) - 49);
      }
      return char;
    }).join('');
  };

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
          placeholder="Type text here to convert to bubble letters..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y"
        />
      </InputArea>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
        <div className="flex gap-3">
          <button
            onClick={() => setStyle('filled')}
            className={`px-4 py-2 rounded-lg text-sm font-medium border ${style === 'filled' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            aria-label="Filled bubble style"
          >
            Filled (🅐🅑🅒)
          </button>
          <button
            onClick={() => setStyle('outlined')}
            className={`px-4 py-2 rounded-lg text-sm font-medium border ${style === 'outlined' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            aria-label="Outlined bubble style"
          >
            Outlined (Ⓐ Ⓑ Ⓒ)
          </button>
        </div>
      </div>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Bubble Text</label>
            <pre className="whitespace-pre-wrap text-lg font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
