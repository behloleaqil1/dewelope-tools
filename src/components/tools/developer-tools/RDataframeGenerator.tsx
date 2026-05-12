'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RDataframeGenerator - Generate R data.frame code from JSON input.
 * Parses JSON objects/arrays and produces equivalent R data.frame() constructor code.
 */
export default function RDataframeGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [varName, setVarName] = useState('df');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const generate = () => {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter JSON input.');
      return;
    }

    try {
      let data = JSON.parse(input.trim());

      // Normalize: if single object, wrap in array
      if (!Array.isArray(data)) {
        data = [data];
      }

      if (data.length === 0) {
        setError('JSON array is empty.');
        return;
      }

      // Collect all keys
      const keys = new Set<string>();
      data.forEach((row: Record<string, unknown>) => {
        Object.keys(row).forEach((k) => keys.add(k));
      });

      const columns = Array.from(keys);
      const lines: string[] = [];
      lines.push(`${varName} <- data.frame(`);

      columns.forEach((col, idx) => {
        const values = data.map((row: Record<string, unknown>) => {
          const val = row[col];
          if (val === null || val === undefined) return 'NA';
          if (typeof val === 'string') return `"${val.replace(/"/g, '\\"')}"`;
          if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
          return String(val);
        });

        const rVec = `c(${values.join(', ')})`;
        const comma = idx < columns.length - 1 ? ',' : '';
        lines.push(`  ${col} = ${rVec}${comma}`);
      });

      lines.push(')');
      setOutput(lines.join('\n'));
    } catch {
      setError('Invalid JSON. Please enter a valid JSON object or array of objects.');
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-varname`} className="block text-sm font-medium text-gray-700 mb-1">
          Variable Name
        </label>
        <input
          id={`${toolId}-varname`}
          type="text"
          value={varName}
          onChange={(e) => setVarName(e.target.value || 'df')}
          placeholder="df"
          aria-label={`Variable name for ${toolName}`}
          className="input-field mb-3"
        />
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          JSON Input
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='[{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}]'
          aria-label={`JSON input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
        <button
          onClick={generate}
          className="btn-primary mt-2"
        >
          Generate R data.frame
        </button>
      </InputArea>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">R data.frame Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
