'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToMonospaceUnicode - Converts text to Unicode monospace mathematical characters.
 */
export default function TextToMonospaceUnicode({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!input) { setOutput(''); return; }

    debounceRef.current = setTimeout(() => {
      setOutput(toMonospace(input));
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input]);

  function toMonospace(text: string): string {
    return Array.from(text).map(char => {
      const code = char.charCodeAt(0);
      // Uppercase A-Z: U+1D670 to U+1D689
      if (code >= 65 && code <= 90) {
        return String.fromCodePoint(0x1D670 + (code - 65));
      }
      // Lowercase a-z: U+1D68A to U+1D6A3
      if (code >= 97 && code <= 122) {
        return String.fromCodePoint(0x1D68A + (code - 97));
      }
      // Digits 0-9: U+1D7F6 to U+1D7FF
      if (code >= 48 && code <= 57) {
        return String.fromCodePoint(0x1D7F6 + (code - 48));
      }
      return char;
    }).join('');
  }

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
          placeholder="Type text to convert to monospace Unicode..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y"
        />
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Monospace Unicode</label>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-lg text-gray-800 break-all">{output}</p>
            </div>
            <div className="text-xs text-gray-500">
              Characters converted: {input.length} | Uses Mathematical Monospace Unicode block
            </div>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
