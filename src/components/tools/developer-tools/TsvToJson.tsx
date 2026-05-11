'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TsvToJson - Converts TSV (tab-separated values) to JSON array of objects.
 * Uses the first row as headers/keys for the resulting JSON objects.
 */
export default function TsvToJson({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [useFirstRowAsHeaders, setUseFirstRowAsHeaders] = useState(true);
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
        const lines = input.split('\n').filter((line) => line.trim() !== '');
        if (lines.length === 0) {
          setOutput('');
          setError('');
          return;
        }

        if (useFirstRowAsHeaders) {
          const headers = lines[0].split('\t').map((h) => h.trim());
          const result = lines.slice(1).map((line) => {
            const values = line.split('\t');
            const obj: Record<string, string> = {};
            headers.forEach((header, i) => {
              obj[header] = values[i]?.trim() ?? '';
            });
            return obj;
          });
          setOutput(JSON.stringify(result, null, 2));
        } else {
          const result = lines.map((line) => line.split('\t').map((v) => v.trim()));
          setOutput(JSON.stringify(result, null, 2));
        }
        setError('');
      } catch {
        setError('Failed to parse TSV input');
        setOutput('');
      }
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, useFirstRowAsHeaders]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Paste TSV data
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"Name\tAge\tCity\nAlice\t30\tNew York\nBob\t25\tLondon"}
          aria-label={`TSV input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
        <div className="mt-2">
          <label className="inline-flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={useFirstRowAsHeaders}
              onChange={(e) => setUseFirstRowAsHeaders(e.target.checked)}
              className="rounded border-gray-300"
            />
            Use first row as headers
          </label>
        </div>
      </InputArea>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">JSON Output</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all max-h-96 overflow-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
