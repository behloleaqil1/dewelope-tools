'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToBoldUnicode - Converts text to Unicode bold mathematical characters.
 * Maps A-Z to 𝐀-𝐙 (U+1D400-U+1D419) and a-z to 𝐚-𝐳 (U+1D41A-U+1D433).
 * Maps 0-9 to 𝟎-𝟗 (U+1D7CE-U+1D7D7).
 */
export default function TextToBoldUnicode({ toolId, toolName }: { toolId: string; toolName: string }) {
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
          // Uppercase A-Z -> Mathematical Bold Capital
          if (code >= 65 && code <= 90) {
            return String.fromCodePoint(0x1D400 + (code - 65));
          }
          // Lowercase a-z -> Mathematical Bold Small
          if (code >= 97 && code <= 122) {
            return String.fromCodePoint(0x1D41A + (code - 97));
          }
          // Digits 0-9 -> Mathematical Bold Digits
          if (code >= 48 && code <= 57) {
            return String.fromCodePoint(0x1D7CE + (code - 48));
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
          Enter text to convert to bold Unicode
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type text here to convert to bold..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-36 resize-y font-mono"
        />
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Bold Unicode Result</label>
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
