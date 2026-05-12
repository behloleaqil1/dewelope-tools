'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToWideSpacing - Add spaces between each character to create wide/aesthetic text.
 * Transforms "hello" into "h e l l o" style text.
 */
export default function TextToWideSpacing({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [spacing, setSpacing] = useState(1);
  const [output, setOutput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input) { setOutput(''); return; }

    debounceRef.current = setTimeout(() => {
      const spacer = ' '.repeat(spacing);
      const result = input.split('\n').map((line) =>
        [...line].join(spacer)
      ).join('\n');
      setOutput(result);
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, spacing]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type text to add wide spacing..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-36 resize-y font-mono"
        />
        <label htmlFor={`${toolId}-spacing`} className="block text-sm font-medium text-gray-700 mt-3 mb-1">
          Spaces between characters: {spacing}
        </label>
        <input
          id={`${toolId}-spacing`}
          type="range"
          min={1}
          max={5}
          value={spacing}
          onChange={(e) => setSpacing(Number(e.target.value))}
          className="w-full"
          aria-label="Number of spaces between characters"
        />
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
