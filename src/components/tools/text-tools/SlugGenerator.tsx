'use client';

import { useState, useEffect, useRef } from 'react';
import { ToolEngineProps } from '@/types';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';
import { generateSlugFromText } from '@/lib/text-tools';
import { validateTextLength } from '@/lib/validation';

const MAX_LENGTH = 100000;

/**
 * SlugGenerator - Generates URL-safe slugs from text input.
 * Uses 500ms debounce for real-time output.
 * Requirements: 4.2, 4.3, 4.4, 4.5, 4.6
 */
export default function SlugGenerator({ toolId, toolName: _toolName }: ToolEngineProps) {
  const [input, setInput] = useState('');
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

    const validation = validateTextLength(input, MAX_LENGTH);
    if (!validation.valid) {
      setError(validation.error);
      setOutput('');
      return;
    }

    setError(undefined);

    debounceRef.current = setTimeout(() => {
      setOutput(generateSlugFromText(input));
    }, 500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [input]);

  return (
    <div className="space-y-4">
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter your text
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste or type text to generate a URL-safe slug..."
          maxLength={MAX_LENGTH}
          aria-label="Text input for slug generation"
          className="w-full h-48 p-3 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="text-xs text-gray-500 text-right">
          {input.length.toLocaleString()} / {MAX_LENGTH.toLocaleString()} characters
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <p className="text-sm text-gray-800 font-mono break-all">{output}</p>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
