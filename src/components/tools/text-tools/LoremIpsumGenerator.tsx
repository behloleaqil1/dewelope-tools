'use client';

import { useState, useEffect, useRef } from 'react';
import { ToolEngineProps } from '@/types';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';
import { generateLoremIpsum } from '@/lib/text-tools';
import { validateRange } from '@/lib/validation';

/**
 * LoremIpsumGenerator - Generates Lorem Ipsum placeholder text.
 * Allows user to specify paragraph count (1-50).
 * Uses 500ms debounce for real-time output.
 * Requirements: 4.2, 4.3, 4.4, 4.5, 4.6
 */
export default function LoremIpsumGenerator({ toolId, toolName: _toolName }: ToolEngineProps) {
  const [paragraphs, setParagraphs] = useState('3');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!paragraphs.trim()) {
      setOutput('');
      setError(undefined);
      return;
    }

    const num = parseInt(paragraphs, 10);
    if (isNaN(num)) {
      setError('Please enter a valid number');
      setOutput('');
      return;
    }

    const validation = validateRange(num, 1, 50);
    if (!validation.valid) {
      setError(validation.error);
      setOutput('');
      return;
    }

    setError(undefined);

    debounceRef.current = setTimeout(() => {
      setOutput(generateLoremIpsum(num));
    }, 500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [paragraphs]);

  return (
    <div className="space-y-4">
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Number of paragraphs (1-50)
        </label>
        <input
          id={`${toolId}-input`}
          type="number"
          value={paragraphs}
          onChange={(e) => setParagraphs(e.target.value)}
          placeholder="Enter number of paragraphs (1-50)..."
          min={1}
          max={50}
          aria-label="Number of paragraphs to generate"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
        />
      </InputArea>

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
