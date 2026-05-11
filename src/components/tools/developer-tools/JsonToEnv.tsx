'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * JsonToEnv - Converts a JSON object to .env file format (KEY=value).
 * Supports nested objects with underscore-separated keys and arrays as comma-separated values.
 */
export default function JsonToEnv({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [prefix, setPrefix] = useState('');
  const [quoteValues, setQuoteValues] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      try {
        const parsed = JSON.parse(input);
        if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
          setError('Input must be a JSON object (not an array or primitive)');
          setOutput('');
          return;
        }

        const lines: string[] = [];
        const flatten = (obj: Record<string, unknown>, parentKey: string) => {
          for (const [key, value] of Object.entries(obj)) {
            const envKey = parentKey ? `${parentKey}_${key.toUpperCase().replace(/[^A-Z0-9_]/g, '_')}` : key.toUpperCase().replace(/[^A-Z0-9_]/g, '_');
            if (value === null || value === undefined) {
              lines.push(`${envKey}=`);
            } else if (typeof value === 'object' && !Array.isArray(value)) {
              flatten(value as Record<string, unknown>, envKey);
            } else if (Array.isArray(value)) {
              const val = value.join(',');
              lines.push(`${envKey}=${quoteValues ? `"${val}"` : val}`);
            } else {
              const val = String(value);
              const needsQuotes = quoteValues || val.includes(' ') || val.includes('#');
              lines.push(`${envKey}=${needsQuotes ? `"${val}"` : val}`);
            }
          }
        };

        const keyPrefix = prefix.trim() ? prefix.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_') : '';
        flatten(parsed, keyPrefix);
        setOutput(lines.join('\n'));
        setError('');
      } catch {
        setError('Invalid JSON input');
        setOutput('');
      }
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, prefix, quoteValues]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          JSON Input
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"database": {"host": "localhost", "port": 5432}, "debug": true}'
          aria-label={`JSON input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
      </InputArea>

      <div className="flex flex-wrap gap-4">
        <div>
          <label htmlFor={`${toolId}-prefix`} className="block text-sm font-medium text-gray-700 mb-1">
            Key Prefix (optional)
          </label>
          <input
            id={`${toolId}-prefix`}
            type="text"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            placeholder="e.g. APP"
            aria-label="Key prefix"
            className="input-field w-40"
          />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={quoteValues}
              onChange={(e) => setQuoteValues(e.target.checked)}
              className="rounded border-gray-300"
            />
            Quote all values
          </label>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">.env Output</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
