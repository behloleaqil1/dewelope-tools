'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * JsonSchemaGenerator - Generates a JSON Schema from a sample JSON object.
 * Infers types, required fields, and nested object/array structures.
 */
export default function JsonSchemaGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const inferSchema = (value: unknown): Record<string, unknown> => {
    if (value === null) return { type: 'null' };
    if (Array.isArray(value)) {
      if (value.length === 0) return { type: 'array', items: {} };
      return { type: 'array', items: inferSchema(value[0]) };
    }
    if (typeof value === 'object') {
      const properties: Record<string, unknown> = {};
      const required: string[] = [];
      for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
        properties[key] = inferSchema(val);
        required.push(key);
      }
      return { type: 'object', properties, required };
    }
    if (typeof value === 'number') {
      return Number.isInteger(value) ? { type: 'integer' } : { type: 'number' };
    }
    if (typeof value === 'boolean') return { type: 'boolean' };
    return { type: 'string' };
  };

  const generate = () => {
    setError('');
    setOutput('');
    if (!input.trim()) { setError('Please enter a JSON example'); return; }

    try {
      const parsed = JSON.parse(input);
      const schema = {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        ...inferSchema(parsed),
      };
      setOutput(JSON.stringify(schema, null, 2));
    } catch {
      setError('Invalid JSON input. Please check your syntax.');
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Paste JSON Example
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => { setInput(e.target.value); if (error) setError(''); }}
          placeholder='{\n  "name": "John",\n  "age": 30,\n  "active": true\n}'
          aria-label={`JSON input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
      </InputArea>

      <button onClick={generate} aria-label="Generate JSON Schema" className="btn-primary">
        Generate Schema
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated JSON Schema</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
