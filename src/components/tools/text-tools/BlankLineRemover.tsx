'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BlankLineRemover - Removes all blank/empty lines from text.
 * Different from whitespace remover: focuses specifically on removing empty lines.
 */
export default function BlankLineRemover({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'all' | 'consecutive'>('all');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input) {
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      if (mode === 'all') {
        // Remove all blank lines (lines that are empty or contain only whitespace)
        const result = input
          .split('\n')
          .filter((line) => line.trim().length > 0)
          .join('\n');
        setOutput(result);
      } else {
        // Collapse consecutive blank lines into a single blank line
        const result = input.replace(/(\n\s*){3,}/g, '\n\n').replace(/^\s*\n/, '').replace(/\n\s*$/, '');
        setOutput(result);
      }
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, mode]);

  const linesRemoved = input && output ? input.split('\n').length - output.split('\n').length : 0;

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Text with blank lines
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste text with blank lines to remove..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-40 resize-y font-mono text-sm"
        />
        <div className="flex gap-4 mt-3">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="radio"
              name={`${toolId}-mode`}
              checked={mode === 'all'}
              onChange={() => setMode('all')}
              className="text-blue-600"
            />
            Remove all blank lines
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="radio"
              name={`${toolId}-mode`}
              checked={mode === 'consecutive'}
              onChange={() => setMode('consecutive')}
              className="text-blue-600"
            />
            Collapse to single blank line
          </label>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Result {linesRemoved > 0 && <span className="text-green-600 font-normal">({linesRemoved} lines removed)</span>}
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
