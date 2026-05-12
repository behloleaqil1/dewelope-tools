'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * VLangStructGenerator - Generate V language struct definitions from JSON input.
 */
export default function VLangStructGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [structName, setStructName] = useState('Root');
  const [error, setError] = useState('');

  function toSnakeCase(str: string): string {
    return str
      .replace(/([A-Z])/g, '_$1')
      .replace(/[-\s]+/g, '_')
      .toLowerCase()
      .replace(/^_/, '')
      .replace(/_+/g, '_');
  }

  function toPascalCase(str: string): string {
    return str
      .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
      .replace(/^(.)/, (_, c) => c.toUpperCase());
  }

  function inferVType(value: unknown, key: string, structs: string[]): string {
    if (value === null) return '?string';
    if (typeof value === 'string') return 'string';
    if (typeof value === 'number') {
      return Number.isInteger(value) ? 'int' : 'f64';
    }
    if (typeof value === 'boolean') return 'bool';
    if (Array.isArray(value)) {
      if (value.length === 0) return '[]string';
      const elemType = inferVType(value[0], key, structs);
      return `[]${elemType}`;
    }
    if (typeof value === 'object') {
      const nestedName = toPascalCase(key);
      generateStruct(value as Record<string, unknown>, nestedName, structs);
      return nestedName;
    }
    return 'string';
  }

  function generateStruct(obj: Record<string, unknown>, name: string, structs: string[]): void {
    const fields: string[] = [];
    for (const [key, value] of Object.entries(obj)) {
      const fieldName = toSnakeCase(key);
      const vType = inferVType(value, key, structs);
      fields.push(`\t${fieldName} ${vType}`);
    }
    structs.push(`struct ${name} {\n${fields.join('\n')}\n}`);
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
      const structs: string[] = [];
      generateStruct(parsed as Record<string, unknown>, structName || 'Root', structs);
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
          aria-label={`Struct name for ${toolName}`}
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
          Generate V Struct
        </button>
      </InputArea>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">V Struct Output</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
