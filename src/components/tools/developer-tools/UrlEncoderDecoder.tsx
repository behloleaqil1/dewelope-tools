'use client';

import { useState, useEffect, useRef } from 'react';
import { ToolEngineProps } from '@/types';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';
import { urlEncode, urlDecode } from '@/lib/developer-tools';

const MAX_LENGTH = 1048576; // 1MB

/**
 * UrlEncoderDecoder - Encode/decode URL components.
 * Preserves input on error, provides copy button for output.
 * Requirements: 6.2, 6.5, 6.6, 6.7
 */
export default function UrlEncoderDecoder({ toolId }: ToolEngineProps) {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!input) {
      setOutput('');
      setError(undefined);
      return;
    }

    if (input.length > MAX_LENGTH) {
      setError(`Input exceeds maximum size of 1 MB (${MAX_LENGTH.toLocaleString()} characters)`);
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      if (mode === 'encode') {
        setOutput(urlEncode(input));
        setError(undefined);
      } else {
        const result = urlDecode(input);
        if (result.error) {
          setError(result.error);
          setOutput('');
        } else {
          setOutput(result.result);
          setError(undefined);
        }
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setMode('encode')}
          aria-label="Switch to encode mode"
          className={`px-4 py-2 text-sm font-medium rounded-md min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            mode === 'encode'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Encode
        </button>
        <button
          onClick={() => setMode('decode')}
          aria-label="Switch to decode mode"
          className={`px-4 py-2 text-sm font-medium rounded-md min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            mode === 'decode'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Decode
        </button>
      </div>

      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          {mode === 'encode' ? 'Text to URL-encode' : 'URL-encoded text to decode'}
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Enter text to URL-encode...' : 'Enter URL-encoded string to decode...'}
          aria-label={mode === 'encode' ? 'Text input for URL encoding' : 'URL-encoded input for decoding'}
          className="w-full h-48 p-3 border border-gray-300 rounded-lg resize-y font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="text-xs text-gray-500 text-right">
          {input.length.toLocaleString()} / {MAX_LENGTH.toLocaleString()} characters
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
