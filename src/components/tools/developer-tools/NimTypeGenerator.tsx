'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NimTypeGenerator - Generate Nim object type definitions from JSON input.
 */
export default function NimTypeGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [typeName, setTypeName] = useState('Root');
  const [error, setError] = useState('');

  function toCamelCase(str: string): string {
    return str
      .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
      .replace(/^(.)/, (_, c) => c.toLowerCase());
  }

  function toPascalCase(str: string): string {
    return str
      .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
      .replace(/^(.)/, (_, c) => c.toUpperCase());
  }

  function inferNimType(value: unknown, key: string, types: string[]): string {
    if (value === null) return 'Option[string]';
    if (typeof value === 'string') return 'string';
    if (typeof value === 'number') {
      return Number.isInteger(value) ? 'int' : 'float64';
    }
    if (typeof value === 'boolean') return 'bool';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'seq[string]';
      const elemType = inferNimType(value[0], key, types);
      return `seq[${elemType}]`;
    }
    if (typeof value === 'object') {
      const nestedName = toPascalCase(key);
      generateType(value as Record<string, unknown>, nestedName, types);
      return nestedName;
    }
    return 'string';
  }

  function generateType(obj: Record<string, unknown>, name: string, types: string[]): void {
    const fields: string[] = [];
    for (const [key, value] of Object.entries(obj)) {
      const fieldName = toCamelCase(key);
      const nimType = inferNimType(value, key, types);
      fields.push(`    ${fieldName}*: ${nimType}`);
    }
    types.push(`  ${name}* = object\n${fields.join('\n')}`);
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
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        setError('Input must be a JSON object.');
        return;
      }
      const types: string[] = [];
      generateType(parsed as Record<string, unknown>, typeName || 'Root', types);
      setOutput(`type\n${types.reverse().join('\n\n')}`);
    } catch {
      setError('Invalid JSON. Please check your input.');
    }
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
          Type Name
        </label>
        <input
          id={`${toolId}-name`}
          type="text"
          value={typeName}
          onChange={(e) => setTypeName(e.target.value)}
          placeholder="Root"
          aria-label={`Type name for ${toolName}`}
          className="input-field mb-3"
        />
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          JSON Input
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"name": "example", "age": 25, "active": true}'
          aria-label={`JSON input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
        <button
          onClick={handleGenerate}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Generate Nim Type
        </button>
      </InputArea>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Nim Type Output</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
