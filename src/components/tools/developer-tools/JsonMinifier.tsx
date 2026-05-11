'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * JsonMinifier - Minifies JSON by removing all unnecessary whitespace and formatting.
 */
export default function JsonMinifier({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState<{ original: number; minified: number; saved: number } | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input.trim()) {
      setOutput('');
      setError('');
      setStats(null);
      return;
    }

    debounceRef.current = setTimeout(() => {
      try {
        const parsed = JSON.parse(input);
        const minified = JSON.stringify(parsed);
        setOutput(minified);
        setError('');
        setStats({
          original: input.length,
          minified: minified.length,
          saved: input.length - minified.length,
        });
      } catch (e) {
        setError(`Invalid JSON: ${(e as Error).message}`);
        setOutput('');
        setStats(null);
      }
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Paste JSON to minify
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{\n  "name": "example",\n  "value": 42\n}'
          aria-label={`JSON input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Minified JSON</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 p-4 bg-gray-50 rounded-lg border border-gray-100 max-h-64 overflow-y-auto break-all">
              {output}
            </pre>
            {stats && (
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-gray-50 p-2 rounded border border-gray-200">
                  <div className="text-sm font-bold text-gray-800">{stats.original}</div>
                  <div className="text-xs text-gray-500">Original (chars)</div>
                </div>
                <div className="bg-gray-50 p-2 rounded border border-gray-200">
                  <div className="text-sm font-bold text-gray-800">{stats.minified}</div>
                  <div className="text-xs text-gray-500">Minified (chars)</div>
                </div>
                <div className="bg-gray-50 p-2 rounded border border-gray-200">
                  <div className="text-sm font-bold text-green-600">{((stats.saved / stats.original) * 100).toFixed(1)}%</div>
                  <div className="text-xs text-gray-500">Saved</div>
                </div>
              </div>
            )}
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
