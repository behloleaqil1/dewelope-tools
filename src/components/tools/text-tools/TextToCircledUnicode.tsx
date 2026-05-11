'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToCircledUnicode - Converts text to Unicode circled characters (Ⓐ Ⓑ Ⓒ).
 * Supports uppercase A-Z and digits 0-9.
 */
export default function TextToCircledUnicode({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input) {
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      const result = input.split('').map((char) => {
        const upper = char.toUpperCase();
        // Circled uppercase letters: Ⓐ = U+24B6 to Ⓩ = U+24CF
        if (upper >= 'A' && upper <= 'Z') {
          return String.fromCodePoint(0x24B6 + (upper.charCodeAt(0) - 65));
        }
        // Circled digits: ⓪ = U+24EA, ① = U+2460 to ⑨ = U+2468
        if (char >= '1' && char <= '9') {
          return String.fromCodePoint(0x2460 + (parseInt(char) - 1));
        }
        if (char === '0') {
          return '\u24EA';
        }
        return char;
      }).join('');
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
          placeholder="e.g. Hello World 123"
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y"
        />
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-2xl break-all">{output}</div>
            </div>
            <div className="text-xs text-gray-500">
              Supports A-Z letters and 0-9 digits. Other characters pass through unchanged.
            </div>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
