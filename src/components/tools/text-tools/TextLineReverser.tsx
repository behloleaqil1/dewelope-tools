'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextLineReverser - Reverse the order of lines in text (not characters).
 * First line becomes last, last becomes first.
 */
export default function TextLineReverser({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [trimBlanks, setTrimBlanks] = useState(false);
  const [lineCount, setLineCount] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input.trim()) {
      setOutput('');
      setLineCount(0);
      return;
    }

    debounceRef.current = setTimeout(() => {
      let lines = input.split('\n');
      if (trimBlanks) {
        lines = lines.filter((l) => l.trim().length > 0);
      }
      const reversed = [...lines].reverse();
      setLineCount(reversed.length);
      setOutput(reversed.join('\n'));
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, trimBlanks]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text (lines will be reversed)
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"Line 1\nLine 2\nLine 3\nLine 4\nLine 5"}
          aria-label={`Text input for ${toolName}`}
          className="input-field h-40 resize-y font-mono text-sm"
        />
        <label className="flex items-center gap-2 text-sm text-gray-600 mt-2">
          <input
            type="checkbox"
            checked={trimBlanks}
            onChange={(e) => setTrimBlanks(e.target.checked)}
            className="rounded border-gray-300"
          />
          Remove blank lines before reversing
        </label>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Reversed Lines ({lineCount} line{lineCount !== 1 ? 's' : ''})
              </label>
              <CopyToClipboard text={output} />
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 p-4 bg-gray-50 rounded-lg border border-gray-100 max-h-64 overflow-y-auto">
              {output}
            </pre>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
