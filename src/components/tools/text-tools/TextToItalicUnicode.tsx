'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToItalicUnicode - Converts text to Unicode italic mathematical characters.
 * Maps A-Z to 𝐴-𝑍 (U+1D434-U+1D44D) and a-z to 𝑎-𝑧 (U+1D44E-U+1D467).
 * Note: h maps to ℎ (U+210E, Planck constant).
 */
export default function TextToItalicUnicode({ toolId, toolName }: { toolId: string; toolName: string }) {
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
      const result = Array.from(input)
        .map((char) => {
          const code = char.charCodeAt(0);
          // Uppercase A-Z -> Mathematical Italic Capital
          if (code >= 65 && code <= 90) {
            return String.fromCodePoint(0x1D434 + (code - 65));
          }
          // Lowercase a-z -> Mathematical Italic Small
          if (code >= 97 && code <= 122) {
            // Special case: 'h' maps to U+210E (Planck constant)
            if (code === 104) return '\u210E';
            const offset = code - 97;
            // Adjust for the gap at 'h' position
            if (offset < 7) {
              return String.fromCodePoint(0x1D44E + offset);
            }
            return String.fromCodePoint(0x1D44E + offset);
          }
          return char;
        })
        .join('');
      setOutput(result);
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to convert to italic Unicode
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type text here to convert to italic..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-36 resize-y font-mono"
        />
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Italic Unicode Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 p-4 bg-gray-50 rounded-lg border border-gray-100 max-h-64 overflow-y-auto break-all">
              {output}
            </pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
