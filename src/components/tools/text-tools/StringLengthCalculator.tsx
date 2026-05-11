'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * StringLengthCalculator - Calculate string length in bytes, chars, and UTF-8/UTF-16 encoding sizes.
 */
export default function StringLengthCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ chars: number; bytes: number; utf8: number; utf16: number; codePoints: number } | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input) {
      setResult(null);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const chars = input.length;
      const encoder = new TextEncoder();
      const utf8Bytes = encoder.encode(input);
      const utf8 = utf8Bytes.length;
      const utf16 = chars * 2;
      const codePoints = [...input].length;

      setResult({ chars, bytes: utf8, utf8, utf16, codePoints });
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input]);

  const copyText = result
    ? `Characters: ${result.chars}\nCode Points: ${result.codePoints}\nUTF-8 Bytes: ${result.utf8}\nUTF-16 Bytes: ${result.utf16}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to analyze
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste text to calculate its length..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
      </InputArea>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.chars}</div>
                <div className="text-xs text-gray-500 mt-1">Characters (length)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.codePoints}</div>
                <div className="text-xs text-gray-500 mt-1">Code Points</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{result.utf8}</div>
                <div className="text-xs text-gray-500 mt-1">UTF-8 Bytes</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-purple-600">{result.utf16}</div>
                <div className="text-xs text-gray-500 mt-1">UTF-16 Bytes</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
