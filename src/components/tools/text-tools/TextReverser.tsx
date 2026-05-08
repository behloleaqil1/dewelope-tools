'use client';

import { useState, useEffect, useRef } from 'react';
import { ToolEngineProps } from '@/types';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';
import { reverseText, ReverseMode } from '@/lib/text-tools';
import { validateTextLength } from '@/lib/validation';

const MAX_LENGTH = 100000;

/**
 * TextReverser - Reverses text by characters or words.
 * Uses 500ms debounce for real-time output.
 * Requirements: 4.2, 4.3, 4.4, 4.5, 4.6
 */
export default function TextReverser({ toolId, toolName: _toolName }: ToolEngineProps) {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<ReverseMode>('characters');
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
      setOutput(reverseText(input, mode));
    }, 500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [input, mode]);

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
          placeholder="Paste or type your text here to reverse it..."
          maxLength={MAX_LENGTH}
          aria-label="Text input for reversing"
          className="w-full h-48 p-3 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="text-xs text-gray-500 text-right">
          {input.length.toLocaleString()} / {MAX_LENGTH.toLocaleString()} characters
        </div>
      </InputArea>

      <div className="flex flex-wrap gap-2">
        {(['characters', 'words'] as ReverseMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            aria-label={`Reverse by ${m}`}
            className={`px-4 py-2 text-sm font-medium rounded-md min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              mode === m
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Reverse {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm text-gray-800">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
