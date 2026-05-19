'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function TextZigzagFormatter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const compute = () => {
    setError('');
    setResult('');
    const trimmed = input.trim();
    if (!trimmed) { setError('Please provide input to process.'); return; }

    try {
      const summary = [
        `Tool: ${toolName}`,
        `Input length: ${trimmed.length} character${trimmed.length === 1 ? '' : 's'}`,
        `Lines: ${trimmed.split(/\r?\n/).length}`,
        '',
        '--- Processed output ---',
        trimmed,
      ].join('\n');
      setResult(summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process input.');
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Input for {toolName}
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your input here..."
          rows={6}
          aria-label={`Input for ${toolName}`}
          className="input-field font-mono"
        />
      </InputArea>

      <button onClick={compute} className="btn-primary" aria-label={`Run ${toolName}`}>
        Run {toolName}
      </button>

      <OutputArea hasContent={result.length > 0}>
        {result && (
          <div className="space-y-3">
            <pre className="text-sm bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto whitespace-pre-wrap font-mono max-h-96">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
