'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RubyHashGenerator - Generate Ruby hash syntax from JSON input.
 * Converts JSON objects to Ruby hash notation with symbol or string keys.
 */
export default function RubyHashGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [useSymbols, setUseSymbols] = useState(true);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const toRuby = (value: unknown, indent: number): string => {
    const pad = '  '.repeat(indent);
    const padInner = '  '.repeat(indent + 1);

    if (value === null) return 'nil';
    if (typeof value === 'string') return `"${value.replace(/"/g, '\\"')}"`;
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (typeof value === 'number') return String(value);
    if (Array.isArray(value)) {
      if (value.length === 0) return '[]';
      const items = value.map((v) => `${padInner}${toRuby(v, indent + 1)}`).join(",\n");
      return `[\n${items}\n${pad}]`;
    }
    if (typeof value === 'object' && value !== null) {
      const entries = Object.entries(value);
      if (entries.length === 0) return '{}';
      const items = entries.map(([k, v]) => {
        const key = useSymbols ? `${k}:` : `"${k}" =>`;
        return `${padInner}${key} ${toRuby(v, indent + 1)}`;
      }).join(",\n");
      return `{\n${items}\n${pad}}`;
    }
    return 'nil';
  };

  const generate = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      const result = toRuby(parsed, 0);
      setOutput(result);
    } catch {
      setError('Invalid JSON input.');
      setOutput('');
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          JSON Input
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"name": "Alice", "age": 25, "tags": ["ruby", "dev"]}'
          aria-label={`JSON input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
        <label className="flex items-center gap-2 mt-3 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={useSymbols}
            onChange={(e) => setUseSymbols(e.target.checked)}
            className="rounded border-gray-300"
          />
          Use symbol keys (name: value) instead of string keys (&quot;name&quot; =&gt; value)
        </label>
      </InputArea>

      <button onClick={generate} className="btn-primary">Generate Ruby Hash</button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
