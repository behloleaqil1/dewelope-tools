'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ElixirStructGenerator - Generates Elixir struct definitions from JSON input.
 */
export default function ElixirStructGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [moduleName, setModuleName] = useState('MyStruct');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const inferDefault = (value: unknown): string => {
    if (value === null) return 'nil';
    if (typeof value === 'string') return `"${value}"`;
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (typeof value === 'number') return String(value);
    if (Array.isArray(value)) return '[]';
    if (typeof value === 'object') return '%{}';
    return 'nil';
  };

  const inferTypespec = (value: unknown): string => {
    if (value === null) return 'any()';
    if (typeof value === 'string') return 'String.t()';
    if (typeof value === 'boolean') return 'boolean()';
    if (typeof value === 'number') return Number.isInteger(value) ? 'integer()' : 'float()';
    if (Array.isArray(value)) return 'list()';
    if (typeof value === 'object') return 'map()';
    return 'any()';
  };

  const generate = () => {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter valid JSON');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        setError('JSON must be an object (not array or primitive)');
        return;
      }

      const entries = Object.entries(parsed);
      const fields = entries.map(([key, value]) => `    ${key}: ${inferDefault(value)}`).join(',\n');
      const typespecs = entries.map(([key, value]) => `          ${key}: ${inferTypespec(value)}`).join(',\n');

      const result = `defmodule ${moduleName} do
  @type t :: %__MODULE__{
${typespecs}
        }

  defstruct [
${fields}
  ]
end`;
      setOutput(result);
    } catch {
      setError('Invalid JSON input');
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-modulename`} className="block text-sm font-medium text-gray-700 mb-1">
          Module Name
        </label>
        <input
          id={`${toolId}-modulename`}
          type="text"
          value={moduleName}
          onChange={(e) => setModuleName(e.target.value)}
          placeholder="MyStruct"
          aria-label={`Module name for ${toolName}`}
          className="input-field mb-3"
        />
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          JSON Input
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"name": "John", "age": 30, "active": true}'
          aria-label={`JSON input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
      </InputArea>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button onClick={generate} aria-label="Generate Elixir struct" className="btn-primary">
        Generate Struct
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Elixir Struct</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
