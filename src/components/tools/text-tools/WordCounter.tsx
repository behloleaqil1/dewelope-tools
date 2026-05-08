'use client';

import { useState, useEffect, useRef } from 'react';
import { ToolEngineProps } from '@/types';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';
import { wordCount } from '@/lib/text-tools';
import { validateTextLength } from '@/lib/validation';

const MAX_LENGTH = 100000;

/**
 * WordCounter - Counts words, sentences, paragraphs, and characters in text.
 * Uses 500ms debounce for real-time output.
 * Requirements: 4.2, 4.3, 4.4, 4.5, 4.6
 */
export default function WordCounter({ toolId, toolName: _toolName }: ToolEngineProps) {
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
      const result = wordCount(input);
      const formatted = [
        `Words: ${result.words}`,
        `Characters: ${result.characters}`,
        `Characters (no spaces): ${result.charactersNoSpaces}`,
        `Sentences: ${result.sentences}`,
        `Paragraphs: ${result.paragraphs}`,
      ].join('\n');
      setOutput(formatted);
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
          placeholder="Paste or type your text here to count words, sentences, and paragraphs..."
          maxLength={MAX_LENGTH}
          aria-label="Text input for word counting"
          className="w-full h-48 p-3 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="text-xs text-gray-500 text-right">
          {input.length.toLocaleString()} / {MAX_LENGTH.toLocaleString()} characters
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
