'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PerlHashGenerator - Generate Perl hash data structures from JSON input.
 * Converts JSON objects to Perl hash references with proper quoting and formatting.
 */
export default function PerlHashGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [varName, setVarName] = useState('$data');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function toPerlValue(value: unknown, indent: number): string {
    const pad = '    '.repeat(indent);
    if (value === null) return 'undef';
    if (typeof value === 'string') {
      const escaped = value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
      return `'${escaped}'`;
    }
    if (typeof value === 'number') return String(value);
    if (typeof value === 'boolean') return value ? '1' : '0';
    if (Array.isArray(value)) {
      if (value.length === 0) return '[]';
      const items = value.map(v => `${pad}    ${toPerlValue(v, indent + 1)}`).join(",\n");
      return `[\n${items}\n${pad}]`;
    }
    if (typeof value === 'object' && value !== null) {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) return '{}';
      const items = entries.map(([k, v]) => {
        const escaped = k.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        return `${pad}    '${escaped}' => ${toPerlValue(v, indent + 1)}`;
      }).join(",\n");
      return `{\n${items}\n${pad}}`;
    }
    return 'undef';
  }

  function generate() {
    setError('');
    setOutput('');
    const trimmed = input.trim();
    if (!trimmed) {
      setError('Please enter JSON input.');
      return;
    }
    try {
      const parsed = JSON.parse(trimmed);
      const perlValue = toPerlValue(parsed, 0);
      setOutput(`my ${varName} = ${perlValue};\n`);
    } catch {
      setError('Invalid JSON. Please check your input.');
    }
  }

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
          onChange={(e) => setVarName(e.target.value || '$data')}
          className="input-field mb-3"
          aria-label="Perl variable name"
        />
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          JSON Input
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"name": "John", "age": 30, "tags": ["perl", "dev"]}'
          aria-label={`JSON input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
        <button onClick={generate} className="btn-primary mt-2">Generate Perl Hash</button>
      </InputArea>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Perl Hash</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
