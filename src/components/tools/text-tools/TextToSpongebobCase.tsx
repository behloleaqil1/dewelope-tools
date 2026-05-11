'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToSpongebobCase - Converts text to SpOnGeBoB mOcKiNg CaSe.
 * Alternates between lowercase and uppercase for each letter.
 */
export default function TextToSpongebobCase({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [randomMode, setRandomMode] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input) {
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      let letterIndex = 0;
      const result = input
        .split('')
        .map((char) => {
          if (/[a-zA-Z]/.test(char)) {
            let shouldUpper: boolean;
            if (randomMode) {
              shouldUpper = Math.random() > 0.5;
            } else {
              shouldUpper = letterIndex % 2 === 1;
            }
            letterIndex++;
            return shouldUpper ? char.toUpperCase() : char.toLowerCase();
          }
          return char;
        })
        .join('');

      setOutput(result);
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, randomMode]);

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
          placeholder="Enter text to convert to spongebob case..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <div className="flex items-center gap-2">
        <input
          id={`${toolId}-random`}
          type="checkbox"
          checked={randomMode}
          onChange={(e) => setRandomMode(e.target.checked)}
          className="rounded border-gray-300"
        />
        <label htmlFor={`${toolId}-random`} className="text-sm text-gray-700">
          Random mode (non-deterministic alternation)
        </label>
      </div>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">SpOnGeBoB CaSe Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
