'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * YupSchemaGenerator - Generate Yup validation schema from JSON input.
 * Analyzes JSON structure and produces corresponding Yup schema code.
 */
export default function YupSchemaGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function inferYupType(value: unknown, key: string, indent: number): string {
    const pad = '  '.repeat(indent);
    if (value === null || value === undefined) {
      return `${pad}${key}: yup.mixed().nullable()`;
    }
    if (Array.isArray(value)) {
      if (value.length > 0) {
        const itemType = inferYupArrayItem(value[0], indent + 1);
        return `${pad}${key}: yup.array().of(${itemType})`;
      }
      return `${pad}${key}: yup.array()`;
    }
    if (typeof value === 'object') {
      const fields = Object.entries(value as Record<string, unknown>)
        .map(([k, v]) => inferYupType(v, k, indent + 1))
        .join(',\n');
      return `${pad}${key}: yup.object().shape({\n${fields}\n${pad}})`;
    }
    if (typeof value === 'string') {
      if (/^\d{4}-\d{2}-\d{2}/.test(value)) return `${pad}${key}: yup.date()`;
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return `${pad}${key}: yup.string().email()`;
      if (/^https?:\/\//.test(value)) return `${pad}${key}: yup.string().url()`;
      return `${pad}${key}: yup.string()`;
    }
    if (typeof value === 'number') {
      return Number.isInteger(value) ? `${pad}${key}: yup.number().integer()` : `${pad}${key}: yup.number()`;
    }
    if (typeof value === 'boolean') {
      return `${pad}${key}: yup.boolean()`;
    }
    return `${pad}${key}: yup.mixed()`;
  }

  function inferYupArrayItem(value: unknown, indent: number): string {
    if (value === null || value === undefined) return 'yup.mixed()';
    if (typeof value === 'string') return 'yup.string()';
    if (typeof value === 'number') return Number.isInteger(value) ? 'yup.number().integer()' : 'yup.number()';
    if (typeof value === 'boolean') return 'yup.boolean()';
    if (typeof value === 'object' && !Array.isArray(value)) {
      const pad = '  '.repeat(indent);
      const fields = Object.entries(value as Record<string, unknown>)
        .map(([k, v]) => inferYupType(v, k, indent + 1))
        .join(',\n');
      return `yup.object().shape({\n${fields}\n${pad}})`;
    }
    return 'yup.mixed()';
  }

  function generate() {
    setError('');
    setOutput('');
    if (!input.trim()) { setError('Please enter JSON'); return; }

    try {
      const parsed = JSON.parse(input);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        setError('Input must be a JSON object');
        return;
      }

      const fields = Object.entries(parsed)
        .map(([k, v]) => inferYupType(v, k, 1))
        .join(',\n');

      const schema = `import * as yup from 'yup';\n\nconst schema = yup.object().shape({\n${fields}\n});\n\nexport default schema;`;
      setOutput(schema);
    } catch {
      setError('Invalid JSON input');
    }
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          JSON Input
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

      <button onClick={generate} aria-label="Generate Yup schema" className="btn-primary">
        Generate Yup Schema
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Yup Schema</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
