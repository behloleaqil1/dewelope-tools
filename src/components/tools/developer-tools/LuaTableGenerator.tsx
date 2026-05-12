'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * LuaTableGenerator - Generate Lua table constructor from JSON input.
 */
export default function LuaTableGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [varName, setVarName] = useState('data');
  const [error, setError] = useState('');

  function toLuaValue(value: unknown, indent: number): string {
    const pad = '  '.repeat(indent);
    const padInner = '  '.repeat(indent + 1);

    if (value === null) return 'nil';
    if (typeof value === 'string') return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (typeof value === 'number') return String(value);

    if (Array.isArray(value)) {
      if (value.length === 0) return '{}';
      const items = value.map((v) => `${padInner}${toLuaValue(v, indent + 1)}`);
      return `{\n${items.join(',\n')}\n${pad}}`;
    }

    if (typeof value === 'object' && value !== null) {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) return '{}';
      const items = entries.map(([k, v]) => {
        const key = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(k) ? k : `["${k}"]`;
        return `${padInner}${key} = ${toLuaValue(v, indent + 1)}`;
      });
      return `{\n${items.join(',\n')}\n${pad}}`;
    }

    return 'nil';
  }

  function handleGenerate() {
    setError('');
    setOutput('');
    if (!input.trim()) {
      setError('Please enter JSON input.');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const luaTable = toLuaValue(parsed, 0);
      const result = `local ${varName || 'data'} = ${luaTable}`;
      setOutput(result);
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
          onChange={(e) => setVarName(e.target.value)}
          placeholder="data"
          aria-label="Lua variable name"
          className="input-field mb-3"
        />
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          JSON Input
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"name": "hello", "items": [1, 2, 3]}'
          aria-label={`JSON input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
        <button
          onClick={handleGenerate}
          className="btn-primary mt-2"
        >
          Generate Lua Table
        </button>
      </InputArea>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Lua Table</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
