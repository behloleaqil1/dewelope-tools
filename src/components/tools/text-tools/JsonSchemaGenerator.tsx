'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * JsonSchemaGenerator - Generate JSON Schema from sample JSON data.
 */
export default function JsonSchemaGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

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
        if (val !== null && val !== undefined) required.push(key);
      }
      return { type: 'object', properties, required };
    }
    if (typeof value === 'string') {
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return { type: 'string', format: 'date' };
      if (/^\d{4}-\d{2}-\d{2}T/.test(value)) return { type: 'string', format: 'date-time' };
      if (/^[^@]+@[^@]+\.[^@]+$/.test(value)) return { type: 'string', format: 'email' };
      if (/^https?:\/\//.test(value)) return { type: 'string', format: 'uri' };
      return { type: 'string' };
    }
    if (typeof value === 'number') {
      return Number.isInteger(value) ? { type: 'integer' } : { type: 'number' };
    }
    if (typeof value === 'boolean') return { type: 'boolean' };
    return { type: 'string' };
  };

  const generate = () => {
    setError('');
    setResult('');
    if (!input.trim()) { setError('Please enter JSON data.'); return; }

    try {
      const parsed = JSON.parse(input);
      const schema = {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        ...inferSchema(parsed),
      };
      setResult(JSON.stringify(schema, null, 2));
    } catch {
      setError('Invalid JSON. Please check the input.');
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Sample JSON</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder={'{\n  "name": "John",\n  "age": 30,\n  "email": "john@example.com"\n}'} rows={8} aria-label={`JSON input for ${toolName}`} className="input-field font-mono" />
      </InputArea>

      <button onClick={generate} className="btn-primary" aria-label="Generate JSON Schema">Generate Schema</button>

      <OutputArea hasContent={result.length > 0}>
        {result && (
          <div className="space-y-3">
            <pre className="text-sm bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto whitespace-pre-wrap font-mono max-h-96">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
