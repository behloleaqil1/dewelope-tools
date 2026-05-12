'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AjvSchemaGenerator - Generate AJV-compatible JSON Schema from JSON data.
 * Infers types, formats, required fields, and nested structures.
 */
export default function AjvSchemaGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function inferSchema(value: unknown): Record<string, unknown> {
    if (value === null) return { type: 'null' };
    if (Array.isArray(value)) {
      if (value.length === 0) return { type: 'array', items: {} };
      return { type: 'array', items: inferSchema(value[0]) };
    }
    if (typeof value === 'object') {
      const obj = value as Record<string, unknown>;
      const properties: Record<string, unknown> = {};
      const required: string[] = [];
      for (const key of Object.keys(obj)) {
        properties[key] = inferSchema(obj[key]);
        if (obj[key] !== null && obj[key] !== undefined) {
          required.push(key);
        }
      }
      const schema: Record<string, unknown> = {
        type: 'object',
        properties,
        additionalProperties: false,
      };
      if (required.length > 0) schema.required = required;
      return schema;
    }
    if (typeof value === 'string') {
      if (/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/.test(value)) return { type: 'string', format: 'date-time' };
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return { type: 'string', format: 'email' };
      if (/^https?:\/\//.test(value)) return { type: 'string', format: 'uri' };
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) return { type: 'string', format: 'uuid' };
      return { type: 'string' };
    }
    if (typeof value === 'number') {
      return Number.isInteger(value) ? { type: 'integer' } : { type: 'number' };
    }
    if (typeof value === 'boolean') return { type: 'boolean' };
    return {};
  }

  function handleGenerate() {
    setError('');
    setOutput('');
    if (!input.trim()) {
      setError('Please enter JSON data');
      return;
    }
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
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          JSON Data
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"name": "John", "age": 30, "email": "john@example.com"}'
          aria-label={`JSON input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
      </InputArea>

      <button onClick={handleGenerate} aria-label="Generate AJV schema" className="btn-primary">
        Generate AJV Schema
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated JSON Schema</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
