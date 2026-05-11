'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * EscapeUnescapeJson - Escape or unescape JSON strings.
 * Handles backslashes, quotes, newlines, tabs, and other special characters.
 */
export default function EscapeUnescapeJson({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'escape' | 'unescape'>('escape');
  const [error, setError] = useState('');

  const process = () => {
    setError('');
    if (!input.trim()) {
      setError('Please enter text to process');
      setOutput('');
      return;
    }

    try {
      if (mode === 'escape') {
        const escaped = JSON.stringify(input);
        // Remove surrounding quotes added by JSON.stringify
        setOutput(escaped.slice(1, -1));
      } else {
        // Wrap in quotes to make it a valid JSON string, then parse
        const unescaped = JSON.parse(`"${input}"`);
        setOutput(unescaped);
      }
    } catch {
      setError(mode === 'unescape' ? 'Invalid escaped JSON string' : 'Failed to escape input');
      setOutput('');
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex gap-4 mb-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={`${toolId}-mode`}
            checked={mode === 'escape'}
            onChange={() => setMode('escape')}
            className="accent-blue-600"
          />
          <span className="text-sm font-medium text-gray-700">Escape</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={`${toolId}-mode`}
            checked={mode === 'unescape'}
            onChange={() => setMode('unescape')}
            className="accent-blue-600"
          />
          <span className="text-sm font-medium text-gray-700">Unescape</span>
        </label>
      </div>

      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          {mode === 'escape' ? 'Enter text to escape' : 'Enter escaped JSON string'}
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'escape' ? 'Enter text with special characters...' : 'Enter escaped string like Hello\\nWorld...'}
          aria-label={`Input for ${toolName}`}
          className="input-field h-40 resize-y font-mono"
        />
      </InputArea>

      <button onClick={process} aria-label={`${mode === 'escape' ? 'Escape' : 'Unescape'} JSON string`} className="btn-primary">
        {mode === 'escape' ? 'Escape' : 'Unescape'}
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
