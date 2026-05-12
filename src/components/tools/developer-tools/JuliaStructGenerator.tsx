'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * JuliaStructGenerator - Generate Julia struct definitions from JSON input.
 * Automatically infers field types including nested structs, vectors, and union types.
 */
export default function JuliaStructGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [structName, setStructName] = useState('Root');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function inferType(value: unknown, fieldName: string, structs: string[]): string {
    if (value === null) return 'Union{String, Nothing}';
    if (typeof value === 'string') return 'String';
    if (typeof value === 'number') return Number.isInteger(value) ? 'Int64' : 'Float64';
    if (typeof value === 'boolean') return 'Bool';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'Vector{Any}';
      const itemType = inferType(value[0], fieldName, structs);
      return `Vector{${itemType}}`;
    }
    if (typeof value === 'object') {
      const nestedName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      generateStruct(value as Record<string, unknown>, nestedName, structs);
      return nestedName;
    }
    return 'Any';
  }

  function toSnakeCase(str: string): string {
    return str.replace(/([A-Z])/g, '_$1').replace(/^_/, '').toLowerCase().replace(/[^a-z0-9_]/g, '_');
  }

  function generateStruct(obj: Record<string, unknown>, name: string, structs: string[]): void {
    const lines: string[] = [];
    lines.push(`struct ${name}`);
    for (const [key, value] of Object.entries(obj)) {
      const fieldName = toSnakeCase(key);
      const fieldType = inferType(value, key, structs);
      lines.push(`    ${fieldName}::${fieldType}`);
    }
    lines.push('end');
    structs.push(lines.join('\n'));
  }

  function handleGenerate() {
    setError('');
    setOutput('');
    if (!input.trim()) {
      setError('Please enter a JSON object.');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        setError('Input must be a JSON object (not an array or primitive).');
        return;
      }
      const structs: string[] = [];
      generateStruct(parsed, structName || 'Root', structs);
      setOutput(structs.reverse().join('\n\n'));
    } catch {
      setError('Invalid JSON. Please check your input.');
    }
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
          Struct Name
        </label>
        <input
          id={`${toolId}-name`}
          type="text"
          value={structName}
          onChange={(e) => setStructName(e.target.value)}
          placeholder="Root"
          aria-label="Julia struct name"
          className="input-field mb-3"
        />
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          JSON Input
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"name": "Alice", "age": 30, "active": true}'
          aria-label={`JSON input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
        <button onClick={handleGenerate} className="btn-primary mt-2">Generate Julia Struct</button>
      </InputArea>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Julia Struct</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
