'use client';

import { useState, useEffect, useRef } from 'react';
import { ToolEngineProps } from '@/types';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';
import { formatJson } from '@/lib/developer-tools';

const MAX_LENGTH = 1048576; // 1MB

/**
 * JsonFormatter - Validates and pretty-prints JSON with syntax highlighting.
 * Displays error position (line/character) for malformed input.
 * Requirements: 6.2, 6.3, 6.4, 6.5, 6.6, 6.7
 */
export default function JsonFormatter({ toolId }: ToolEngineProps) {
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

    if (input.length > MAX_LENGTH) {
      setError(`Input exceeds maximum size of 1 MB (${MAX_LENGTH.toLocaleString()} characters)`);
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      const result = formatJson(input);
      if (result.valid) {
        setOutput(result.formatted);
        setError(undefined);
      } else {
        setOutput('');
        const posInfo = result.error?.line
          ? ` (line ${result.error.line}, character ${result.error.character})`
          : '';
        setError(`${result.error?.message || 'Invalid JSON'}${posInfo}`);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [input]);

  /**
   * Syntax-highlight JSON output with colored tokens.
   */
  function highlightJson(json: string): React.ReactNode {
    const parts: React.ReactNode[] = [];

    // Simple token-based highlighting
    const tokens = json.split(/("(?:\\.|[^"\\])*")|(\b(?:true|false|null)\b)|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g);

    tokens.forEach((token, i) => {
      if (token === undefined || token === '') return;

      if (/^".*"$/.test(token)) {
        // Check if it's a key (followed by colon in original)
        const afterToken = tokens.slice(i + 1).join('');
        if (afterToken.trimStart().startsWith(':')) {
          parts.push(<span key={i} className="text-purple-700">{token}</span>);
        } else {
          parts.push(<span key={i} className="text-green-700">{token}</span>);
        }
      } else if (/^(true|false|null)$/.test(token)) {
        parts.push(<span key={i} className="text-blue-700 font-semibold">{token}</span>);
      } else if (/^-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?$/.test(token)) {
        parts.push(<span key={i} className="text-orange-600">{token}</span>);
      } else {
        parts.push(<span key={i}>{token}</span>);
      }
    });

    return parts;
  }

  return (
    <div className="space-y-4">
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter JSON
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Paste your JSON here, e.g. {"key": "value"}'
          aria-label="JSON input for formatting and validation"
          className="w-full h-56 p-3 border border-gray-300 rounded-lg resize-y font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="text-xs text-gray-500 text-right">
          {input.length.toLocaleString()} / {MAX_LENGTH.toLocaleString()} characters
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono bg-white p-3 rounded border border-gray-200 overflow-x-auto">
              {highlightJson(output)}
            </pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
